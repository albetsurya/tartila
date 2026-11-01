import React, { useRef, useEffect } from "react";
import { ChevronLeftSvg, ChevronRightSvg } from "@/components/ui/CustomIcons";

interface TimelinePageBadgesProps {
  currentJilid: number;
  currentPage: number;
  totalPages?: number;
  disabled?: boolean;
  onSwitchPage: (jilid: number, hal: number) => void;
}

export const TimelinePageBadges: React.FC<TimelinePageBadgesProps> = ({
  currentJilid,
  currentPage,
  totalPages = 44,
  disabled = false,
  onSwitchPage,
}) => {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentPage, currentJilid]);

  return (
    <div className="te-page-badges-container" aria-label="Navigasi Halaman">
      <div className="te-page-badges-header">
        <span className="te-page-badge-label">
          HALAMAN (JILID {currentJilid}):
        </span>
        <div className="te-page-badges-quick">
          <button
            type="button"
            className="te-page-nav-arrow"
            disabled={disabled || currentPage <= 1}
            onClick={() =>
              onSwitchPage(currentJilid, Math.max(1, currentPage - 1))
            }
            title="Halaman Sebelumnya"
          >
            <ChevronLeftSvg size={14} className="inline mr-1" /> Hal {Math.max(1, currentPage - 1)}
          </button>
          <button
            type="button"
            className="te-page-nav-arrow"
            disabled={disabled || currentPage >= totalPages}
            onClick={() =>
              onSwitchPage(currentJilid, Math.min(totalPages, currentPage + 1))
            }
            title="Halaman Selanjutnya"
          >
            Hal {Math.min(totalPages, currentPage + 1)} <ChevronRightSvg size={14} className="inline ml-1" />
          </button>
        </div>
      </div>
      <div className="te-page-badges-strip" role="tablist">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              ref={isActive ? activeRef : null}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={disabled}
              className={`te-page-badge ${isActive ? "is-active" : ""}`}
              onClick={() => onSwitchPage(currentJilid, pageNum)}
              title={`Buka Halaman ${pageNum}`}
            >
              <span className="te-badge-num">{pageNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
