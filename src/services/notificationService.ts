export type NotificationRole = "all" | "member" | "tartila_admin" | "superadmin";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "reward" | string;
  title: string;
  message: string;
  targetRole: NotificationRole;
  read: boolean;
  timestamp: number;
  actionUrl?: string;
}

const NOTIFICATIONS_STORAGE_KEY = "tartila-notifications";

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_welcome",
    type: "reward",
    title: "Selamat Datang di Tartila!",
    message: "Ayo mulai petualangan mengaji bersama Tito & Tila!",
    targetRole: "all",
    read: false,
    timestamp: Date.now() - 3600000,
    actionUrl: "/member/ngaji-ceria",
  },
  {
    id: "notif_daily_reminder",
    type: "info",
    title: "Jaga Streak Mengajimu! 🔥",
    message: "Lanjut mengaji hari ini untuk melipatgandakan koin dan bonus hadiah.",
    targetRole: "member",
    read: false,
    timestamp: Date.now() - 1800000,
    actionUrl: "/member/ngaji-ceria",
  },
];

/** Ambil seluruh notifikasi dari localStorage dengan penanganan error aman */
export function getNotifications(): Notification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
  } catch (err) {
    console.warn("Gagal membaca notifikasi dari localStorage:", err);
    return DEFAULT_NOTIFICATIONS;
  }
}

/** Simpan seluruh notifikasi ke localStorage */
function saveNotifications(notifications: Notification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent("tartila:notification"));
  } catch (err) {
    console.warn("Gagal menyimpan notifikasi ke localStorage:", err);
  }
}

/** Tambah notifikasi baru */
export function addNotification(
  data: Omit<Notification, "id" | "read" | "timestamp">,
): void {
  const current = getNotifications();
  const newNotif: Notification = {
    ...data,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    read: false,
    timestamp: Date.now(),
  };
  const updated = [newNotif, ...current].slice(0, 50); // limit 50
  saveNotifications(updated);
}

/** Hitung jumlah notifikasi belum dibaca berdasarkan role */
export function getUnreadCount(role: string): number {
  const all = getNotifications();
  return all.filter(
    (n) => !n.read && (n.targetRole === "all" || n.targetRole === role),
  ).length;
}

/** Tandai satu notifikasi sebagai telah dibaca */
export function markAsRead(id: string): void {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
}

/** Tandai semua notifikasi untuk role terkait sebagai telah dibaca */
export function markAllAsRead(role: string): void {
  const current = getNotifications();
  const updated = current.map((n) =>
    n.targetRole === "all" || n.targetRole === role ? { ...n, read: true } : n,
  );
  saveNotifications(updated);
}
