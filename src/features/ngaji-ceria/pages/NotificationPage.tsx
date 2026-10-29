import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { StickerButton } from "../../../components/ui/StickerButton";
import { StickerCard } from "../../../components/ui/StickerCard";
import { TilaMascot } from "../../../components/ui/TilaMascot";
import {
  Gift,
  Info,
  Shield,
  BookOpen,
  Swords,
} from "../../../components/ui/CustomIcons";
import { tapFeedback } from "../../../lib/haptics";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "../../../services/notificationService";
import {
  notificationApi,
  type ServerNotification,
} from "../../../services/notificationApi";
import { duelService } from "../../../services/duelService";
import { AppModal } from "../../../components/ui/AppModal";

const USER_ROLE = "member";

/** Warna & desain berdasarkan tipe notifikasi */
const TYPE_STYLES: Record<string, { iconBg: string; iconColor: string }> = {
  reward: { iconBg: "bg-[#FEF08A]", iconColor: "text-[#B45309]" },
  info: { iconBg: "bg-[#E0F2FE]", iconColor: "text-[#0284C7]" },
  success: { iconBg: "bg-[#D1FAE5]", iconColor: "text-[#059669]" },
  warning: { iconBg: "bg-[#FFDBDB]", iconColor: "text-[#DC2626]" },
  duel_challenge: { iconBg: "bg-[#FEF08A]", iconColor: "text-[#B91C1C]" },
  duel_result: { iconBg: "bg-[#FEF3C7]", iconColor: "text-[#B45309]" },
};

