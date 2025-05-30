import { env } from "../env.mjs";

interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class ZoomAPI {
  private static instance: ZoomAPI;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private constructor() {}

  public static getInstance(): ZoomAPI {
    if (!ZoomAPI.instance) {
      ZoomAPI.instance = new ZoomAPI();
    }
    return ZoomAPI.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiresAt > Date.now()) {
      return this.accessToken;
    }

    if (
      !env.ZOOM_CLIENT_ID ||
      !env.ZOOM_CLIENT_SECRET ||
      !env.ZOOM_ACCOUNT_ID
    ) {
      throw new Error(
        "Missing required Zoom environment variables. Please check your .env file."
      );
    }

    try {
      const response = await fetch("https://zoom.us/oauth/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${env.ZOOM_CLIENT_ID}:${env.ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "account_credentials",
          account_id: env.ZOOM_ACCOUNT_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Failed to get Zoom access token. Status: ${
            response.status
          }, Error: ${
            errorData.error_description || errorText || "Unknown error"
          }`
        );
      }

      const data: ZoomTokenResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      console.error("Error in getAccessToken:", error);
      throw error;
    }
  }

  public async createMeeting(meetingData: {
    topic: string;
    start_time: string;
    duration: number;
    type: number;
    timezone?: string;
    password?: string;
  }): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      throw new Error("Failed to create Zoom meeting");
    }

    return response.json();
  }

  public async getMeeting(meetingId: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get Zoom meeting details");
    }

    return response.json();
  }
}
