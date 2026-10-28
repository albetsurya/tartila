import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { useNgajiCeriaStore } from "../hooks/useNgajiCeriaStore";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import { loadTilawatiDataset } from "../data/tilawatiPageDatasets";
import { StickerCard } from "../../../components/ui/StickerCard";
import {
  BookOpen,
  ChartLine,
  ChevronLeft,
  LayerGroup,
  Lock,
  Star,
} from "../../../components/ui/CustomIcons";

interface JilidProgress {
  jilid: number;
  total: number;
  done: number;
  percent: number;
  stars: number;
}

export default function NgajiCeriaHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stars = useNgajiCeriaStore((state) => state.stars);
  const { currentJilid, progressPercentage } = useNgajiCeriaProgress();
  const currentJilidNumber = Number(currentJilid.replace("jilid-", "")) || 1;

  const [datasets, setDatasets] = useState<
    Record<number, Record<number, import("../data/tilawatiPageDatasets").PageQuizData>>
  >({});

  // Preload semua dataset jilid 1-6
  useEffect(() => {
    let alive = true;
    const jilids = [1, 2, 3, 4, 5, 6];
    Promise.all(jilids.map((jilid) => loadTilawatiDataset(jilid)))
      .then((results) => {
        if (alive) setDatasets(Object.fromEntries(results.map((d, i) => [jilids[i], d])));
      })
      .finally(() => {
        if (alive) {
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const displayName = user?.name ? user.name.split(" ")[0] : "Santri";

  const perJilid = useMemo<JilidProgress[]>(() => {
    return [1, 2, 3, 4, 5, 6].map((jilid) => {
      const pages = Object.keys(datasets[jilid] || {});
      const total = pages.length;
      let done = 0;
      let earned = 0;
      for (const page of pages) {
        const value = stars[`jilid-${jilid}-hal-${page}`] || 0;
        if (value > 0) done += 1;
        earned += value;
      }
      return {
        jilid,
        total,
        done,
        percent: total ? Math.round((done / total) * 100) : 0,
        stars: earned,
      };
    });
  }, [stars]);

  const totalStars = perJilid.reduce((sum, item) => sum + item.stars, 0);
  const totalDone = perJilid.reduce((sum, item) => sum + item.done, 0);

  return (
    <NgajiCeriaLayout hideHeader>
      <div className="min-h-full bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] transition-colors duration-200">
        {/* A. Header Neo-Brutalism */}
        <header className="rounded-b-[36px] bg-[#134E4A] border-b-[3px] border-[var(--border-color,#134E4A)] p-6 pt-safe text-white shadow-[0_4px_0px_var(--shadow-color,#134E4A)]">
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/member/ngaji-ceria/profile")}
              aria-label="Kembali"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white bg-white/15 transition active:scale-95 shadow-[2px_2px_0px_rgba(0,0,0,0.3)] cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="font-display text-base font-black">
              Riwayat &amp; Laporan
            </h1>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white bg-white/15 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              <ChartLine size={20} className="text-[#FF6B6B]" />
            </span>
          </div>
          <p className="mt-4 font-display text-xl font-black">
            Luar biasa, <span className="text-[#FF6B6B]">{displayName}</span>!
          </p>
          <p className="text-xs text-white/80 font-medium">
            Terus semangat, capaianmu makin bertambah.
          </p>
        </header>

        <div className="space-y-4 px-4 pb-4">
          {/* B. Stats Row Neo-Brutalism */}
          <section className="-mt-8 grid grid-cols-3 gap-3 relative z-20">
            <StickerCard className="p-3 text-center">
              <Star size={24} className="mx-auto text-[#FF6B6B] fill-[#FF6B6B]" />
              <p className="mt-2 text-xl font-display font-black text-[var(--text-main,#134E4A)]">
                {totalStars}
              </p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-main,#134E4A)]/70">
                Bintang
              </p>
            </StickerCard>
            <StickerCard className="p-3 text-center">
              <BookOpen size={24} className="mx-auto text-[#0D9488]" />
              <p className="mt-2 text-xl font-display font-black text-[var(--text-main,#134E4A)]">
                {totalDone}
              </p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-main,#134E4A)]/70">
                Halaman
              </p>
            </StickerCard>
            <StickerCard className="p-3 text-center">
              <LayerGroup size={24} className="mx-auto text-[#F59E0B]" />
              <p className="mt-2 text-xl font-display font-black text-[var(--text-main,#134E4A)]">
                {currentJilidNumber}
              </p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-main,#134E4A)]/70">
                Level
              </p>
            </StickerCard>
          </section>

          {/* C. Progress Keseluruhan Neo-Brutalism */}
          <StickerCard className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-black text-[var(--text-main,#134E4A)]">
                  Progress Keseluruhan
                </h3>
                {/* Neo-Brutalism Progress Bar */}
                <div className="mt-2.5 h-4 w-full overflow-hidden rounded-xl border-[2.5px] border-[var(--border-color,#134E4A)] bg-gray-100 dark:bg-gray-800 shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]">
                  <div
                    className="h-full rounded-lg bg-[#0D9488] transition-all"
                    style={{ width: `${progressPercentage}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressPercentage}
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-black text-[var(--text-main,#134E4A)]/70">
                  {totalDone} halaman selesai
                </p>
              </div>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#FF6B6B] bg-[#FFF1F2] dark:bg-[#881337] text-base font-display font-black text-[#FF6B6B] shadow-[3px_3px_0px_#FF6B6B]">
                {progressPercentage}%
              </div>
            </div>
          </StickerCard>

          {/* D. Progress Tiap Tilawati Neo-Brutalism */}
          <StickerCard className="p-4 space-y-3">
            <h3 className="font-display text-sm font-black text-[var(--text-main,#134E4A)]">
              Progress Tiap Tilawati
            </h3>
            <div className="space-y-3">
              {perJilid.map((item) => {
                const isActive = item.jilid === currentJilidNumber;
                const isLocked = item.jilid > currentJilidNumber;
                return (
                  <div
                    key={item.jilid}
                    className={`rounded-xl border-2 p-3 transition-all ${
                      isLocked
                        ? "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 text-gray-500 shadow-none"
                        : isActive
                          ? "border-[var(--border-color,#134E4A)] bg-[#CCFBF1] dark:bg-[#1E293B] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]"
                          : "border-[var(--border-color,#134E4A)]/40 bg-[var(--bg-app,#F0FDF4)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm text-[var(--text-main,#134E4A)]">
                          Tilawati {item.jilid}
                        </span>
                        {isActive && (
                          <span className="rounded-md border border-[#0D9488] bg-[#0D9488] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-black text-[#FF6B6B]">
                          <Star size={14} className="fill-[#FF6B6B]" />
                          {item.stars}
                        </span>
                        {isLocked && (
                          <Lock size={14} className="text-[var(--text-main,#134E4A)]/50" />
                        )}
                      </div>
                    </div>
                    {/* Neo-brutalism thick progress bar */}
                    <div className="mt-2.5 h-3.5 w-full overflow-hidden rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-gray-100 dark:bg-gray-800 shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]">
                      <div
                        className="h-full rounded-sm bg-[#0D9488] transition-all"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] font-bold text-[var(--text-main,#134E4A)]/70">
                      {item.done}/{item.total} halaman • {item.percent}%
                    </p>
                  </div>
                );
              })}
            </div>
          </StickerCard>

          <div className="h-28" aria-hidden="true" />
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
