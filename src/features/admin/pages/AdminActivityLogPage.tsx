import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Check,
  X,
  BookOpen,
} from "@/components/ui/CustomIcons";
import {
  type MissionEvent,
  MISSION_EVENT_LABELS,
  fetchEventsFromServer,
  getRecentEvents,
} from "@/services/eventService";
import {
  BADGE_DANGER,
  BADGE_NEUTRAL,
  BADGE_SUCCESS,
  BTN_SECONDARY,
  BTN_SECONDARY_SM,
  CARD,
  ICON_BOX,
  INPUT_ICON,
  LIST_ROW,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  TOAST,
} from "../styles";

export function AdminActivityLogPage() {
  const [events, setEvents] = useState<MissionEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const refreshData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const serverEvents = await fetchEventsFromServer().catch(() => null);
      if (serverEvents && serverEvents.length > 0) {
        setEvents(serverEvents);
      } else {
        setEvents(getRecentEvents(100));
      }
      showToast("Data log aktivitas disinkronkan.");
    } finally {
      setIsSyncing(false);
    }
  }, [showToast]);

  useEffect(() => {
    setEvents(getRecentEvents(100));
    void refreshData();

    const handleLocalEvent = (e: Event) => {
      const customEvent = e as CustomEvent<MissionEvent>;
      if (customEvent.detail) {
        setEvents((prev) => [
          customEvent.detail,
          ...prev.filter((item) => item.id !== customEvent.detail.id),
        ]);
      }
    };

    window.addEventListener("tartila:event", handleLocalEvent);
    return () => {
      window.removeEventListener("tartila:event", handleLocalEvent);
    };
  }, [refreshData]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events;
    return events.filter((evt) => {
      const matchName = evt.username?.toLowerCase().includes(q);
      const matchMission = evt.missionName?.toLowerCase().includes(q);
      const matchType = (MISSION_EVENT_LABELS[evt.type] || evt.type)
        .toLowerCase()
        .includes(q);
      return matchName || matchMission || matchType;
    });
  }, [events, searchQuery]);

  return (
    <div className="space-y-6 pb-12 font-sans font-bold text-[#134E4A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={TOAST}>
          <Check size={16} />
          {toastMessage}
        </div>
      )}

      {/* Header Halaman */}
      <div className={`flex flex-col justify-between gap-4 p-4 sm:p-5 sm:flex-row sm:items-center ${CARD}`}>
        <div className="flex items-start gap-3">
          <Link
            to="/admin"
            className={`${BTN_SECONDARY_SM} mt-1 shrink-0`}
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Kembali</span>
          </Link>

          <div>
            <h1 className={PAGE_TITLE}>Log Aktivitas</h1>
            <p className={PAGE_SUBTITLE}>
              Riwayat lengkap game, kuis, dan aktivitas belajar santri secara real-time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void refreshData()}
          disabled={isSyncing}
          className={`${BTN_SECONDARY} shrink-0`}
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Menyinkronkan..." : "Sinkronkan"}
        </button>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-10 -mx-4 bg-[#fafafa] px-4 py-2 sm:mx-0 sm:px-0">
        <div className={`p-3 sm:p-4 ${CARD}`}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#134E4A]/60">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Cari santri, misi, atau jenis aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={INPUT_ICON}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Bersihkan pencarian"
                className="absolute inset-y-0 right-3 flex items-center text-[#134E4A]/60 hover:text-[#FF6B6B]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List Aktivitas Lengkap */}
      <div className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
        <div className="flex items-center justify-between border-b-[3px] border-[#134E4A] bg-[#F0FDF4] p-3.5 sm:p-4">
          <div>
            <h2 className="font-display text-sm font-black uppercase text-[#134E4A]">
              Semua Aktivitas
            </h2>
            <p className="mt-0.5 text-xs font-bold text-[#134E4A]/70">
              Menampilkan {filteredEvents.length} catatan aktivitas
            </p>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className={`mx-auto mb-2 h-12 w-12 bg-[#F0FDF4] text-[#134E4A] ${ICON_BOX}`}>
              <BookOpen size={24} />
            </div>
            <p className="text-sm font-black text-[#134E4A]">
              Tidak ada aktivitas ditemukan
            </p>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/60">
              {searchQuery
                ? "Coba kata kunci pencarian yang lain."
                : "Aktivitas belajar santri akan muncul otomatis di sini."}
            </p>
          </div>
        ) : (
          <div className="divide-y-2 divide-[#134E4A]/10">
            {filteredEvents.map((evt) => {
              const label = MISSION_EVENT_LABELS[evt.type] || evt.type;
              const dateObj = new Date(evt.timestamp);
              const formattedTime = dateObj.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const formattedDate = dateObj.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              });

              return (
                <div
                  key={evt.id}
                  className={`flex items-center justify-between gap-3 p-3 sm:p-4 ${LIST_ROW}`}
                >
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div className={`h-9 w-9 shrink-0 bg-[#99F6E4] text-xs font-black text-[#134E4A] ${ICON_BOX}`}>
                      {(evt.username || "S").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="truncate text-xs sm:text-sm font-black text-[#134E4A]">
                          {evt.username || "Santri"}
                        </span>
                        <span className={BADGE_NEUTRAL}>{label}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] sm:text-xs font-bold text-[#134E4A]/70">
                        {evt.missionName || "Menyelesaikan sesi belajar"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5 text-right sm:gap-3">
                    <span className="text-[10px] font-bold text-[#134E4A]/60 sm:text-xs">
                      {formattedDate}, {formattedTime}
                    </span>
                    <span
                      className={
                        evt.completed === false ? BADGE_DANGER : BADGE_SUCCESS
                      }
                    >
                      {evt.completed === false ? "Belum Selesai" : "Selesai"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminActivityLogPage;
