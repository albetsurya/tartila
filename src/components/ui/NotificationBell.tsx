import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUnreadCount,
  type NotificationRole,
} from "../../services/notificationService";
import { notificationApi } from "../../services/notificationApi";
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

const NOTIFIKASI_PATH = "/member/ngaji-ceria/notifikasi";

export function NotificationBell({
  userRole = "member",
  className = "",
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [serverUnread, setServerUnread] = useState(0);
  const navigate = useNavigate();
  const totalUnread = unreadCount + serverUnread;

  useEffect(() => {
    let alive = true;
    const refreshCount = () => {
      setUnreadCount(getUnreadCount(userRole));
      notificationApi
        .unreadCount()
        .then((res) => {
          if (alive) setServerUnread(res.count);
        })
        .catch(() => {
          if (alive) setServerUnread(0);
        });
    };
    refreshCount();
    window.addEventListener("tartila:notification", refreshCount);
    return () => {
      alive = false;
      window.removeEventListener("tartila:notification", refreshCount);
    };
  }, [userRole]);

  return (
    <button
      type="button"
      aria-label="Buka halaman notifikasi"
      onClick={() => {
        tapFeedback();
        navigate(NOTIFIKASI_PATH);
      }}
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-none ${className}`}
    >
      <BellSvg size={20} />

      {/* Badge Jumlah Belum Dibaca (lokal + server, termasuk duel_challenge) */}
      {totalUnread > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-[#134E4A] bg-[#FF6B6B] px-1 text-[10px] font-black text-white shadow-[1.5px_1.5px_0px_#134E4A]">
          {totalUnread > 99 ? "99+" : totalUnread}
        </span>
      )}
    </button>
  );
}
