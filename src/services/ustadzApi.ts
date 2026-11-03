import { callREST } from "./api";

export interface UstadzRequestItem {
  request_id: string;
  user_id: string;
  nama: string;
  name?: string;
  request_type: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  member_id?: string;
  reason: string;
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface ApplyUstadzResponse {
  auto_created?: string;
  request_sent?: string;
  message: string;
}

export const ustadzApi = {
  /**
   * Mengajukan akun untuk menjadi Ustadz
   */
  async applyUstadz(reason: string): Promise<ApplyUstadzResponse> {
    return await callREST<ApplyUstadzResponse>("POST", "/api/v1/member-requests", {
      request_type: "USTADZ",
      reason: reason.trim(),
    });
  },

  /**
   * Mengambil daftar permohonan ustadz (khusus admin)
   */
  async getUstadzRequests(status?: string): Promise<UstadzRequestItem[]> {
    const queryParams: Record<string, string> = {
      type: "USTADZ",
    };
    if (status && status !== "ALL") {
      queryParams.status = status;
    }
    return await callREST<UstadzRequestItem[]>(
      "GET",
      "/api/v1/admin/member-requests",
      undefined,
      queryParams,
    );
  },

  /**
   * Menyetujui permohonan ustadz (khusus admin)
   */
  async approveUstadzRequest(requestId: string): Promise<UstadzRequestItem> {
    return await callREST<UstadzRequestItem>(
      "POST",
      `/api/v1/member-requests/${encodeURIComponent(requestId)}/approve`,
      { request_id: requestId },
    );
  },

  /**
   * Menolak permohonan ustadz (khusus admin)
   */
  async rejectUstadzRequest(
    requestId: string,
    reason?: string,
  ): Promise<{ rejected: boolean }> {
    return await callREST<{ rejected: boolean }>(
      "POST",
      `/api/v1/member-requests/${encodeURIComponent(requestId)}/reject`,
      {
        request_id: requestId,
        reason: reason?.trim() || "Tidak memenuhi syarat",
      },
    );
  },
};