function getNotifIcon(type: string, size = 22) {
  switch (type) {
    case "reward":
      return <Gift size={size} />;
    case "warning":
      return <Shield size={size} />;
    case "duel_challenge":
      return <Swords size={size} />;
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

function formatServerTime(iso: string) {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "";
  return formatRelativeTime(ts);
}

function isServerNotification(
  n: Notification | ServerNotification,
): n is ServerNotification {
  return typeof (n as ServerNotification).createdAt === "string";
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [serverNotifications, setServerNotifications] = useState<
    ServerNotification[]
  >([]);
  const [selectedNotif, setSelectedNotif] = useState<
    Notification | ServerNotification | null
  >(null);

  const refresh = useCallback(() => {
    const list = getNotifications().filter(
      (n) => n.targetRole === "all" || n.targetRole === USER_ROLE,
    );
    list.sort((a, b) => b.timestamp - a.timestamp);
    setNotifications(list);
    notificationApi
      .list()
      .then((rows) => setServerNotifications(rows))
      .catch(() => setServerNotifications([]));
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

  const localUnreadCount = getUnreadCount(USER_ROLE);
  const serverUnreadCount = serverNotifications.filter((n) => !n.isRead).length;
  const totalUnread = localUnreadCount + serverUnreadCount;

  const handleLocalItemClick = (item: Notification) => {
    tapFeedback();
    if (!item.read) {
      markAsRead(item.id);
      refresh();
    }
    setSelectedNotif(item);
    window.dispatchEvent(new Event("tartila:notification"));
  };

  const handleLocalMarkAllRead = () => {
    tapFeedback();
    markAllAsRead(USER_ROLE);
    refresh();
    window.dispatchEvent(new Event("tartila:notification"));
  };

  const handleServerMarkAllRead = () => {
    tapFeedback();
    notificationApi
      .markAllRead()
      .then(() => {
        refresh();
        window.dispatchEvent(new Event("tartila:notification"));
      })
      .catch(() => {});
  };

  const handleDuelResponse = (
    item: ServerNotification,
    action: "accept" | "reject",
  ) => {
    tapFeedback();
    const challengeId =
      typeof item.payload?.challengeId === "string"
        ? item.payload.challengeId
        : "";
    if (!challengeId) {
      notificationApi.markRead(item.id).then(() => refresh()).catch(() => {});
      return;
    }
    const call =
      action === "accept"
        ? duelService.acceptChallenge(challengeId)
        : duelService.rejectChallenge(challengeId);
    call
      .then((result) => {
        notificationApi
          .markRead(item.id)
          .then(() => {
            refresh();
            window.dispatchEvent(new Event("tartila:notification"));
          })
          .catch(() => refresh());
        if (action === "accept" && result?.roomId) {
          navigate("/member/ngaji-ceria/games", {
            state: { roomId: result.roomId },
          });
        }
      })
      .catch(() => refresh());
  };

  const duelChallenges = serverNotifications.filter(
    (n) => n.type === "duel_challenge" && !n.isRead,
  );
  const serverOthers = serverNotifications.filter(
    (n) => n.type !== "duel_challenge",
  );
  const isEmpty =
    notifications.length === 0 && serverNotifications.length === 0;

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
            {totalUnread > 0 && (
              <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#134E4A]">
                {totalUnread} baru
              </span>
            )}
          </div>

          {totalUnread > 0 && !isEmpty && (
            <div className="flex gap-2">
              <StickerButton
                variant="secondary"
                size="sm"
                onClick={handleLocalMarkAllRead}
              >
                <BookOpen size={13} /> Tandai Semua
              </StickerButton>
              <StickerButton
                variant="secondary"
                size="sm"
                onClick={handleServerMarkAllRead}
              >
                Server
              </StickerButton>
            </div>
          )}
        </div>

        {isEmpty ? (
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
              Yuk belajar dan kumpulkan hadiah!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Kartu khusus tantangan duel masuk */}
            {duelChallenges.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border-[3px] border-[#B91C1C] bg-[#FEF08A] p-4 shadow-[3px_3px_0px_#B91C1C]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#B91C1C] bg-white text-[#B91C1C]">
                    <Swords size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-black text-[#134E4A]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-bold text-[#134E4A]">
                      {item.message}
                    </p>
                    <p className="mt-1 text-[10px] font-black text-[#B91C1C]/70">
                      {formatServerTime(item.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <StickerButton
                    variant="primary"
                    size="sm"
                    className="border-[#B91C1C]"
                    onClick={() => handleDuelResponse(item, "accept")}
                  >
                    <Swords size={14} /> Terima Duel
                  </StickerButton>
                  <StickerButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDuelResponse(item, "reject")}
                  >
                    Tolak
                  </StickerButton>
                </div>
              </div>
            ))}

            {/* Notifikasi server lainnya */}
            {serverOthers.map((item) => {
              const style = TYPE_STYLES[item.type] || TYPE_STYLES["info"];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    tapFeedback();
                    if (!item.isRead) {
                      notificationApi
                        .markRead(item.id)
                        .then(() => refresh())
                        .catch(() => {});
                    }
                    setSelectedNotif(item);
                    window.dispatchEvent(new Event("tartila:notification"));
                  }}
                  className={`relative w-full cursor-pointer rounded-2xl border-[3px] p-4 text-left transition-all active:translate-y-[1.5px] active:shadow-none ${
                    item.isRead
                      ? "border-[#134E4A]/25 bg-white shadow-[2px_2px_0px_#134E4A]/40"
                      : "border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A]"
                  }`}
                >
                  {!item.isRead && (
                    <span
                      className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[#134E4A] bg-[#FF6B6B]"
                      aria-label="Belum dibaca"
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] ${style.iconBg} ${style.iconColor}`}
                    >
                      {getNotifIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-display text-sm leading-tight text-[#134E4A] ${
                          item.isRead ? "font-black opacity-70" : "font-black"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs font-bold text-gray-600">
                        {item.message}
                      </p>
                      <p className="mt-1.5 text-[10px] font-black text-[#134E4A]/50">
                        {formatServerTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Notifikasi lokal */}
            {notifications.map((item) => {
              const style = TYPE_STYLES[item.type] || TYPE_STYLES["info"];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLocalItemClick(item)}
                  className={`relative w-full cursor-pointer rounded-2xl border-[3px] p-4 text-left transition-all active:translate-y-[1.5px] active:shadow-none ${
                    item.read
                      ? "border-[#134E4A]/25 bg-white shadow-[2px_2px_0px_#134E4A]/40"
                      : "border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A]"
                  }`}
                >
                  {!item.read && (
                    <span
                      className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[#134E4A] bg-[#FF6B6B]"
                      aria-label="Belum dibaca"
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] ${style.iconBg} ${style.iconColor}`}
                    >
                      {getNotifIcon(item.type)}
                    </div>
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
      {selectedNotif && (() => {
        const hasAction =
          "actionUrl" in selectedNotif && selectedNotif.actionUrl;
        return (
          <AppModal
            isOpen
            onClose={() => setSelectedNotif(null)}
            title={selectedNotif.title}
            variant="cool"
          >
            <div className="flex gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] ${
                  (TYPE_STYLES[selectedNotif.type] || TYPE_STYLES["info"]).iconBg
                } ${(TYPE_STYLES[selectedNotif.type] || TYPE_STYLES["info"]).iconColor}`}
              >
                {getNotifIcon(selectedNotif.type, 20)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-black text-[#134E4A]">
                  {selectedNotif.title}
                </p>
                <p className="mt-1 text-sm font-bold text-[#134E4A]">
                  {selectedNotif.message}
                </p>
                <p className="mt-1.5 text-[10px] font-black text-[#134E4A]/50">
                  {isServerNotification(selectedNotif)
                    ? formatServerTime(selectedNotif.createdAt)
                    : formatRelativeTime(selectedNotif.timestamp)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {hasAction ? (
                <>
                  <StickerButton
                    variant="primary"
                    onClick={() => {
                      const url = selectedNotif.actionUrl;
                      setSelectedNotif(null);
                      if (url) navigate(url);
                    }}
                  >
                    Buka Halaman
                  </StickerButton>
                  <StickerButton
                    variant="secondary"
                    onClick={() => setSelectedNotif(null)}
                  >
                    Tutup
                  </StickerButton>
                </>
              ) : (
                <StickerButton
                  variant="primary"
                  onClick={() => setSelectedNotif(null)}
                >
                  Tutup
                </StickerButton>
              )}
            </div>
          </AppModal>
        );
      })()}
    </NgajiCeriaLayout>
  );
}
