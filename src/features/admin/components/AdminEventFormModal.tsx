import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Loader2 } from "@/components/ui/CustomIcons";
import {
  type AdminEvent,
  type CreateEventPayload,
  type EventMissionPayload,
} from "../services/eventService";
import {
  BTN_ICON_SECONDARY,
  BTN_PRIMARY,
  BTN_PRIMARY_SM,
  BTN_SECONDARY,
  INPUT,
  LABEL,
  MODAL_OVERLAY,
  MODAL_PANEL,
  SECTION_TITLE,
  TITLE,
} from "../styles";

interface AdminEventFormModalProps {
  isOpen: boolean;
  eventToEdit: AdminEvent | null;
  onClose: () => void;
  onSave: (payload: CreateEventPayload, editId?: string) => Promise<void>;
}

interface FormMissionItem {
  id: string;
  title: string;
  action_type: string;
  target_amount: string;
  reward_coins: string;
  reward_tickets: string;
  reward_hearts: string;
}

const ACTION_TYPES = [
  { value: "PLAY_GAME", label: "Main Game Ceria (PLAY_GAME)" },
  { value: "FINISH_QUIZ", label: "Selesaikan Kuis (FINISH_QUIZ)" },
  { value: "MEMORIZE_SURAH", label: "Hafalan Surat (MEMORIZE_SURAH)" },
  { value: "READ_TILAWATI", label: "Tilawati Harian (READ_TILAWATI)" },
];

