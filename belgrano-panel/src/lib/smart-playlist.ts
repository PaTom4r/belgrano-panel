export interface PlaylistItem {
  id: string;
  contentId: string;
  campaignId: string | null;
  advertiserId: string | null;
  priority: number; // 1-10, higher = more frequent
  weight: number; // campaign weight for balancing
  maxPlaysPerDay: number | null; // frequency cap
  todayPlays: number; // already played today
  duration: number; // seconds
  type: "video" | "image" | "html5";
  name: string;
}

export interface SmartPlaylistResult {
  items: PlaylistItem[];
  totalDuration: number;
  advertisersBalanced: boolean;
}

export interface AdvertiserShare {
  advertiserId: string;
  targetPercent: number;
  actualPercent: number;
  itemCount: number;
}

/**
 * Build a smart playlist from candidate items.
 *
 * Logic:
 * 1. Filter out items that hit frequency cap (todayPlays >= maxPlaysPerDay)
 * 2. Sort by priority (descending)
 * 3. Within same priority level, balance by weight (weighted round-robin)
 * 4. High-priority items appear more often proportionally
 * 5. Respect maxDuration if provided
 */
export function buildSmartPlaylist(
  items: PlaylistItem[],
  maxDuration?: number
): SmartPlaylistResult {
  // Step 1: filter out capped items
  const eligible = items.filter(
    (item) =>
      item.maxPlaysPerDay === null || item.todayPlays < item.maxPlaysPerDay
  );

  if (eligible.length === 0) {
    return { items: [], totalDuration: 0, advertisersBalanced: true };
  }

  // Step 2: group by priority level
  const priorityGroups = new Map<number, PlaylistItem[]>();
  for (const item of eligible) {
    const group = priorityGroups.get(item.priority) ?? [];
    group.push(item);
    priorityGroups.set(item.priority, group);
  }

  // Sort priority levels descending
  const sortedPriorities = [...priorityGroups.keys()].sort((a, b) => b - a);

  // Step 3: build sequence using weighted round-robin within each priority group
  // Higher-priority groups get proportionally more slots
  const result: PlaylistItem[] = [];
  let totalDuration = 0;

  // Calculate total priority weight for proportional slot allocation
  const totalPriorityWeight = sortedPriorities.reduce((sum, p) => sum + p, 0);

  // Target total slots: eligible items * 2 gives a good loop length
  const targetSlots = maxDuration
    ? Math.ceil(maxDuration / 15) // approximate 15s average
    : eligible.length * 2;

  for (const priority of sortedPriorities) {
    const group = priorityGroups.get(priority)!;
    const proportionalSlots = Math.max(
      1,
      Math.round((priority / totalPriorityWeight) * targetSlots)
    );

    // Weighted round-robin within this priority group
    const groupItems = weightedRoundRobin(group, proportionalSlots);

    for (const item of groupItems) {
      if (maxDuration && totalDuration + item.duration > maxDuration) {
        break;
      }
      result.push(item);
      totalDuration += item.duration;
    }
  }

  // Step 4: check advertiser balance
  const advertisersBalanced = checkAdvertiserBalance(result);

  return { items: result, totalDuration, advertisersBalanced };
}

/**
 * Weighted round-robin: distribute slots among items based on their weight.
 * Items with higher weight appear more often.
 */
function weightedRoundRobin(
  items: PlaylistItem[],
  totalSlots: number
): PlaylistItem[] {
  if (items.length === 0) return [];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return items.slice(0, totalSlots);

  const result: PlaylistItem[] = [];
  // Track fractional accumulation for fair distribution
  const counters = items.map(() => 0);

  for (let slot = 0; slot < totalSlots; slot++) {
    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < items.length; i++) {
      const targetFraction = items[i].weight / totalWeight;
      const currentFraction =
        result.length > 0
          ? counters[i] / result.length
          : 0;
      // Score = how far behind this item is from its target share
      const score = targetFraction - currentFraction;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    result.push(items[bestIndex]);
    counters[bestIndex]++;
  }

  return result;
}

/**
 * Check if advertisers are reasonably balanced (within 10% of target).
 */
function checkAdvertiserBalance(items: PlaylistItem[]): boolean {
  if (items.length === 0) return true;

  const shares = getAdvertiserShares(items);
  // All advertisers within 10 percentage points of target
  return shares.every(
    (s) => Math.abs(s.actualPercent - s.targetPercent) < 10
  );
}

/**
 * Calculate each advertiser's share of the playlist.
 */
export function getAdvertiserShares(
  items: PlaylistItem[]
): AdvertiserShare[] {
  if (items.length === 0) return [];

  // Group by advertiser (null = clinic/internal content)
  const advertiserItems = new Map<string, PlaylistItem[]>();
  for (const item of items) {
    const key = item.advertiserId ?? "_internal";
    const group = advertiserItems.get(key) ?? [];
    group.push(item);
    advertiserItems.set(key, group);
  }

  // Calculate total weight per advertiser
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  const shares: AdvertiserShare[] = [];
  for (const [advertiserId, advItems] of advertiserItems) {
    const advertiserWeight = advItems.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    shares.push({
      advertiserId,
      targetPercent:
        totalWeight > 0 ? (advertiserWeight / totalWeight) * 100 : 0,
      actualPercent: (advItems.length / items.length) * 100,
      itemCount: advItems.length,
    });
  }

  return shares.sort((a, b) => b.targetPercent - a.targetPercent);
}

/**
 * Simulate a full day of playlist playback.
 * Returns how many times each item would play across the given hours.
 */
export function simulateDay(
  items: PlaylistItem[],
  hoursToSimulate: number = 14
): { itemId: string; name: string; plays: number; advertiserId: string | null }[] {
  const totalSeconds = hoursToSimulate * 3600;
  const playlist = buildSmartPlaylist(items, totalSeconds);

  // Count occurrences
  const playCounts = new Map<string, number>();
  for (const item of playlist.items) {
    playCounts.set(item.id, (playCounts.get(item.id) ?? 0) + 1);
  }

  return items.map((item) => ({
    itemId: item.id,
    name: item.name,
    plays: playCounts.get(item.id) ?? 0,
    advertiserId: item.advertiserId,
  }));
}
