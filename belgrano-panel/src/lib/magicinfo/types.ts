export interface MagicInfoDevice {
  deviceId: string;
  deviceName: string;
  deviceModelName: string;
  deviceType: string;
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  status: "CONNECTED" | "DISCONNECTED" | "UNKNOWN";
  resolution: string;
  displayOrientation: "LANDSCAPE" | "PORTRAIT";
  lastConnectionTime: string;
  groupId: string;
  groupName: string;
}

export interface MagicInfoContent {
  contentId: string;
  contentName: string;
  contentType: "VIDEO" | "IMAGE" | "HTML";
  fileSize: number;
  filePath: string;
  thumbnailUrl: string;
  duration: number;
  uploadDate: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
}

export interface MagicInfoSchedule {
  scheduleId: string;
  scheduleName: string;
  startTime: string;
  endTime: string;
  deviceGroupId: string;
  contentList: Array<{
    contentId: string;
    playTime: number;
    position: number;
  }>;
  repeatType: "DAILY" | "WEEKLY" | "MONTHLY";
  isActive: boolean;
}

export interface MagicInfoPlayLog {
  logId: string;
  deviceId: string;
  contentId: string;
  playStartTime: string;
  playEndTime: string;
  playDuration: number;
  status: "COMPLETED" | "INTERRUPTED";
}

export interface MagicInfoDeviceGroup {
  groupId: string;
  groupName: string;
  parentGroupId: string | null;
  deviceCount: number;
}

export interface MagicInfoAuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface MagicInfoApiResponse<T> {
  status: number;
  message: string;
  data: T;
  totalCount?: number;
}
