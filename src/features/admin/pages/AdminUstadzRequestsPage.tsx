import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  GraduationCapSvg,
  CheckSvg,
  XSvg,
  RefreshCw,
  AlertTriangleSvg,
  Loader2Svg,
  Search,
} from "@/components/ui/CustomIcons";
import { ustadzApi, type UstadzRequestItem } from "@/services/ustadzApi";
import {
  ALERT_DANGER,
  BADGE_DANGER,
  BADGE_SUCCESS,
  BADGE_WARNING,
  BTN_BASE,
  BTN_DANGER,
  BTN_DANGER_COLOR,
  BTN_ICON_SECONDARY,
  BTN_PRIMARY_SM,
  BTN_SECONDARY,
  BTN_SM,
  CHIP_ACTIVE,
  CHIP_IDLE,
  ICON_BOX,
  INPUT,
  INPUT_ICON,
  LABEL,
  MODAL_PANEL,
  TABLE_WRAP,
  TD,
  TH,
  TOAST,
  TR,
} from "../styles";

type StatusFilter = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

export function AdminUstadzRequestsPage() {
  const [requests, setRequests] = useState<UstadzRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reject modal state
  const [rejectModalItem, setRejectModalItem] = useState<UstadzRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ustadzApi.getUstadzRequests(statusFilter);
      setRequests(data || []);
    } catch (err: any) {
      setError(
        err?.message || "Gagal memuat daftar pengajuan ustadz. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (item: UstadzRequestItem) => {
    if (actionLoadingId) return;
    const confirmApprove = window.confirm(
      `Apakah Anda yakin ingin menyetujui pengajuan ustadz untuk "${item.nama || item.name || "Pemohon"}"? Role user akan diubah menjadi Ustadz/Ustadzah.`,
    );
    if (!confirmApprove) return;

    setActionLoadingId(item.request_id);
    try {
      await ustadzApi.approveUstadzRequest(item.request_id);
      showToast(`Pengajuan untuk ${item.nama || item.name} berhasil disetujui!`);
      await fetchRequests();
    } catch (err: any) {
      alert(err?.message || "Gagal menyetujui pengajuan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenRejectModal = (item: UstadzRequestItem) => {
    setRejectModalItem(item);
    setRejectReason("Tidak memenuhi kualifikasi pengajar");
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem || rejectSubmitting) return;

    setRejectSubmitting(true);
    try {
      await ustadzApi.rejectUstadzRequest(
        rejectModalItem.request_id,
        rejectReason.trim() || "Tidak memenuhi syarat",
      );
      showToast(`Pengajuan untuk ${rejectModalItem.nama || rejectModalItem.name} telah ditolak.`);
      setRejectModalItem(null);
      await fetchRequests();
    } catch (err: any) {
      alert(err?.message || "Gagal menolak pengajuan.");
    } finally {
      setRejectSubmitting(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return requests.filter((r) => {
      if (!q) return true;
      return (
        (r.nama || r.name)?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q) ||
        r.user_id?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery]);

  return (
    <div className="space-y-6 pb-12 font-sans font-bold text-[#1A1A1A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={TOAST}
        >
          <CheckSvg size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 bg-[#9BE58B] ${ICON_BOX}`}>
              <GraduationCapSvg size={22} className="text-[#1A1A1A]" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
                Pengajuan Ustadz
              </h1>
              <p className="text-xs font-bold text-[#1A1A1A]/70">
                Verifikasi permohonan santri dan jamaah yang mengajukan role Ustadz
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className={BTN_SECONDARY}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Segarkan</span>
        </button>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "PENDING", label: "Menunggu Persetujuan" },
              { key: "APPROVED", label: "Disetujui" },
              { key: "REJECTED", label: "Ditolak" },
              { key: "ALL", label: "Semua" },
            ] as const
          ).map((filter) => {
            const isActive = statusFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setStatusFilter(filter.key)}
                className={isActive ? CHIP_ACTIVE : CHIP_IDLE}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/60"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau alasan..."
            className={INPUT_ICON}
          />
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className={ALERT_DANGER}>
          <AlertTriangleSvg size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Requests Table / Content */}
      <div className={TABLE_WRAP}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2Svg size={32} className="animate-spin text-[#1A1A1A]" />
            <p className="mt-3 text-xs font-black text-[#1A1A1A]/70">
              Memuat daftar permohonan...
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <div className={`mx-auto h-14 w-14 bg-[#FFF4DC] ${ICON_BOX}`}>
              <GraduationCapSvg size={28} className="text-[#1A1A1A]/60" />
            </div>
            <h3 className="mt-3 font-display text-sm font-black text-[#1A1A1A]">
              Tidak Ada Pengajuan
            </h3>
            <p className="mt-1 text-xs font-medium text-[#1A1A1A]/60">
              {statusFilter === "PENDING"
                ? "Saat ini tidak ada pengajuan Ustadz yang menunggu verifikasi."
                : "Tidak ditemukan data pengajuan dengan kriteria pencarian ini."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className={`px-4 py-3 ${TH}`}>Nama Pemohon</th>
                  <th className={`px-4 py-3 ${TH}`}>Tanggal Pengajuan</th>
                  <th className={`px-4 py-3 ${TH}`}>Alasan / Nama Lembaga</th>
                  <th className={`px-4 py-3 ${TH}`}>Status</th>
                  <th className={`px-4 py-3 text-right ${TH}`}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item) => {
                  const isActionLoading = actionLoadingId === item.request_id;
                  const dateFormatted = item.created_at
                    ? new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  return (
                    <tr key={item.request_id} className={TR}>
                      {/* Nama Pemohon */}
                      <td className="px-4 py-3.5">
                        <div className="font-black text-[#1A1A1A]">
                          {item.nama || item.name || "Tanpa Nama"}
                        </div>
                        <div className="font-mono text-[10px] text-[#1A1A1A]/60">
                          ID: {item.user_id}
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className={`px-4 py-3.5 ${TD}`}>
                        {dateFormatted}
                      </td>

                      {/* Alasan */}
                      <td className="px-4 py-3.5">
                        <div className="max-w-xs font-bold leading-relaxed text-[#1A1A1A]">
                          {item.reason || "-"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {item.status === "PENDING" ? (
                          <span className={BADGE_WARNING}>
                            Menunggu
                          </span>
                        ) : item.status === "APPROVED" ? (
                          <span className={BADGE_SUCCESS}>
                            Disetujui
                          </span>
                        ) : (
                          <span className={BADGE_DANGER}>
                            Ditolak
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5 text-right">
                        {item.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(item)}
                              disabled={isActionLoading}
                              className={BTN_PRIMARY_SM}
                            >
                              {isActionLoading ? (
                                <Loader2Svg size={14} className="animate-spin" />
                              ) : (
                                <CheckSvg size={14} />
                              )}
                              <span>Setujui</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(item)}
                              disabled={isActionLoading}
                              className={`${BTN_BASE} ${BTN_SM} ${BTN_DANGER_COLOR}`}
                            >
                              <XSvg size={14} />
                              <span>Tolak</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-black text-[#1A1A1A]/50">
                            {item.reviewed_at
                              ? `Ditinjau ${new Date(item.reviewed_at).toLocaleDateString("id-ID")}`
                              : "Selesai"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm"
            onClick={() => !rejectSubmitting && setRejectModalItem(null)}
          />

          <div className={`${MODAL_PANEL} z-10 max-w-sm p-5`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-black text-[#1A1A1A]">
                  Tolak Pengajuan Ustadz
                </h3>
                <p className="mt-0.5 text-xs font-bold text-[#1A1A1A]/70">
                  Pemohon: {rejectModalItem.nama || rejectModalItem.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                disabled={rejectSubmitting}
                className={BTN_ICON_SECONDARY}
              >
                <XSvg size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor="reject-reason"
                  className={LABEL}
                >
                  Alasan Penolakan
                </label>
                <textarea
                  id="reject-reason"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  required
                  disabled={rejectSubmitting}
                  className={`${INPUT} resize-none`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  disabled={rejectSubmitting}
                  className={`${BTN_SECONDARY} flex-1`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={rejectSubmitting || !rejectReason.trim()}
                  className={`${BTN_DANGER} flex-1`}
                >
                  {rejectSubmitting ? (
                    <Loader2Svg size={14} className="animate-spin" />
                  ) : (
                    <XSvg size={14} />
                  )}
                  <span>Tolak Permintaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUstadzRequestsPage;
