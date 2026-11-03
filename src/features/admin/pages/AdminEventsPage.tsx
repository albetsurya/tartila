import { useRef, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  Loader2,
  Plus,
  Trash2,
} from "@/components/ui/CustomIcons";
import {
  createEvent,
  getEventErrorMessage,
  type AdminEvent,
  type CreateEventPayload,
} from "../services/eventService";

interface MissionDraft {
  key: number;
  title: string;
  target: string;
  coins: string;
  tickets: string;
}

const INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/15 disabled:bg-zinc-50";
const LABEL_CLASS = "block text-xs font-medium text-zinc-600";

function emptyMission(key: number): MissionDraft {
  return { key, title: "", target: "", coins: "", tickets: "" };
}

export function AdminEventsPage() {
  const missionKey = useRef(2);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [missions, setMissions] = useState<MissionDraft[]>([emptyMission(1)]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdEvent, setCreatedEvent] = useState<AdminEvent | null>(null);

  const addMission = () => {
    const key = missionKey.current++;
    setMissions((prev) => [...prev, emptyMission(key)]);
  };

  const removeMission = (key: number) => {
    setMissions((prev) => prev.filter((mission) => mission.key !== key));
  };

  const updateMission = (
    key: number,
    field: keyof Omit<MissionDraft, "key">,
    value: string,
  ) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.key === key ? { ...mission, [field]: value } : mission,
      ),
    );
  };

  const resetForm = () => {
    missionKey.current = 2;
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setMissions([emptyMission(1)]);
    setError(null);
    setCreatedEvent(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setCreatedEvent(null);

    if (!name.trim()) {
      setError("Nama event wajib diisi.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Tanggal mulai dan tanggal selesai wajib diisi.");
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    if (missions.length === 0) {
      setError("Tambahkan minimal satu misi untuk event ini.");
      return;
    }

    const normalizedMissions = [];
    for (let index = 0; index < missions.length; index += 1) {
      const mission = missions[index];
      const target = Number(mission.target);
      const coins = Number(mission.coins || 0);
      const tickets = Number(mission.tickets || 0);

      if (!mission.title.trim()) {
        setError(`Judul misi ${index + 1} wajib diisi.`);
        return;
      }
      if (!Number.isInteger(target) || target <= 0) {
        setError(`Target misi ${index + 1} harus bilangan bulat lebih dari 0.`);
        return;
      }
      if (
        !Number.isInteger(coins) ||
        coins < 0 ||
        !Number.isInteger(tickets) ||
        tickets < 0
      ) {
        setError(`Hadiah misi ${index + 1} tidak boleh negatif.`);
        return;
      }

      normalizedMissions.push({
        title: mission.title.trim(),
        target_amount: target,
        reward_coins: coins,
        reward_tickets: tickets,
      });
    }

    const payload: CreateEventPayload = {
      name: name.trim(),
      description: description.trim(),
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      missions: normalizedMissions,
    };

    setSubmitting(true);
    try {
      const created = await createEvent(payload);
      setCreatedEvent(created);
    } catch (err) {
      setError(getEventErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="-m-4 min-h-[calc(100dvh-4rem)] bg-[#fafafa] p-4 md:-m-8 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-[#059669]">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Event Management
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Buat event dan misi berhadiah koin, tiket, serta hati untuk santri.
            </p>
          </div>
        </header>

        {createdEvent && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#059669] text-white">
              <Check size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-900">
                Event berhasil dibuat
              </p>
              <p className="mt-0.5 text-sm text-emerald-800">
                {createdEvent.name} dengan {createdEvent.missions.length} misi.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="shrink-0 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              Buat Event Lain
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">
              Informasi Event
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Nama dan periode event yang akan tampil di aplikasi.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="event-name" className={LABEL_CLASS}>
                  Nama Event
                </label>
                <input
                  id="event-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pekan Tilawati Ramadan"
                  required
                  disabled={submitting}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="event-description" className={LABEL_CLASS}>
                  Deskripsi
                </label>
                <textarea
                  id="event-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan singkat event (opsional)"
                  disabled={submitting}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="event-start" className={LABEL_CLASS}>
                    Tanggal Mulai
                  </label>
                  <input
                    id="event-start"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    disabled={submitting}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="event-end" className={LABEL_CLASS}>
                    Tanggal Selesai
                  </label>
                  <input
                    id="event-end"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    disabled={submitting}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">
                  Misi Event
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {missions.length} misi akan ditambahkan ke event ini.
                </p>
              </div>
              <button
                type="button"
                onClick={addMission}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60"
              >
                <Plus size={14} />
                Tambah Misi
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {missions.map((mission, index) => (
                <div
                  key={mission.key}
                  className="rounded-lg border border-zinc-200 bg-[#fafafa] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Misi {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMission(mission.key)}
                      disabled={submitting || missions.length === 1}
                      aria-label={`Hapus misi ${index + 1}`}
                      title={
                        missions.length === 1
                          ? "Minimal satu misi"
                          : "Hapus misi"
                      }
                      className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS}>Judul Misi</label>
                      <input
                        type="text"
                        value={mission.title}
                        onChange={(e) =>
                          updateMission(mission.key, "title", e.target.value)
                        }
                        placeholder="Contoh: Mainkan 5 game hari ini"
                        required
                        disabled={submitting}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Target</label>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={mission.target}
                        onChange={(e) =>
                          updateMission(mission.key, "target", e.target.value)
                        }
                        placeholder="5"
                        required
                        disabled={submitting}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Hadiah Koin</label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={mission.coins}
                        onChange={(e) =>
                          updateMission(mission.key, "coins", e.target.value)
                        }
                        placeholder="0"
                        disabled={submitting}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Hadiah Tiket</label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={mission.tickets}
                        onChange={(e) =>
                          updateMission(mission.key, "tickets", e.target.value)
                        }
                        placeholder="0"
                        disabled={submitting}
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#059669] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Menyimpan..." : "Simpan Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEventsPage;
