import type {
  MagicInfoDevice,
  MagicInfoContent,
  MagicInfoSchedule,
  MagicInfoPlayLog,
  MagicInfoDeviceGroup,
  MagicInfoAuthResponse,
  MagicInfoApiResponse,
} from "./types";

export class MagicInfoClient {
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    baseUrl = process.env.MAGICINFO_BASE_URL || "",
    private username = process.env.MAGICINFO_API_USER || "",
    private password = process.env.MAGICINFO_API_PASSWORD || ""
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async authenticate(): Promise<void> {
    if (this.token && Date.now() < this.tokenExpiry) return;

    const res = await fetch(`${this.baseUrl}/restapi/v1.0/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: this.username, password: this.password }),
    });

    if (!res.ok) throw new Error(`MagicInfo auth failed: ${res.status}`);

    const data: MagicInfoAuthResponse = await res.json();
    this.token = data.token;
    this.tokenExpiry = Date.now() + (data.expiresIn - 60) * 1000;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    await this.authenticate();

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        api_token: this.token!,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`MagicInfo API ${res.status}: ${body}`);
    }

    return res.json();
  }

  // Device management
  async getDevices(page = 1, size = 100): Promise<MagicInfoApiResponse<MagicInfoDevice[]>> {
    return this.request(`/restapi/v1.0/rms/devices?page=${page}&size=${size}`);
  }

  async getDevice(deviceId: string): Promise<MagicInfoApiResponse<MagicInfoDevice>> {
    return this.request(`/restapi/v1.0/rms/devices/${deviceId}`);
  }

  async restartDevice(deviceId: string): Promise<void> {
    await this.request(`/restapi/v1.0/rms/devices/${deviceId}/power/restart`, {
      method: "POST",
    });
  }

  async getDeviceGroups(): Promise<MagicInfoApiResponse<MagicInfoDeviceGroup[]>> {
    return this.request("/restapi/v1.0/rms/devices/groups");
  }

  // Content management
  async getContentList(page = 1, size = 100): Promise<MagicInfoApiResponse<MagicInfoContent[]>> {
    return this.request(`/restapi/v1.0/cms/contents?page=${page}&size=${size}`);
  }

  async uploadContent(file: Uint8Array, fileName: string, contentType: string): Promise<MagicInfoApiResponse<MagicInfoContent>> {
    const formData = new FormData();
    formData.append("file", new Blob([file as BlobPart]), fileName);
    formData.append("contentType", contentType);

    await this.authenticate();
    const res = await fetch(`${this.baseUrl}/restapi/v1.0/cms/contents`, {
      method: "POST",
      headers: { api_token: this.token! },
      body: formData,
    });

    if (!res.ok) throw new Error(`Content upload failed: ${res.status}`);
    return res.json();
  }

  async approveContent(contentId: string): Promise<void> {
    await this.request(`/restapi/v1.0/cms/contents/${contentId}/approve`, {
      method: "PUT",
    });
  }

  async deleteContent(contentId: string): Promise<void> {
    await this.request(`/restapi/v1.0/cms/contents/${contentId}`, {
      method: "DELETE",
    });
  }

  // Schedule management
  async getSchedules(): Promise<MagicInfoApiResponse<MagicInfoSchedule[]>> {
    return this.request("/restapi/v1.0/cms/schedules");
  }

  async createSchedule(schedule: Partial<MagicInfoSchedule>): Promise<MagicInfoApiResponse<MagicInfoSchedule>> {
    return this.request("/restapi/v1.0/cms/schedules", {
      method: "POST",
      body: JSON.stringify(schedule),
    });
  }

  async updateSchedule(scheduleId: string, schedule: Partial<MagicInfoSchedule>): Promise<void> {
    await this.request(`/restapi/v1.0/cms/schedules/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(schedule),
    });
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    await this.request(`/restapi/v1.0/cms/schedules/${scheduleId}`, {
      method: "DELETE",
    });
  }

  async deploySchedule(scheduleId: string, deviceGroupId: string): Promise<void> {
    await this.request(`/restapi/v1.0/cms/schedules/${scheduleId}/deploy`, {
      method: "POST",
      body: JSON.stringify({ deviceGroupId }),
    });
  }

  // Play logs (Proof of Play)
  async getPlayLogs(
    startDate: string,
    endDate: string,
    deviceId?: string,
    page = 1,
    size = 1000
  ): Promise<MagicInfoApiResponse<MagicInfoPlayLog[]>> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      page: String(page),
      size: String(size),
    });
    if (deviceId) params.set("deviceId", deviceId);
    return this.request(`/restapi/v1.0/rms/devices/statistics?${params}`);
  }
}

// Singleton instance
let client: MagicInfoClient | null = null;

export function getMagicInfoClient(): MagicInfoClient {
  if (!client) {
    client = new MagicInfoClient();
  }
  return client;
}
