import React from "react";
import { ShieldSvg, CrownSvg, StarSvg } from "./CustomIcons";
import { useAuth } from "@/contexts/AuthContext";

export interface AvatarWithBadgeProps {
  src?: string | null;
  name?: string;
  size?: number; // Ukuran avatar dalam pixel, default 56
  role?: string | null;
  groupId?: string | null;
  tier?: string | null;
  gender?: "L" | "P" | "male" | "female" | string;
  shape?: "circle" | "rounded-2xl" | "rounded-xl";
  className?: string;
  imageClassName?: string;
  borderClassName?: string;
  showGuestBadge?: boolean;
  showBadge?: boolean;
}

/**
 * AvatarWithBadge: Komponen Avatar bergaya Neo-Brutalism dengan badge indikator Role / VIP
 * di pojok kanan bawah.
 *
 * Badge Matrix:
 * - Superadmin: Lingkaran merah #FF6B6B + Ikon Tameng (Shield)
 * - VIP: Lingkaran kuning emas #FBBF24 + Ikon Mahkota (Crown)
 * - Member: Lingkaran hijau toska #0D9488 + Ikon Bintang (Star)
 * - Guest: Lingkaran abu-abu jika showGuestBadge aktif, atau disembunyikan
 */
export function AvatarWithBadge({
  src,
  name = "Santri",
  size = 56,
  role,
  groupId,
  tier,
  gender = "L",
  shape = "circle",
  className = "",
  imageClassName = "",
  borderClassName = "border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  showGuestBadge = false,
  showBadge = true,
}: AvatarWithBadgeProps) {
  // Ambil state autentikasi jika prop role/groupId tidak diberikan secara eksplisit
  let authRole: string | undefined;
  let authGroupId: string | undefined;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const auth = useAuth();
    authRole = auth.user?.role;
    authGroupId = (auth.groupId ?? auth.user?.group_id) ?? undefined;
  } catch {
    // jika di luar AuthProvider
  }

  const effectiveRole = (role ?? authRole ?? "").toLowerCase();
  const effectiveGroupId = (groupId ?? authGroupId ?? "").toLowerCase();
  const effectiveTier = (tier ?? "").toLowerCase();

  const isSuperAdmin =
    effectiveTier === "superadmin" ||
    effectiveRole === "superadmin" ||
    effectiveRole === "super_admin" ||
    effectiveRole === "tartila_admin";

  const isVip =
    !isSuperAdmin &&
    (effectiveGroupId === "vip" ||
      effectiveRole === "vip" ||
      effectiveTier === "vip");

  const isMember =
    !isSuperAdmin &&
    !isVip &&
    Boolean(effectiveRole && effectiveRole !== "guest");

  const isGuest =
    !isSuperAdmin && !isVip && (!effectiveRole || effectiveRole === "guest");

  // Ukuran badge dan icon proporsional terhadap ukuran avatar
  const badgeSizeClass =
    size >= 80
      ? "w-8 h-8"
      : size >= 64
        ? "w-7 h-7"
        : size >= 50
          ? "w-6 h-6"
          : "w-5 h-5";

  const iconSize =
    size >= 80
      ? 16
      : size >= 64
        ? 14
        : size >= 50
          ? 12
          : 10;

  // Konfigurasi visual badge
  let badgeConfig: {
    bg: string;
    title: string;
    icon: React.ReactNode;
  } | null = null;

  if (isSuperAdmin) {
    badgeConfig = {
      bg: "bg-[#FF6B6B]",
      title: "Super Admin",
      icon: <ShieldSvg size={iconSize} color="#FFFFFF" className="shrink-0" />,
    };
  } else if (isVip) {
    badgeConfig = {
      bg: "bg-[#FBBF24]",
      title: "VIP Member",
      icon: <CrownSvg size={iconSize} className="shrink-0" />,
    };
  } else if (isMember) {
    badgeConfig = {
      bg: "bg-[#0D9488]",
      title: "Santri Member",
      icon: <StarSvg size={iconSize} className="shrink-0" />,
    };
  } else if (showGuestBadge && isGuest) {
    badgeConfig = {
      bg: "bg-gray-300",
      title: "Tamu",
      icon: (
        <span
          className="font-black text-[#134E4A] leading-none"
          style={{ fontSize: iconSize }}
        >
          ?
        </span>
      ),
    };
  }

  const roundedClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "rounded-xl"
        ? "rounded-xl"
        : "rounded-2xl";

  const isFemale = gender === "P" || gender === "female";
  const fallbackBg = isFemale
    ? "bg-[#FCE7F3] text-[#BE185D]"
    : "bg-[#CCFBF1] text-[#0F766E]";

  return (
    <div
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Container Gambar Avatar dengan overflow-hidden agar foto terpotong rapi */}
      <div
        className={`w-full h-full overflow-hidden flex items-center justify-center bg-white ${roundedClass} ${borderClassName}`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className={`w-full h-full object-cover ${imageClassName}`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center font-black uppercase ${fallbackBg}`}
          >
            <span style={{ fontSize: Math.max(12, Math.round(size * 0.42)) }}>
              {name?.trim()?.charAt(0) ?? "?"}
            </span>
          </div>
        )}
      </div>

      {/* Badge Role / VIP di pojok kanan bawah (berada di luar overflow-hidden sehingga tidak terpotong) */}
      {showBadge && badgeConfig && (
        <div
          title={badgeConfig.title}
          aria-label={badgeConfig.title}
          className={`absolute -bottom-1 -right-1 z-20 flex items-center justify-center rounded-full border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] ${badgeSizeClass} ${badgeConfig.bg} select-none`}
        >
          {badgeConfig.icon}
        </div>
      )}
    </div>
  );
}
export default AvatarWithBadge;
