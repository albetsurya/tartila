import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { StickerButton } from "../../../components/ui/StickerButton";
import { TilaMascot } from "../../../components/ui/TilaMascot";
import {
  Gift,
  Info,
  Shield,
  BookOpen,
} from "../../../components/ui/CustomIcons";
import { tapFeedback } from "../../../lib/haptics";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
  type NotificationRole,
} from "../../../services/notificationService";

const USER_ROLE: NotificationRole = "member";

/** Warna & desain berdasarkan tipe notifikasi */
const TYPE_STYLES: Record<
  string,
  { iconBg: string; iconColor: string }
> = {
  reward: { iconBg: "bg-[#FEF08A]", iconColor: "text-[#B45309]" },
  info: { iconBg: "bg-[#E0F2FE]", iconColor: "text-[#0284C7]" },
  success: { iconBg: "bg-[#D1FAE5]", iconColor: "text-[#059669]" },
  warning: { iconBg: "bg-[#FFDBDB]", iconColor: "text-[#DC2626]" },
};

function getNotifIcon(type: string, size = 22) {
  switch (type) {
    case "reward":
      return <Gift size={size} />;
    case "warning":
      return <Shield size={size} />;
    default:
      return <Info size={size} />;
  }
}

function formatRelativeTime(ts: number) {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari yang lalu`;
  return new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = useCallback(() => {
    const list = getNotifications().filter(
      (n) => n.targetRole === "all" || n.targetRole === USER_ROLE,
    );
    list.sort((a, b) => b.timestamp - a.timestamp);
    setNotifications(list);
  }, []);

  useEffect(() => {
    refresh();
    const handleNotificationEvent = () => refresh();
    window.addEventListener("tartila:notification", handleNotificationEvent);
    return () => {
      window.removeEventListener(
        "tartila:notification",
        handleNotificationEvent,
      );
    };
  }, [refresh]);

  const unreadCount = getUnreadCount(USER_ROLE);

  const handleItemClick = (item: Notification) => {
    tapFeedback();
    if (!item.read) {
      markAsRead(item.id);
      refresh();
    }
    if (item.actionUrl) {
      navigate(item.actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    tapFeedback();
    markAllAsRead(USER_ROLE);
    refresh();
  };

  return (
    <NgajiCeriaLayout
      title="Notifikasi"
      showBack
      onBack={() => navigate("/member/ngaji-ceria")}
    >
      <div className="min-h-full bg-[#F0FDF4] px-4 py-4 pb-32">
        {/* Baris Judul + Tandai Semua Dibaca */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-black text-[#134E4A]">
              Kotak Masuk
            </h2>
            {unreadCount > 0 && (
              <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#134E4A]">
                {unreadCount} baru
              </span>
            )}
          </div>

          {unreadCount > 0 && notifications.length > 0 && (
            <StickerButton
              variant="secondary"
              size="sm"
              onClick={handleMarkAllRead}
            >
              <BookOpen size={13} /> Tandai Semua Dibaca
            </StickerButton>
          )}
        </div>

        {/* Daftar Notifikasi */}
        {notifications.length === 0 ? (
          /* Empty State Sticker Style */
          <div className="flex flex-col items-center justify-center rounded-[28px] border-[3px] border-dashed border-[#134E4A]/30 bg-white/60 py-14 text-center">
            <TilaMascot
              size={180}
              mood="sleeping"
              animation="float"
              className="object-contain"
            />
            <p className="mt-4 font-display text-base font-black text-[#134E4A]">
              Belum ada notifikasi baru untukmu.
            </p>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
              Yuk belajar dan kumpulkan hadiah! 🎁
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => {
              const style =
                TYPE_STYLES[item.type] || TYPE_STYLES["info"];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`relative w-full cursor-pointer rounded-2xl border-[3px] p-4 text-left transition-all active:translate-y-[1.5px] active:shadow-none ${
                    item.read
                      ? "border-[#134E4A]/25 bg-white shadow-[2px_2px_0px_#134E4A]/40"
                      : "border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A]"
                  }`}
                >
                  {/* Titik Merah untuk Belum Dibaca */}
                  {!item.read && (
                    <span
                      className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[#134E4A] bg-[#FF6B6B]"
                      aria-label="Belum dibaca"
                    />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Ikon Tipe */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] ${style.iconBg} ${style.iconColor}`}
                    >
                      {getNotifIcon(item.type)}
                    </div>

                    {/* Konten Teks */}
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-display text-sm leading-tight text-[#134E4A] ${
                          item.read ? "font-black opacity-70" : "font-black"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs font-bold text-gray-600">
                        {item.message}
                      </p>
                      <p className="mt-1.5 text-[10px] font-black text-[#134E4A]/50">
                        {formatRelativeTime(item.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}
