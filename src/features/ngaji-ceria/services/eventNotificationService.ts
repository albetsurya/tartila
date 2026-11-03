import { addNotification } from "../../../services/notificationService";
import type {
  ClaimEventRewardResponse,
  EventInfo,
  EventMission,
} from "./eventApi";

const NOTIFIED_EVENT_PREFIX = "tartila:event-notified:";

function formatEventDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function wasEventNotified(eventId: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(`${NOTIFIED_EVENT_PREFIX}${eventId}`) === "1";
  } catch {
    return false;
  }
}

function markEventNotified(eventId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${NOTIFIED_EVENT_PREFIX}${eventId}`, "1");
  } catch {
    // localStorage tidak tersedia; notifikasi tetap dikirim sekali per sesi
  }
}

/** Notifikasi lonceng hanya sekali untuk setiap event aktif. */
export function notifyActiveEvent(event: EventInfo): void {
  if (!event?.id || wasEventNotified(event.id)) return;

  addNotification({
    type: "event",
    title: `Event Baru: ${event.name}`,
    message: `Misi event sudah tersedia. Selesaikan misi dan klaim hadiah sebelum ${formatEventDate(event.end_date)}.`,
    targetRole: "all",
    actionUrl: "/member/ngaji-ceria",
  });
  markEventNotified(event.id);
}

/** Notifikasi hadiah setelah klaim berhasil divalidasi Backend Go. */
export function notifyEventReward(
  mission: EventMission,
  result: ClaimEventRewardResponse,
): void {
  const coins = result.reward?.coins ?? result.coins ?? 0;
  const tickets = result.reward?.tickets ?? result.tickets ?? 0;

  addNotification({
    type: "reward",
    title: "Hadiah Diklaim!",
    message: `Kamu mendapatkan ${coins} Koin dan ${tickets} Tiket dari misi ${mission.title}`,
    targetRole: "all",
    actionUrl: "/member/ngaji-ceria",
  });
}
