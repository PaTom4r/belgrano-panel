import { pgTable, text, timestamp, integer, boolean, uuid, pgEnum, decimal, jsonb } from "drizzle-orm/pg-core";

// Enums
export const screenStatusEnum = pgEnum("screen_status", ["online", "offline", "unknown"]);
export const screenOrientationEnum = pgEnum("screen_orientation", ["landscape", "portrait"]);
export const contentTypeEnum = pgEnum("content_type", ["video", "image", "html5"]);
export const approvalStatusEnum = pgEnum("approval_status", ["pending", "approved", "rejected"]);
export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "active", "paused", "completed", "cancelled"]);

// Multi-tenant hierarchy: Organization → Location → Zone → Screen
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  address: text("address"),
  dailyFootTraffic: integer("daily_foot_traffic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const zones = pgTable("zones", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  floor: text("floor"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const screens = pgTable("screens", {
  id: uuid("id").defaultRandom().primaryKey(),
  zoneId: uuid("zone_id").references(() => zones.id).notNull(),
  magicInfoDeviceId: text("magicinfo_device_id"),
  name: text("name").notNull(),
  model: text("model"),
  tizenVersion: text("tizen_version"),
  resolution: text("resolution"),
  orientation: screenOrientationEnum("orientation").default("landscape").notNull(),
  status: screenStatusEnum("status").default("unknown").notNull(),
  lastSeen: timestamp("last_seen"),
  ipAddress: text("ip_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content management
export const contentItems = pgTable("content_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  type: contentTypeEnum("type").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  duration: integer("duration_seconds"),
  magicInfoContentId: text("magicinfo_content_id"),
  thumbnailUrl: text("thumbnail_url"),
  approvalStatus: approvalStatusEnum("approval_status").default("pending").notNull(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  uploadedBy: text("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playlists = pgTable("playlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  magicInfoPlaylistId: text("magicinfo_playlist_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playlistItems = pgTable("playlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  playlistId: uuid("playlist_id").references(() => playlists.id).notNull(),
  contentItemId: uuid("content_item_id").references(() => contentItems.id).notNull(),
  position: integer("position").notNull(),
  durationOverride: integer("duration_override_seconds"),
});

// Scheduling
export const schedules = pgTable("schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  playlistId: uuid("playlist_id").references(() => playlists.id).notNull(),
  startTime: text("start_time").notNull(), // HH:mm
  endTime: text("end_time").notNull(), // HH:mm
  daysOfWeek: jsonb("days_of_week").$type<number[]>().default([1, 2, 3, 4, 5, 6, 7]).notNull(),
  isClinicContent: boolean("is_clinic_content").default(false).notNull(),
  magicInfoScheduleId: text("magicinfo_schedule_id"),
  zoneIds: jsonb("zone_ids").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Advertisers & Campaigns
export const advertisers = pgTable("advertisers", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  company: text("company"),
  category: text("category"), // ISAPRE, pharma, insurance, wellness
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),
  contractValue: decimal("contract_value", { precision: 12, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  advertiserId: uuid("advertiser_id").references(() => advertisers.id).notNull(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  status: campaignStatusEnum("status").default("draft").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  targetZoneIds: jsonb("target_zone_ids").$type<string[]>().default([]).notNull(),
  dailyFrequency: integer("daily_frequency").default(10).notNull(),
  budgetCLP: decimal("budget_clp", { precision: 12, scale: 2 }),
  cpmRate: decimal("cpm_rate", { precision: 8, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaignContent = pgTable("campaign_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").references(() => campaigns.id).notNull(),
  contentItemId: uuid("content_item_id").references(() => contentItems.id).notNull(),
  approvalStatus: approvalStatusEnum("approval_status").default("pending").notNull(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
});

// Proof of Play & Reporting
export const playLogs = pgTable("play_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  screenId: uuid("screen_id").references(() => screens.id).notNull(),
  contentItemId: uuid("content_item_id").references(() => contentItems.id),
  campaignId: uuid("campaign_id").references(() => campaigns.id),
  playedAt: timestamp("played_at").notNull(),
  durationSeconds: integer("duration_seconds"),
  magicInfoLogId: text("magicinfo_log_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revenueStatements = pgTable("revenue_statements", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  month: text("month").notNull(), // YYYY-MM
  totalPlays: integer("total_plays").default(0).notNull(),
  totalImpressions: integer("total_impressions").default(0).notNull(),
  totalRevenueCLP: decimal("total_revenue_clp", { precision: 12, scale: 2 }).default("0").notNull(),
  locationShareCLP: decimal("location_share_clp", { precision: 12, scale: 2 }).default("0").notNull(),
  belgranoShareCLP: decimal("belgrano_share_clp", { precision: 12, scale: 2 }).default("0").notNull(),
  revenueSharePercent: decimal("revenue_share_percent", { precision: 5, scale: 2 }).default("70").notNull(), // CLC's share (70%)
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

// Users (for auth)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("operator").notNull(), // admin, operator
  organizationId: uuid("organization_id").references(() => organizations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- v1.1 Schema additions ---

// Heartbeats — screens send every 5 min (BEAT-01)
export const heartbeats = pgTable("heartbeats", {
  id: uuid("id").defaultRandom().primaryKey(),
  screenId: uuid("screen_id").references(() => screens.id).notNull(),
  currentContentId: text("current_content_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
});

// Screen registration requests — self-register on first load (REG-01)
export const screenRegistrations = pgTable("screen_registrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayId: text("display_id").notNull().unique(),
  name: text("name"),
  zoneId: uuid("zone_id").references(() => zones.id),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  resolution: text("resolution"),
  isAssigned: boolean("is_assigned").default(false).notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  lastSeen: timestamp("last_seen"),
});

// Hardware commands queue — admin sends restart/power commands (HW-01, HW-02)
export const hardwareCommands = pgTable("hardware_commands", {
  id: uuid("id").defaultRandom().primaryKey(),
  screenId: text("screen_id").notNull(),
  command: text("command").notNull(), // "restart", "power_off", "power_on"
  status: text("status").default("pending").notNull(), // "pending", "acknowledged", "executed", "failed"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
});

// Template zone layout type for templates
export type TemplateZone = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Templates — layout definitions for multi-zone displays (Phase 8)
export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  zones: jsonb("zones").$type<TemplateZone[]>().notNull(),
  width: integer("width").default(1920).notNull(),
  height: integer("height").default(1080).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
