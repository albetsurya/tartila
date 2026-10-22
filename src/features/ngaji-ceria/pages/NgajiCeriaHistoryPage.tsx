import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { useNgajiCeriaStore } from "../hooks/useNgajiCeriaStore";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import { getTilawatiDataset } from "../data/tilawatiPageDatasets";
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

  const displayName = user?.name ? user.name.split(" ")[0] : "Santri";

  const perJilid = useMemo<JilidProgress[]>(() => {
    return [1, 2, 3, 4, 5].map((jilid) => {
      const pages = Object.keys(getTilawatiDataset(jilid));
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
      <div className="min-h-full bg-[#F0FDF4]">
        {/* A. Header */}
        <header className="rounded-b-3xl bg-[#134E4A] p-6 pt-safe text-white">
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/member/ngaji-ceria/profile")}
              aria-label="Kembali ke profil"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <h1 className="font-display text-base font-black">
              Riwayat & Laporan
            </h1>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <ChartLine size={18} className="text-[#FF6B6B]" />
            </span>
          </div>
          <p className="mt-4 font-display text-xl font-black">
            Luar biasa, <span className="text-[#FF6B6B]">{displayName}</span>!
          </p>
          <p className="text-xs text-white/70">
            Terus semangat, capaianmu makin bertambah.
          </p>
        </header>

        <div className="space-y-4 px-4 pb-4">
          {/* B. Stats Row */}
          <section className="-mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-3xl border border-gray-100 bg-white p-3 text-center shadow-sm">
              <Star size={20} className="mx-auto text-[#FF6B6B]" />
              <p className="mt-2 text-lg font-black text-[#134E4A]">
                {totalStars}
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/60">Bintang</p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-3 text-center shadow-sm">
              <BookOpen size={20} className="mx-auto text-[#0D9488]" />
              <p className="mt-2 text-lg font-black text-[#134E4A]">
                {totalDone}
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/60">Halaman</p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-3 text-center shadow-sm">
              <LayerGroup size={20} className="mx-auto text-[#134E4A]" />
              <p className="mt-2 text-lg font-black text-[#134E4A]">
                {currentJilidNumber}
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/60">Level</p>
            </div>
          </section>

          {/* C. Progress Keseluruhan */}
          <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-black text-[#134E4A]">
                  Progress Keseluruhan
                </h3>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#0D9488] transition-all"
                    style={{ width: `${progressPercentage}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressPercentage}
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-bold text-[#134E4A]/60">
                  {totalDone} halaman selesai
                </p>
              </div>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#FF6B6B] text-sm font-black text-[#FF6B6B]">
                {progressPercentage}%
              </div>
            </div>
          </section>

          {/* D. Progress Tiap Tilawati */}
          <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-display text-sm font-black text-[#134E4A]">
              Progress Tiap Tilawati
            </h3>
            <div className="space-y-3">
              {perJilid.map((item) => {
                const isActive = item.jilid === currentJilidNumber;
                const isLocked = item.jilid > currentJilidNumber;
                return (
                  <div
                    key={item.jilid}
                    className={`rounded-2xl p-3 ${
                      isLocked
                        ? "bg-white opacity-50"
                        : isActive
                          ? "border-l-4 border-[#0D9488] bg-[#F0FDF4]"
                          : "bg-[#F0FDF4]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm text-[#134E4A]">
                          Tilawati {item.jilid}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-black uppercase tracking-wide text-[#0D9488]">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-bold text-[#FF6B6B]">
                          <Star size={12} className="fill-[#FF6B6B]" />
                          {item.stars}
                        </span>
                        {isLocked && (
                          <Lock size={14} className="text-[#134E4A]/50" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#0D9488] transition-all"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] font-bold text-[#134E4A]/60">
                      {item.done}/{item.total} halaman • {item.percent}%
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="h-28" aria-hidden="true" />
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
