import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
  type NotificationRole,
} from "../../services/notificationService";
import { tapFeedback } from "../../lib/haptics";

interface NotificationBellProps {
  userRole?: NotificationRole;
  className?: string;
}

/** Ikon Lonceng Sticker Neo-Brutalism kustom */
const BellSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Badan lonceng */}
    <path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bandul lonceng */}
    <path
      d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
      fill="#F59E0B"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Aksen kilau */}
    <path
      d="M9 8a3 3 0 0 1 3-3"
      stroke="#FEF08A"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export function NotificationBell({
  userRole = "member",
  className = "",
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const refreshData = () => {
    const list = getNotifications();
    const filtered = list.filter(
      (n) => n.targetRole === "all" || n.targetRole === userRole,
    );
    setNotifications(filtered);
    setUnreadCount(getUnreadCount(userRole));
  };

  useEffect(() => {
    refreshData();

    const handleNotificationEvent = () => refreshData();
    window.addEventListener("tartila:notification", handleNotificationEvent);

    return () => {
      window.removeEventListener("tartila:notification", handleNotificationEvent);
    };
  }, [userRole]);

  // Handle klik di luar dropdown untuk menutup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    tapFeedback();
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    tapFeedback();
    markAllAsRead(userRole);
    refreshData();
  };

  const handleItemClick = (item: Notification) => {
    tapFeedback();
    if (!item.read) {
      markAsRead(item.id);
      refreshData();
    }
    if (item.actionUrl) {
      setIsOpen(false);
      navigate(item.actionUrl);
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes}m lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}j lalu`;
    const days = Math.floor(hours / 24);
    return `${days}h lalu`;
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Tombol Bell Sticker Style */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-none"
      >
        <BellSvg size={20} />

        {/* Badge Jumlah Belum Dibaca */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-[#134E4A] bg-[#FF6B6B] px-1 text-[10px] font-black text-white shadow-[1.5px_1.5px_0px_#134E4A]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Sticker Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-12 z-50 w-80 max-w-[90vw] rounded-2xl border-[3px] border-[#134E4A] bg-[#F0FDF4] p-3 shadow-[4px_4px_0px_#134E4A]"
          >
            {/* Panah Segitiga Sticker Style */}
            <div
              className="absolute -top-2 right-3 h-3.5 w-3.5 rotate-45 border-l-[3px] border-t-[3px] border-[#134E4A] bg-[#F0FDF4]"
              aria-hidden="true"
            />

            {/* Header Dropdown */}
            <div className="relative z-10 mb-2.5 flex items-center justify-between border-b-2 border-[#134E4A]/15 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm font-black text-[#134E4A]">
                  Pemberitahuan
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-md bg-[#FEF08A] px-1.5 py-0.5 text-[9px] font-black text-[#134E4A] border border-[#134E4A]">
                    {unreadCount} baru
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-black text-[#0D9488] transition-colors hover:text-[#0F766E] hover:underline"
                >
                  Tandai Semua Dibaca
                </button>
              )}
            </div>

            {/* List Notifikasi */}
            <div className="relative z-10 max-h-72 space-y-2 overflow-y-auto pr-0.5">
              {notifications.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs font-bold text-[#134E4A]/60">
                    Belum ada notifikasi baru
                  </p>
                </div>
              ) : (
                notifications.map((item) => {
                  const cardBg = item.read
                    ? "bg-white opacity-70 border-[#134E4A]/25"
                    : "bg-[#FEF3C7] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]";

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleItemClick(item);
                        }
                      }}
                      className={`cursor-pointer rounded-xl border-2 p-2.5 transition-all active:scale-[0.98] ${cardBg}`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="font-display text-xs font-black text-[#134E4A] leading-tight">
                          {item.title}
                        </h4>
                        <span className="shrink-0 text-[9px] font-bold text-[#134E4A]/60">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-bold text-[#134E4A]/80 leading-snug">
                        {item.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
