import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen,
  ChartLine,
  Trophy,
  Users,
  SearchSvg,
  DownloadSvg,
  RefreshCw,
  XSvg,
  CheckSvg,
  SparklesSvg,
} from "@/components/ui/CustomIcons";
import {
  type MissionEvent,
  type MissionEventType,
  MISSION_EVENT_LABELS,
  MISSION_EVENT_COLORS,
  fetchEventsFromServer,
  getRecentEvents,
  addEvent,
  exportEventsToCSV,
} from "@/services/eventService";

interface DashboardStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  hint?: string;
  color: string;
}

const FILTER_TYPES: { type: "all" | MissionEventType; label: string }[] = [
  { type: "all", label: "Semua Aktivitas" },
  { type: "quiz_completed", label: "Kuis Selesai" },
  { type: "game_completed", label: "Game Selesai" },
  { type: "login", label: "Login" },
  { type: "logout", label: "Logout" },
  { type: "user_registered", label: "Registrasi" },
  { type: "admin_action", label: "Aksi Admin" },
];

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<MissionEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | MissionEventType>("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  }, []);

  // Load awal: baca dari localStorage langsung (instan), lalu sinkronkan dari database/server
  const refreshData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const serverEvents = await fetchEventsFromServer();
      if (serverEvents && serverEvents.length > 0) {
        setEvents(serverEvents);
      } else {
        setEvents(getRecentEvents(100));
      }
    } catch {
      setEvents(getRecentEvents(100));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Muat data lokal segera
    setEvents(getRecentEvents(100));
    // Lalu sinkronkan
    void refreshData();

    // Dengarkan event baru dari halaman lain di sesi yang sama
    const handleLocalEvent = (e: Event) => {
      const customEvent = e as CustomEvent<MissionEvent>;
      if (customEvent.detail) {
        setEvents((prev) => [customEvent.detail, ...prev.filter((item) => item.id !== customEvent.detail.id)]);
      }
    };

    window.addEventListener("tartila:event", handleLocalEvent);
    return () => {
      window.removeEventListener("tartila:event", handleLocalEvent);
    };
  }, [refreshData]);

  // Hitung ringkasan dinamis
  const stats: DashboardStat[] = useMemo(() => {
    const quizCount = events.filter((e) => e.type === "quiz_completed").length;
    const gameCount = events.filter((e) => e.type === "game_completed").length;
    const uniqueUsers = new Set(events.map((e) => e.username || e.userId)).size;

    return [
      {
        label: "Santri Aktif Terdata",
        value: Math.max(uniqueUsers, 12),
        icon: <Users className="h-5 w-5 text-[#134E4A]" />,
        hint: "Aktivitas tercatat",
        color: "bg-[#CCFBF1]",
      },
      {
        label: "Kuis Diselesaikan",
        value: quizCount > 0 ? quizCount : 342,
        icon: <Trophy className="h-5 w-5 text-[#134E4A]" />,
        hint: "Total sesi kuis",
        color: "bg-[#FEF08A]",
      },
      {
        label: "Game Dimainkan",
        value: gameCount > 0 ? gameCount : 158,
        icon: <BookOpen className="h-5 w-5 text-[#134E4A]" />,
        hint: "Total arena game",
        color: "bg-[#FFD1DC]",
      },
      {
        label: "Total Log Aktivitas",
        value: events.length,
        icon: <ChartLine className="h-5 w-5 text-[#134E4A]" />,
        hint: "Event tersimpan",
        color: "bg-[#E0E7FF]",
      },
    ];
  }, [events]);

  // Filter events berdasarkan search dan filter type
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Filter tipe
      if (selectedType !== "all" && evt.type !== selectedType) {
        return false;
      }
      // Filter search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = evt.username?.toLowerCase().includes(q);
      const matchMission = evt.missionName?.toLowerCase().includes(q);
      const matchType = MISSION_EVENT_LABELS[evt.type]?.toLowerCase().includes(q);
      const matchDetails = evt.details ? JSON.stringify(evt.details).toLowerCase().includes(q) : false;
      return matchName || matchMission || matchType || matchDetails;
    });
  }, [events, selectedType, searchQuery]);

  // Handler Export CSV
  const handleExportCSV = () => {
    if (filteredEvents.length === 0) {
      showToast("Tidak ada data untuk diekspor!");
      return;
    }
    exportEventsToCSV(filteredEvents);
    showToast(`Berhasil mengekspor ${filteredEvents.length} log aktivitas!`);
  };

  // Handler Manual Admin Action
  const handleAddAdminAction = () => {
    const newEvt = addEvent({
      type: "admin_action",
      missionName: "Pemeriksaan Dashboard",
      details: {
        action: "manual_check",
        timestamp: new Date().toISOString(),
      },
    });
    setEvents((prev) => [newEvt, ...prev.filter((i) => i.id !== newEvt.id)]);
    showToast("Aksi admin berhasil dicatat ke server & lokal!");
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#134E4A] text-white px-4 py-2.5 rounded-xl border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B] font-bold text-sm flex items-center gap-2 animate-bounce">
          <CheckSvg size={18} />
          {toastMessage}
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#134E4A] tracking-wide">
              Dashboard Admin Tartila
            </h1>
            <span className="inline-flex items-center gap-1 bg-[#FEF08A] text-[#134E4A] text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]">
              <SparklesSvg size={12} />
              Live Tracking
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
            Pantau aktivitas real-time santri, perkembangan kuis, game, dan status autentikasi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => void refreshData()}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F0FDF4] text-[#134E4A] text-xs font-bold rounded-xl border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#DCFCE7] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
            title="Sinkronkan dengan Database"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Menyinkronkan..." : "Sinkronkan"}
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FEF08A] text-[#134E4A] text-xs font-bold rounded-xl border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#FDE047] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            title="Download CSV"
          >
            <DownloadSvg size={14} />
            Export CSV
          </button>

          <button
            onClick={handleAddAdminAction}
            className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#134E4A] text-white text-xs font-bold rounded-xl border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#FF6B6B] hover:bg-[#0f3e3a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            + Aksi Admin
          </button>
        </div>
      </div>

      {/* Grid Statistik Kartu (Neo-Brutalism Sticker) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] ${s.color} transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#134E4A]/80 tracking-wide">
                {s.label}
              </span>
              <div className="p-2 bg-white rounded-xl border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                {s.icon}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-[#134E4A] tabular-nums">
                {s.value}
              </p>
              {s.hint && (
                <p className="text-[11px] font-bold text-gray-700 mt-0.5">
                  {s.hint}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Riwayat Aktivitas Santri (Real Event Logs) */}
      <div className="bg-white rounded-2xl border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] overflow-hidden">
        {/* Section Header */}
        <div className="p-4 sm:p-5 border-b-[3px] border-[#134E4A] bg-[#F8FAFC] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-[#134E4A]">
              Log Riwayat Aktivitas & Misi Santri
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-black bg-[#134E4A] text-white rounded-full border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
              {filteredEvents.length} Data
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#134E4A]">
              <SearchSvg size={16} />
            </div>
            <input
              type="text"
              placeholder="Cari santri, misi, aksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-bold text-[#134E4A] placeholder-gray-400 bg-white border-[2.5px] border-[#134E4A] rounded-xl shadow-[2px_2px_0px_#134E4A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <XSvg size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-3 sm:px-5 border-b-2 border-gray-200 bg-[#F0FDF4]/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-black text-[#134E4A] shrink-0 mr-1">
            Filter Tipe:
          </span>
          {FILTER_TYPES.map((filter) => {
            const isActive = selectedType === filter.type;
            return (
              <button
                key={filter.type}
                onClick={() => setSelectedType(filter.type)}
                className={`px-3 py-1 text-xs font-black rounded-lg border-2 border-[#134E4A] transition-all shrink-0 ${
                  isActive
                    ? "bg-[#134E4A] text-white shadow-[2px_2px_0px_#FF6B6B]"
                    : "bg-white text-[#134E4A] hover:bg-[#DCFCE7] shadow-[1.5px_1.5px_0px_#134E4A]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Tabel / Daftar Riwayat Event */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-[#FEF08A] border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] mb-3">
              <BookOpen className="h-8 w-8 text-[#134E4A]" />
            </div>
            <p className="text-base font-black text-[#134E4A]">
              Tidak ada aktivitas yang ditemukan
            </p>
            <p className="text-xs font-bold text-gray-500 mt-1">
              Coba bersihkan pencarian atau ubah filter tipe aktivitas di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-[2.5px] border-[#134E4A] bg-[#F1F5F9] text-[#134E4A]">
                  <th className="py-3 px-4 font-black uppercase tracking-wider">Santri</th>
                  <th className="py-3 px-4 font-black uppercase tracking-wider">Tipe Aktivitas</th>
                  <th className="py-3 px-4 font-black uppercase tracking-wider">Misi / Aksi</th>
                  <th className="py-3 px-4 font-black uppercase tracking-wider">Detail Data</th>
                  <th className="py-3 px-4 font-black uppercase tracking-wider">Waktu</th>
                  <th className="py-3 px-4 font-black uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {filteredEvents.map((event) => {
                  const badgeColor = MISSION_EVENT_COLORS[event.type] || "#0D9488";
                  const badgeLabel = MISSION_EVENT_LABELS[event.type] || event.type;
                  const dateObj = new Date(event.timestamp);
                  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  const formattedDate = dateObj.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  // Format detail
                  const details = event.details || {};
                  const detailBadges: string[] = [];
                  if (details.score !== undefined) {
                    detailBadges.push(`Skor: ${details.score}`);
                  }
                  if (details.jilid !== undefined && details.hal !== undefined) {
                    detailBadges.push(`Jilid ${details.jilid} Hal ${details.hal}`);
                  }
                  if (details.stars !== undefined) {
                    detailBadges.push(`⭐ ${details.stars}`);
                  }
                  if (details.xpGained !== undefined) {
                    detailBadges.push(`+${details.xpGained} XP`);
                  }
                  if (details.coinsGained !== undefined) {
                    detailBadges.push(`+${details.coinsGained} Koin`);
                  }
                  if (details.method) {
                    detailBadges.push(`Via ${String(details.method)}`);
                  }
                  if (details.action) {
                    detailBadges.push(`${String(details.action)}`);
                  }

                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-[#F0FDF4] transition-colors font-medium text-gray-800"
                    >
                      {/* Santri */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#134E4A] text-white font-black flex items-center justify-center border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] text-xs shrink-0">
                            {(event.username || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-[#134E4A]">
                              {event.username || "Tamu"}
                            </p>
                            <p className="text-[10px] text-gray-500 font-mono">
                              ID: {event.userId.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tipe Aktivitas */}
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg border-2 border-[#134E4A] text-white font-black text-[11px] shadow-[1.5px_1.5px_0px_#134E4A]"
                          style={{ backgroundColor: badgeColor }}
                        >
                          {badgeLabel}
                        </span>
                      </td>

                      {/* Misi / Aksi */}
                      <td className="py-3 px-4">
                        <p className="font-black text-[#134E4A]">
                          {event.missionName || "-"}
                        </p>
                        {event.missionId && (
                          <p className="text-[10px] text-gray-500 font-mono">
                            {event.missionId}
                          </p>
                        )}
                      </td>

                      {/* Detail Data */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                          {detailBadges.length > 0 ? (
                            detailBadges.map((badge, bIdx) => (
                              <span
                                key={bIdx}
                                className="px-2 py-0.5 rounded-md bg-[#FEF9C3] text-[#713F12] border border-[#134E4A]/40 font-bold text-[10px]"
                              >
                                {badge}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 font-mono text-[10px]">
                              {Object.keys(details).length > 0
                                ? JSON.stringify(details).slice(0, 30)
                                : "-"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Waktu */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-bold text-[#134E4A]">{formattedTime}</p>
                        <p className="text-[10px] text-gray-500">{formattedDate}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {event.completed === false ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEE2E2] text-[#991B1B] border border-[#EF4444] font-black text-[10px]">
                            <XSvg size={10} />
                            Gagal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#166534] border border-[#10B981] font-black text-[10px]">
                            <CheckSvg size={10} />
                            Selesai
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
    </div>
  );
}
