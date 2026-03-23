import type { MagicInfoDevice, MagicInfoPlayLog, MagicInfoDeviceGroup } from "./types";

const zones = ["Lobby Principal", "Urgencias", "Pediatría", "Cardiología", "Traumatología", "Maternidad", "Oncología", "Cafetería", "Pasillos Piso 1", "Pasillos Piso 2"];
const models = ["Samsung QM55R", "Samsung QM43R", "Samsung QM32R", "Samsung QH55R", "Samsung QB65R"];
const tizenVersions = ["6.5", "7.0", "7.5", "8.0"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockDevices(count = 70): MagicInfoDevice[] {
  return Array.from({ length: count }, (_, i) => {
    const zone = zones[i % zones.length];
    const isOnline = Math.random() > 0.05; // 95% online
    return {
      deviceId: `DEV-${String(i + 1).padStart(3, "0")}`,
      deviceName: `CLC-${zone.replace(/\s/g, "-")}-${(i % 7) + 1}`,
      deviceModelName: randomFrom(models),
      deviceType: "SMART_SIGNAGE",
      ipAddress: `192.168.10.${100 + i}`,
      macAddress: `00:1A:2B:3C:${String(i).padStart(2, "0")}:FF`,
      firmwareVersion: `T-HKMLAKUC-${1400 + Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 9)}`,
      status: isOnline ? "CONNECTED" : "DISCONNECTED",
      resolution: i % 10 === 0 ? "1080x1920" : "1920x1080",
      displayOrientation: i % 10 === 0 ? "PORTRAIT" : "LANDSCAPE",
      lastConnectionTime: isOnline
        ? new Date().toISOString()
        : new Date(Date.now() - Math.random() * 86400000).toISOString(),
      groupId: `GRP-${String((i % zones.length) + 1).padStart(2, "0")}`,
      groupName: zone,
    };
  });
}

export function generateMockDeviceGroups(): MagicInfoDeviceGroup[] {
  return zones.map((name, i) => ({
    groupId: `GRP-${String(i + 1).padStart(2, "0")}`,
    groupName: name,
    parentGroupId: null,
    deviceCount: 7,
  }));
}

export function generateMockPlayLogs(days = 7, screensCount = 70): MagicInfoPlayLog[] {
  const logs: MagicInfoPlayLog[] = [];
  const now = Date.now();
  const contentIds = ["AD-ISAPRE-001", "AD-PHARMA-001", "AD-SEGUROS-001", "CLC-INFO-001", "CLC-INFO-002"];

  for (let d = 0; d < days; d++) {
    for (let s = 0; s < screensCount; s++) {
      const playsPerDay = 20 + Math.floor(Math.random() * 30);
      for (let p = 0; p < playsPerDay; p++) {
        const playTime = now - d * 86400000 + Math.random() * 86400000;
        const duration = [15, 30][Math.floor(Math.random() * 2)];
        logs.push({
          logId: `LOG-${d}-${s}-${p}`,
          deviceId: `DEV-${String(s + 1).padStart(3, "0")}`,
          contentId: randomFrom(contentIds),
          playStartTime: new Date(playTime).toISOString(),
          playEndTime: new Date(playTime + duration * 1000).toISOString(),
          playDuration: duration,
          status: Math.random() > 0.02 ? "COMPLETED" : "INTERRUPTED",
        });
      }
    }
  }
  return logs;
}
