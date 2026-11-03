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
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#BBF7D0] px-4 py-3 text-sm font-black text-[#134E4A] shadow-[4px_4px_0px_#134E4A]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-white">
            <CheckSvg size={14} className="text-[#134E4A]" />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2px] border-[#134E4A] bg-[#D1FAE5] shadow-[2px_2px_0px_#134E4A]">
              <GraduationCapSvg size={22} className="text-[#134E4A]" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-[#134E4A]">
                Pengajuan Ustadz
              </h1>
              <p className="text-xs font-bold text-[#134E4A]/70">
                Verifikasi permohonan santri dan jamaah yang mengajukan role Ustadz
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#134E4A] bg-white px-3.5 py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-gray-50 active:translate-y-[1px] active:shadow-none disabled:opacity-50"
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
                className={`rounded-xl border-[2px] border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                  isActive
                    ? "bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                    : "bg-white text-[#134E4A]/70 hover:bg-gray-50"
                }`}
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
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#134E4A]/50"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau alasan..."
            className="w-full rounded-xl border-[2px] border-[#134E4A] bg-white py-1.5 pl-9 pr-3 text-xs font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 shadow-[2px_2px_0px_#134E4A] focus:outline-none"
          />
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border-[3px] border-[#991B1B] bg-[#FEF2F2] p-4 text-xs font-bold text-[#991B1B] shadow-[3px_3px_0px_#991B1B]">
          <AlertTriangleSvg size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Requests Table / Content */}
      <div className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2Svg size={32} className="animate-spin text-[#134E4A]" />
            <p className="mt-3 text-xs font-black text-[#134E4A]/70">
              Memuat daftar permohonan...
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-[2px] border-[#134E4A] bg-[#F0FDF4] shadow-[2px_2px_0px_#134E4A]">
              <GraduationCapSvg size={28} className="text-[#134E4A]/60" />
            </div>
            <h3 className="mt-3 text-sm font-black text-[#134E4A]">
              Tidak Ada Pengajuan
            </h3>
            <p className="mt-1 text-xs font-medium text-[#134E4A]/60">
              {statusFilter === "PENDING"
                ? "Saat ini tidak ada pengajuan Ustadz yang menunggu verifikasi."
                : "Tidak ditemukan data pengajuan dengan kriteria pencarian ini."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b-[3px] border-[#134E4A] bg-[#F0FDF4]">
                <tr>
                  <th className="px-4 py-3 font-black text-[#134E4A]">Nama Pemohon</th>
                  <th className="px-4 py-3 font-black text-[#134E4A]">Tanggal Pengajuan</th>
                  <th className="px-4 py-3 font-black text-[#134E4A]">Alasan / Nama Lembaga</th>
                  <th className="px-4 py-3 font-black text-[#134E4A]">Status</th>
                  <th className="px-4 py-3 text-right font-black text-[#134E4A]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#134E4A]/10">
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
                    <tr
                      key={item.request_id}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      {/* Nama Pemohon */}
                      <td className="px-4 py-3.5">
                        <div className="font-black text-[#134E4A]">
                          {item.nama || item.name || "Tanpa Nama"}
                        </div>
                        <div className="font-mono text-[10px] text-[#134E4A]/60">
                          ID: {item.user_id}
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-3.5 font-bold text-[#134E4A]/80">
                        {dateFormatted}
                      </td>

                      {/* Alasan */}
                      <td className="px-4 py-3.5">
                        <div className="max-w-xs font-medium text-[#134E4A] leading-relaxed">
                          {item.reason || "-"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {item.status === "PENDING" ? (
                          <span className="inline-flex items-center rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-1 text-[11px] font-black text-[#854D0E] shadow-[1px_1px_0px_#134E4A]">
                            Menunggu
                          </span>
                        ) : item.status === "APPROVED" ? (
                          <span className="inline-flex items-center rounded-lg border-2 border-[#134E4A] bg-[#BBF7D0] px-2.5 py-1 text-[11px] font-black text-[#166534] shadow-[1px_1px_0px_#134E4A]">
                            Disetujui
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-lg border-2 border-[#134E4A] bg-[#FECDD3] px-2.5 py-1 text-[11px] font-black text-[#991B1B] shadow-[1px_1px_0px_#134E4A]">
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
                              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#BBF7D0] px-3 py-1.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#86EFAC] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
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
                              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FFF0F0] px-3 py-1.5 text-xs font-black text-[#991B1B] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#FFE0E0] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
                            >
                              <XSvg size={14} />
                              <span>Tolak</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-[#134E4A]/50">
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
            className="fixed inset-0 bg-[#134E4A]/60 backdrop-blur-sm"
            onClick={() => !rejectSubmitting && setRejectModalItem(null)}
          />

          <div className="relative z-10 w-full max-w-sm rounded-[24px] border-[3px] border-[#134E4A] bg-white p-5 shadow-[6px_6px_0px_#134E4A]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-[#134E4A]">
                  Tolak Pengajuan Ustadz
                </h3>
                <p className="mt-0.5 text-xs font-bold text-[#134E4A]/70">
                  Pemohon: {rejectModalItem.nama || rejectModalItem.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                disabled={rejectSubmitting}
                className="rounded-xl border-2 border-[#134E4A] bg-[#FFF0F0] p-1 text-[#134E4A] shadow-[1px_1px_0px_#134E4A] disabled:opacity-50"
              >
                <XSvg size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor="reject-reason"
                  className="block text-xs font-black uppercase text-[#134E4A]"
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
                  className="mt-1.5 w-full resize-none rounded-xl border-[2px] border-[#134E4A] bg-[#FEF2F2] p-2.5 text-xs font-bold text-[#134E4A] shadow-[2px_2px_0px_#134E4A] focus:bg-white focus:outline-none disabled:opacity-60"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  disabled={rejectSubmitting}
                  className="flex-1 rounded-xl border-[2px] border-[#134E4A] bg-white py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-gray-50 active:translate-y-[1px] active:shadow-none disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={rejectSubmitting || !rejectReason.trim()}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-[2px] border-[#134E4A] bg-[#FECDD3] py-2 text-xs font-black text-[#991B1B] shadow-[2px_2px_0px_#134E4A] hover:bg-[#FCA5A5] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
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
