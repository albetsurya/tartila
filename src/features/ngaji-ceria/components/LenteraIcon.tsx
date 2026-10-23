import React from "react";

interface LenteraIconProps {
  size?: number;
  lit?: boolean;
  className?: string;
}

export const LenteraIcon: React.FC<LenteraIconProps> = ({
  size = 24,
  lit = true,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ring Gantungan */}
      <circle
        cx="12"
        cy="3"
        r="2"
        stroke="#134E4A"
        strokeWidth="2.2"
        fill="none"
      />
      {/* Atap Kubah Lentera */}
      <path
        d="M5 8C5 5.5 8 5 12 5C16 5 19 5.5 19 8H5Z"
        fill="#F59E0B"
        stroke="#134E4A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Badan Kaca Lentera */}
      <rect
        x="5"
        y="8"
        width="14"
        height="11"
        rx="2"
        fill={lit ? "#FEF08A" : "#F1F5F9"}
        stroke="#134E4A"
        strokeWidth="2.2"
      />
      {/* Kisi Pembagi Kaca */}
      <line
        x1="9.5"
        y1="8"
        x2="9.5"
        y2="19"
        stroke="#134E4A"
        strokeWidth="1.8"
        strokeOpacity="0.4"
      />
      <line
        x1="14.5"
        y1="8"
        x2="14.5"
        y2="19"
        stroke="#134E4A"
        strokeWidth="1.8"
        strokeOpacity="0.4"
      />
      {/* Nyala Pelita Api / Sumbu */}
      {lit ? (
        <>
          <path
            d="M12 10.8C12 10.8 10.3 12.8 10.3 14.3C10.3 15.2 11.1 16 12 16C12.9 16 13.7 15.2 13.7 14.3C13.7 12.8 12 10.8 12 10.8Z"
            fill="#EA580C"
          />
          <circle cx="12" cy="14.2" r="0.9" fill="#FEF08A" />
        </>
      ) : (
        <circle cx="12" cy="14" r="1.5" fill="#94A3B8" />
      )}
      {/* Kaki Landasan Lentera */}
      <path
        d="M7 19H17V21.5H7V19Z"
        fill="#D97706"
        stroke="#134E4A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
};
