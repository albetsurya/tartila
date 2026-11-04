import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2,
  X,
  Trophy,
} from "@/components/ui/CustomIcons";
import {
  fetchAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStatus,
  type AdminEvent,
  type CreateEventPayload,
  type EventStatus,
} from "../services/eventService";
import { AdminEventFormModal } from "../components/AdminEventFormModal";
import {
  BADGE_INFO,
  BADGE_NEUTRAL,
  BADGE_SUCCESS,
  BTN_DANGER_SM,
  BTN_PRIMARY,
  BTN_PRIMARY_SM,
  BTN_SECONDARY_SM,
  CARD,
  CHIP_ACTIVE,
  CHIP_IDLE,
  ICON_BOX,
  INPUT_ICON,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  TOAST,
} from "../styles";

type FilterTab = "all" | EventStatus;

function formatDateRange(startDateStr: string, endDateStr: string): string {
  try {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    const fmt = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    });
    const yearFmt = new Intl.DateTimeFormat("id-ID", { year: "numeric" });
    return `${fmt.format(s)} - ${fmt.format(e)} ${yearFmt.format(e)}`;
  } catch {
    return `${startDateStr} - ${endDateStr}`;
  }
}

export function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminEvents();
      setEvents(data);
    } catch {
      showToast("Gagal memuat event.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((evt) => {
      const status = getEventStatus(evt.start_date, evt.end_date, evt.is_active);
      if (activeTab !== "all" && status !== activeTab) {
        return false;
      }
      if (q) {
        const matchName = evt.name.toLowerCase().includes(q);
        const matchDesc = evt.description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [events, activeTab, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: AdminEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (payload: CreateEventPayload, editId?: string) => {
    if (editId) {
      await updateEvent(editId, payload);
      showToast("Event berhasil diperbarui.");
    } else {
      await createEvent(payload);
      showToast("Event baru berhasil dibuat.");
    }
    await loadEvents();
  };

  const handleDeleteEvent = async (id: string, name: string) => {
    const ok = window.confirm(
      `Apakah Anda yakin ingin menghapus event "${name}"? Tindakan ini tidak dapat dibatalkan.`,
    );
    if (!ok) return;

    setDeletingId(id);
    try {
      await deleteEvent(id);
      showToast(`Event "${name}" telah dihapus.`);
      await loadEvents();
    } catch {
      showToast("Gagal menghapus event.");
    } finally {
      setDeletingId(null);
    }
  };

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
          <h1 className={PAGE_TITLE}>Manajemen Event</h1>
          <p className={PAGE_SUBTITLE}>
            Kelola agenda berkala, periode aktif, dan rangkaian misi berhadiah untuk santri.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className={`${BTN_PRIMARY} shrink-0`}
        >
          <Plus size={18} />
          + Buat Event
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className={`flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center ${CARD}`}>
        {/* Kolom Pencarian */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#134E4A]/60">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama event..."
            className={INPUT_ICON}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-[#134E4A]/60 hover:text-[#FF6B6B]"
              aria-label="Bersihkan pencarian"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2 overflow-x-auto p-1">
          {[
            { id: "all", label: "Semua" },
            { id: "active", label: "Aktif" },
            { id: "upcoming", label: "Akan Datang" },
            { id: "completed", label: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={activeTab === tab.id ? CHIP_ACTIVE : CHIP_IDLE}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Event (Card List) */}
      {loading ? (
        <div className={`p-12 text-center ${CARD}`}>
          <Loader2 size={24} className="mx-auto animate-spin text-[#0D9488]" />
          <p className="mt-2 text-xs font-black text-[#134E4A]/70">Memuat daftar event...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        /* Empty State */
        <div className={`space-y-3 p-12 text-center ${CARD}`}>
          <div className={`mx-auto h-16 w-16 bg-[#99F6E4] text-[#134E4A] ${ICON_BOX}`}>
            <Calendar size={32} />
          </div>
          <h3 className="font-display text-base font-black text-[#134E4A]">Belum ada event.</h3>
          <p className="mx-auto max-w-sm text-xs font-bold text-[#134E4A]/70">
            Yuk, buat event pertama Anda!
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className={BTN_PRIMARY_SM}
            >
              <Plus size={14} />
              + Buat Event Sekarang
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredEvents.map((evt) => {
            const status = getEventStatus(evt.start_date, evt.end_date, evt.is_active);
            const dateRangeLabel = formatDateRange(evt.start_date, evt.end_date);

            return (
              <div
                key={evt.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border-[3px] border-[#134E4A] bg-white p-5 shadow-[4px_4px_0px_#134E4A]"
              >
                <div className="space-y-3">
                  {/* Top Status & Date Range */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={
                        status === "active"
                          ? BADGE_SUCCESS
                          : status === "upcoming"
                            ? BADGE_INFO
                            : BADGE_NEUTRAL
                      }
                    >
                      {status === "active"
                        ? "Aktif"
                        : status === "upcoming"
                          ? "Akan Datang"
                          : "Selesai"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#134E4A]/70">
                      <Calendar size={13} />
                      {dateRangeLabel}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="line-clamp-1 font-display text-base font-black text-[#134E4A]">
                      {evt.name}
                    </h2>
                    {evt.description && (
                      <p className="mt-1 line-clamp-2 text-xs font-bold text-[#134E4A]/70">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {/* Missions Preview */}
                  <div className="border-t border-[#134E4A]/20 pt-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] font-black text-[#134E4A]">
                        <Trophy size={13} className="text-[#F59E0B]" />
                        {evt.missions?.length || 0} Misi Tersedia
                      </span>
                    </div>

                    <div className="space-y-1">
                      {evt.missions?.slice(0, 2).map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between rounded-lg border-[2px] border-[#134E4A]/20 bg-[#F0FDF4] px-2.5 py-1 text-[11px] font-bold text-[#134E4A]"
                        >
                          <span className="truncate pr-2">{m.title}</span>
                          <span className="shrink-0 text-[10px] font-black text-[#0D9488]">
                            +{m.reward_coins} Koin
                          </span>
                        </div>
                      ))}
                      {(evt.missions?.length || 0) > 2 && (
                        <p className="text-right text-[10px] font-bold text-[#134E4A]/60">
                          +{evt.missions.length - 2} misi lainnya
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions (Edit & Hapus) */}
                <div className="flex items-center justify-end gap-2 border-t border-[#134E4A]/20 pt-3">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(evt)}
                    className={BTN_SECONDARY_SM}
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === evt.id}
                    onClick={() => handleDeleteEvent(evt.id, evt.name)}
                    className={BTN_DANGER_SM}
                  >
                    <Trash2 size={13} />
                    {deletingId === evt.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <AdminEventFormModal
        isOpen={isModalOpen}
        eventToEdit={editingEvent}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
}

export default AdminEventsPage;
