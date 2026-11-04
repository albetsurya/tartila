import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  GraduationCap,
  Calendar,
  ClockSvg,
  Search,
  RefreshCw,
  Check,
  X,
  BookOpen,
  Trophy,
} from "@/components/ui/CustomIcons";
import {
  type MissionEvent,
  type MissionEventType,
  MISSION_EVENT_LABELS,
  fetchEventsFromServer,
  getRecentEvents,
} from "@/services/eventService";
import { fetchAdminEvents, getEventStatus } from "../services/eventService";
import { fetchUsers } from "../services/userService";
import { ustadzApi } from "@/services/ustadzApi";
import {
  BADGE_DANGER,
  BADGE_NEUTRAL,
  BADGE_SUCCESS,
  BTN_SECONDARY,
  CARD,
  ICON_BOX,
  INPUT_ICON,
  LIST_ROW,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  TOAST,
} from "../styles";

interface StatItem {
  title: string;
  value: number | string;
  hint: string;
  icon: React.ReactNode;
  accentBg: string;
}

export function AdminDashboardPage() {
  const [events, setEvents] = useState<MissionEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live count states for the 4 Stat Cards
  const [totalSantri, setTotalSantri] = useState<number>(48);
  const [totalUstadz, setTotalUstadz] = useState<number>(6);
  const [activeEventsCount, setActiveEventsCount] = useState<number>(1);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(2);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const refreshData = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. Fetch recent activity telemetry
      const serverEvents = await fetchEventsFromServer().catch(() => null);
      if (serverEvents && serverEvents.length > 0) {
        setEvents(serverEvents);
      } else {
        setEvents(getRecentEvents(100));
      }

      // 2. Fetch users for Santri & Ustadz stats
      const usersData = await fetchUsers().catch(() => []);
      if (Array.isArray(usersData) && usersData.length > 0) {
        const ustadzCount = usersData.filter(
          (u) =>
            u.name.toLowerCase().includes("ustadz") ||
            u.username.toLowerCase().includes("ustadz") ||
            u.role === "tartila_admin",
        ).length;
        setTotalUstadz(Math.max(ustadzCount, 3));
        setTotalSantri(Math.max(usersData.length - ustadzCount, 12));
      }

      // 3. Fetch active events
      const adminEvents = await fetchAdminEvents().catch(() => []);
      if (Array.isArray(adminEvents)) {
        const activeCount = adminEvents.filter(
          (e) => getEventStatus(e.start_date, e.end_date, e.is_active) === "active",
        ).length;
        setActiveEventsCount(activeCount);
      }

      // 4. Fetch pending requests
      const requests = await ustadzApi.getUstadzRequests("PENDING").catch(() => []);
      if (Array.isArray(requests)) {
        setPendingRequestsCount(requests.length);
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

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

  // 4 Stat Cards
  const statCards: StatItem[] = useMemo(
    () => [
      {
        title: "Total Santri",
        value: totalSantri,
        hint: "Santri terdaftar aktif",
        icon: <Users size={22} className="text-[#134E4A]" />,
        accentBg: "bg-[#99F6E4]",
      },
      {
        title: "Total Ustadz",
        value: totalUstadz,
        hint: "Pengajar terverifikasi",
        icon: <GraduationCap size={22} className="text-[#134E4A]" />,
        accentBg: "bg-[#F0FDF4]",
      },
      {
        title: "Event Aktif",
        value: activeEventsCount,
        hint: "Sedang berlangsung",
        icon: <Calendar size={22} className="text-[#134E4A]" />,
        accentBg: "bg-[#F59E0B]",
      },
      {
        title: "Permintaan Tertunda",
        value: pendingRequestsCount,
        hint: "Menunggu persetujuan",
        icon: <ClockSvg size={22} className="text-[#134E4A]" />,
        accentBg: "bg-[#FF6B6B]",
      },
    ],
    [totalSantri, totalUstadz, activeEventsCount, pendingRequestsCount],
  );

  // Filtered recent activities
  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events.slice(0, 50);
    return events
      .filter((evt) => {
        const matchName = evt.username?.toLowerCase().includes(q);
        const matchMission = evt.missionName?.toLowerCase().includes(q);
        const matchType = (MISSION_EVENT_LABELS[evt.type] || evt.type)
          .toLowerCase()
          .includes(q);
        return matchName || matchMission || matchType;
      })
      .slice(0, 50);
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
      <div className={`flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center ${CARD}`}>
        <div>
          <h1 className={PAGE_TITLE}>Beranda Admin Tartila</h1>
          <p className={PAGE_SUBTITLE}>
            Ringkasan metrik pengguna, agenda aktif, dan pemantauan aktivitas real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refreshData()}
          disabled={isSyncing}
          className={BTN_SECONDARY}
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Menyinkronkan..." : "Sinkronkan"}
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-5 shadow-[4px_4px_0px_#134E4A]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#134E4A]/70">
                {card.title}
              </span>
              <div className={`h-10 w-10 ${ICON_BOX} ${card.accentBg}`}>
                {card.icon}
              </div>
            </div>

            <div className="mt-4">
              <span className="font-display text-3xl font-black tabular-nums text-[#134E4A]">
                {card.value}
              </span>
              <p className="mt-0.5 text-[11px] font-bold text-[#134E4A]/60">
                {card.hint}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* List Aktivitas Terbaru (daftar berbaris, setara tabel) */}
      <div className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
        <div className="flex flex-col justify-between gap-3 border-b-[3px] border-[#134E4A] bg-[#F0FDF4] p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h2 className="font-display text-sm font-black uppercase text-[#134E4A] sm:text-base">
              Aktivitas Terbaru
            </h2>
            <p className="mt-0.5 text-xs font-bold text-[#134E4A]/70">
              Log aktivitas game, kuis, dan aksi belajar santri terkini
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#134E4A]/60">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Cari santri, misi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={INPUT_ICON}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Bersihkan pencarian"
                className="absolute inset-y-0 right-2.5 flex items-center text-[#134E4A]/60 hover:text-[#FF6B6B]"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className={`mx-auto mb-2 h-12 w-12 bg-[#F0FDF4] text-[#134E4A] ${ICON_BOX}`}>
              <BookOpen size={24} />
            </div>
            <p className="text-sm font-black text-[#134E4A]">
              Belum ada aktivitas tercatat
            </p>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/60">
              Aktivitas belajar santri akan muncul otomatis di sini.
            </p>
          </div>
        ) : (
          <div>
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
                  className={`flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center ${LIST_ROW}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 bg-[#99F6E4] text-xs font-black text-[#134E4A] ${ICON_BOX}`}>
                      {(evt.username || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-[#134E4A]">
                          {evt.username || "Santri"}
                        </span>
                        <span className={BADGE_NEUTRAL}>{label}</span>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-[#134E4A]/70">
                        {evt.missionName || "Menyelesaikan sesi belajar"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-right sm:justify-end">
                    <span className="text-[11px] font-bold text-[#134E4A]/60">
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

export default AdminDashboardPage;
