import { callREST } from "./api";

export interface UserProfileResponse {
  user?: any;
  profile?: any;
  mascot_gender?: "boy" | "girl" | string;
  [key: string]: any;
}

export interface MascotUpdateResponse {
  success?: boolean;
  mascot_gender: "boy" | "girl";
  user?: any;
}

export const userApi = {
  async getUserProfile(): Promise<UserProfileResponse> {
    try {
      return await callREST<UserProfileResponse>("GET", "/api/v1/user/profile");
    } catch (err) {
      // Fallback without /v1 if root-scoped
      return await callREST<UserProfileResponse>("GET", "/api/user/profile");
    }
  },

  async updateUserMascot(gender: "boy" | "girl" | string): Promise<MascotUpdateResponse> {
    const norm = gender === "girl" ? "girl" : "boy";
    try {
      return await callREST<MascotUpdateResponse>("PATCH", "/api/v1/user/mascot", {
        gender: norm,
      });
    } catch (err) {
      // Fallback without /v1
      return await callREST<MascotUpdateResponse>("PATCH", "/api/user/mascot", {
        gender: norm,
      });
    }
  },
};