function createEmptyMission(): FormMissionItem {
  return {
    id: `m-draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: "",
    action_type: "PLAY_GAME",
    target_amount: "1",
    reward_coins: "10",
    reward_tickets: "0",
    reward_hearts: "0",
  };
}

export function AdminEventFormModal({
  isOpen,
  eventToEdit,
  onClose,
  onSave,
}: AdminEventFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [missions, setMissions] = useState<FormMissionItem[]>([createEmptyMission()]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name);
      setDescription(eventToEdit.description || "");
      setStartDate(eventToEdit.start_date.split("T")[0]);
      setEndDate(eventToEdit.end_date.split("T")[0]);
      if (eventToEdit.missions && eventToEdit.missions.length > 0) {
        setMissions(
          eventToEdit.missions.map((m) => ({
            id: m.id,
            title: m.title,
            action_type: m.action_type || "PLAY_GAME",
            target_amount: String(m.target_amount),
            reward_coins: String(m.reward_coins),
            reward_tickets: String(m.reward_tickets),
            reward_hearts: String(m.reward_hearts || 0),
          })),
        );
      } else {
        setMissions([createEmptyMission()]);
      }
    } else {
      setName("");
      setDescription("");
      const today = new Date().toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
      setStartDate(today);
      setEndDate(nextWeek);
      setMissions([createEmptyMission()]);
    }
    setErrorMessage(null);
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddMission = () => {
    setMissions((prev) => [...prev, createEmptyMission()]);
  };

  const handleRemoveMission = (id: string) => {
    if (missions.length <= 1) {
      setErrorMessage("Event harus memiliki minimal satu misi.");
      return;
    }
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMissionChange = (
    id: string,
    field: keyof Omit<FormMissionItem, "id">,
    value: string,
  ) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Nama event wajib diisi.");
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage("Tanggal mulai dan tanggal selesai wajib diisi.");
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setErrorMessage("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    if (missions.length === 0) {
      setErrorMessage("Minimal satu misi harus ditambahkan.");
      return;
    }

    const payloadMissions: EventMissionPayload[] = [];
    for (let i = 0; i < missions.length; i++) {
      const item = missions[i];
      if (!item.title.trim()) {
        setErrorMessage(`Judul misi ke-${i + 1} tidak boleh kosong.`);
        return;
      }
      const target = Number(item.target_amount);
      if (!target || target <= 0) {
        setErrorMessage(`Target angka misi ke-${i + 1} harus lebih dari 0.`);
        return;
      }
      payloadMissions.push({
        title: item.title.trim(),
        action_type: item.action_type,
        target_amount: target,
        reward_coins: Math.max(0, Number(item.reward_coins) || 0),
        reward_tickets: Math.max(0, Number(item.reward_tickets) || 0),
        reward_hearts: Math.max(0, Number(item.reward_hearts) || 0),
      });
    }

    const payload: CreateEventPayload = {
      name: name.trim(),
      description: description.trim(),
      start_date: startDate,
      end_date: endDate,
      missions: payloadMissions,
    };

    setSubmitting(true);
    try {
      await onSave(payload, eventToEdit?.id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan event.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={MODAL_OVERLAY}>
      <div className={`${MODAL_PANEL} my-8 max-w-2xl font-sans font-bold text-[#1A1A1A]`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-[3px] border-[#1A1A1A] bg-[#FFF4DC] px-5 py-4">
          <div>
            <h2 className={`${TITLE} text-base sm:text-lg`}>
              {eventToEdit ? "Edit Event" : "Buat Event Baru"}
            </h2>
            <p className="mt-0.5 text-xs font-bold text-[#1A1A1A]/70">
              Isi parameter event dan rancang misi tantangan santri
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={BTN_ICON_SECONDARY}
            aria-label="Tutup modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6">
          {errorMessage && (
            <div className="rounded-xl border-[2.5px] border-[#1A1A1A] bg-[#FF6B6B]/15 p-3 text-xs font-black text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Info Dasar */}
          <div className="space-y-4">
            <h3 className={SECTION_TITLE}>
              Informasi Dasar
            </h3>

            <div>
              <label className={LABEL}>
                Nama Event *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Semarak Ramadhan Mengaji"
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>
                Deskripsi
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan tujuan atau detail event ini..."
                className={INPUT}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>
                  Tanggal Mulai *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>
                  Tanggal Selesai *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          <hr className="border-t-[3px] border-[#1A1A1A]/20" />

          {/* Section 2: Daftar Misi Dinamis */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={SECTION_TITLE}>
                  Daftar Misi Dinamis
                </h3>
                <p className="text-[11px] font-bold text-[#1A1A1A]/60">
                  Santri menyelesaikan target untuk memperoleh hadiah
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMission}
                className={BTN_PRIMARY_SM}
              >
                <Plus size={14} />
                Tambah Misi
              </button>
            </div>

            <div className="space-y-3">
              {missions.map((mission, idx) => (
                <div
                  key={mission.id}
                  className="relative space-y-3 rounded-xl border-[2px] border-[#1A1A1A] bg-[#FFF4DC] p-4 shadow-[2px_2px_0px_#1A1A1A]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-black uppercase text-[#1A1A1A]">
                      Misi #{idx + 1}
                    </span>
                    {missions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMission(mission.id)}
                        className="rounded-lg p-1 text-[#1A1A1A]/60 transition-colors hover:text-[#FF6B6B]"
                        title="Hapus misi"
                        aria-label={`Hapus misi ${idx + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className={LABEL}>
                      Judul Misi *
                    </label>
                    <input
                      type="text"
                      required
                      value={mission.title}
                      onChange={(e) =>
                        handleMissionChange(mission.id, "title", e.target.value)
                      }
                      placeholder="Contoh: Mainkan 3 Game Ceria"
                      className={INPUT}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>
                        Tipe Aksi *
                      </label>
                      <select
                        value={mission.action_type}
                        onChange={(e) =>
                          handleMissionChange(mission.id, "action_type", e.target.value)
                        }
                        className={INPUT}
                      >
                        {ACTION_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={LABEL}>
                        Target Angka *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={mission.target_amount}
                        onChange={(e) =>
                          handleMissionChange(mission.id, "target_amount", e.target.value)
                        }
                        placeholder="Contoh: 3"
                        className={INPUT}
                      />
                    </div>
                  </div>

                  {/* Hadiah Section */}
                  <div>
                    <label className={LABEL}>
                      Hadiah Misi
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="mb-0.5 block text-[10px] font-black uppercase text-[#1A1A1A]/70">
                          Koin
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={mission.reward_coins}
                          onChange={(e) =>
                            handleMissionChange(mission.id, "reward_coins", e.target.value)
                          }
                          className={INPUT}
                        />
                      </div>
                      <div>
                        <span className="mb-0.5 block text-[10px] font-black uppercase text-[#1A1A1A]/70">
                          Tiket
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={mission.reward_tickets}
                          onChange={(e) =>
                            handleMissionChange(mission.id, "reward_tickets", e.target.value)
                          }
                          className={INPUT}
                        />
                      </div>
                      <div>
                        <span className="mb-0.5 block text-[10px] font-black uppercase text-[#1A1A1A]/70">
                          Hati
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={mission.reward_hearts}
                          onChange={(e) =>
                            handleMissionChange(mission.id, "reward_hearts", e.target.value)
                          }
                          className={INPUT}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 border-t-[3px] border-[#1A1A1A]/20 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={BTN_SECONDARY}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`${BTN_PRIMARY} px-6`}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
