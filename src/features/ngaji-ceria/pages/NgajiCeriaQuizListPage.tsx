import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animationVariants";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import {
  LockSvg,
  PlaySvg,
  SparklesSvg,
  ChevronRightSvg,
} from "../../../components/ui/CustomIcons";
import { LoginPromptModal } from "../components/LoginPromptModal";
import { useJilidAccess } from "../components/GameLockGuard";
import { useNgajiCeriaStore } from "../hooks/useNgajiCeriaStore";
import { triggerBibiReaction } from "../../../utils/bibiEvent";

interface QuizBookProps {
  id: string;
  jilid: number;
  title: string;
  subtitle: string;
  level: string;
  coverImage: string;
  totalQuestions: number;
  completedQuestions: number;
  stars: number;
  isLocked?: boolean;
  onLockedTap?: () => void;
  onClick: () => void;
}

function StandaloneQuizBookCard({
  title,
  subtitle,
  level,
  coverImage,
  totalQuestions,
  completedQuestions,
  stars,
  isLocked = false,
  onLockedTap,
  onClick,
}: QuizBookProps) {
  const isCompleted = totalQuestions > 0 && completedQuestions === totalQuestions;
  const progressPercent =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative flex gap-3 rounded-[24px] bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#134E4A)] p-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] text-[var(--text-main,#134E4A)] overflow-hidden cursor-pointer ${
        isLocked ? "opacity-80 grayscale-[30%]" : ""
      }`}
    >
      {/* Gambar Buku */}
      <div className="relative shrink-0 w-20 h-24 flex items-center justify-center">
        <div className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-[var(--bg-app,#F0FDF4)] border-2 border-[var(--border-color,#134E4A)]/20" />
        <img
          src={coverImage}
          alt={title}
          className="relative z-10 w-full h-full object-contain drop-shadow-md"
        />
        {isLocked ? (
          <div className="absolute z-20 inset-0 m-auto w-7 h-7 rounded-full bg-[#134E4A]/80 text-white flex items-center justify-center border-2 border-white shadow-sm">
            <LockSvg size={14} />
          </div>
        ) : (
          <div className="absolute z-20 top-1 right-1 w-6 h-6 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center border-2 border-[var(--border-color,#134E4A)] shadow-sm">
            <PlaySvg size={12} className="ml-0.5" />
          </div>
        )}
      </div>

      {/* Detail */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] border-2 border-[var(--border-color,#134E4A)]/30">
              {level}
            </span>
            {isCompleted && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FF6B6B] text-white">
                Selesai
              </span>
            )}
          </div>
          <h3 className="font-display font-black text-sm text-[var(--text-main,#134E4A)] line-clamp-1">
            {title}
          </h3>
          <p className="text-[10px] font-semibold text-[var(--text-main,#134E4A)]/70 line-clamp-1 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((starIdx) => (
              <img
                key={starIdx}
                src={
                  starIdx <= stars
                    ? NGAJI_CERIA_ASSETS.bintang
                    : NGAJI_CERIA_ASSETS.bintangKosong
                }
                alt=""
                className="w-3.5 h-3.5 object-contain"
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-[#FF6B6B]">
            {completedQuestions}/{totalQuestions}
          </span>
        </div>

        {!isLocked && (
          <div className="w-full bg-[#F0FDF4] rounded-full h-1.5 mt-1.5 overflow-hidden border border-[#0D9488]/20">
            <div
              className="bg-[#0D9488] h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Tombol Mulai */}
      <button
        onClick={isLocked && onLockedTap ? onLockedTap : onClick}
        disabled={isLocked && !onLockedTap}
        className={`shrink-0 self-center inline-flex min-h-11 items-center gap-1 rounded-xl px-3 py-2.5 text-[11px] font-black transition-all border-2 ${
          isLocked
            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
            : "bg-[#0D9488] text-white border-[#134E4A] active:scale-95"
        }`}
      >
        {isLocked ? (
          <>
            <LockSvg size={12} /> Kunci
          </>
        ) : (
          <>
            Mulai <ChevronRightSvg size={12} />
          </>
        )}
      </button>
    </motion.div>
  );
}

function QuizBookEntry({
  onOpen,
  onLocked,
  ...book
}: {
  onOpen: () => void;
  onLocked: () => void;
} & Omit<QuizBookProps, "onClick" | "isLocked" | "onLockedTap"> & {
    jilid: number;
    isLocked: boolean;
  }) {
  const access = useJilidAccess(book.jilid);
  const locked = book.isLocked || (book.jilid > 0 && !access.isOpen);
  const canPrompt = book.jilid > 0 && !access.isOpen && !access.isLoggedIn;
  return (
    <StandaloneQuizBookCard
      {...book}
      isLocked={locked}
      onLockedTap={canPrompt ? onLocked : undefined}
      onClick={onOpen}
    />
  );
}

export default function NgajiCeriaQuizListPage() {
  const navigate = useNavigate();
  const [promptOpen, setPromptOpen] = useState(false);
  const starsByPage = useNgajiCeriaStore((state) => state.stars);

  const quizBooks = [
    {
      id: "jilid-1-tebak",
      jilid: 1,
      title: "Kitab Tebak Bacaan Jilid 1",
      subtitle: "Latihan membaca fathah tunggal.",
      level: "Jilid 1",
      coverImage: NGAJI_CERIA_ASSETS.jilidCovers[1],
      totalQuestions: 14,
      completedQuestions: 4,
      stars: 2,
      isLocked: false,
    },
    {
      id: "jilid-2-sambung",
      jilid: 2,
      title: "Kitab Huruf Sambung Jilid 2",
      subtitle: "Huruf bersambung & kasrah.",
      level: "Jilid 2",
      coverImage: NGAJI_CERIA_ASSETS.jilidCovers[2],
      totalQuestions: 15,
      completedQuestions: 0,
      stars: 0,
      isLocked: false,
    },
    {
      id: "jilid-3-mad",
      jilid: 3,
      title: "Kitab Mad & Panjang Jilid 3",
      subtitle: "Bacaan panjang & fathatain.",
      level: "Jilid 3",
      coverImage: NGAJI_CERIA_ASSETS.jilidCovers[3],
      totalQuestions: 20,
      completedQuestions: 0,
      stars: 0,
      isLocked: false,
    },
    {
      id: "jilid-4-tajwid",
      jilid: 4,
      title: "Kitab Qalqalah Jilid 4",
      subtitle: "Tasydid & penguatan huruf.",
      level: "Jilid 4",
      coverImage: NGAJI_CERIA_ASSETS.jilidCovers[4],
      totalQuestions: 20,
      completedQuestions: 0,
      stars: 0,
      isLocked: false,
    },
    {
      id: "jilid-5-ghunnah",
      jilid: 5,
      title: "Kitab Ghunnah Jilid 5",
      subtitle: "Nun & mim bertasydid.",
      level: "Jilid 5",
      coverImage: NGAJI_CERIA_ASSETS.jilidCovers[5],
      totalQuestions: 20,
      completedQuestions: 0,
      stars: 0,
      isLocked: false,
    },
    {
      id: "tebak-juz-amma",
      jilid: 0,
      title: "Kitab Tebak Juz 'Amma",
      subtitle: "Nama surah & ayat pendek.",
      level: "Pengayaan",
      coverImage: NGAJI_CERIA_ASSETS.bukuJuzAmma,
      totalQuestions: 10,
      completedQuestions: 0,
      stars: 0,
      isLocked: true,
    },
  ];

  return (
    <NgajiCeriaLayout
      title="Kuis Kartu"
      showBack
      onBack={() => navigate("/member/ngaji-ceria/explore/tilawati")}
    >
      <div className="px-4 py-4 space-y-5 bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] min-h-full rounded-t-3xl pb-32 transition-colors duration-200">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#0D9488] px-5 pt-6 pb-12 rounded-[24px] border-[3px] border-[var(--border-color,#134E4A)] shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 bg-white/10 rounded-2xl p-2 border-2 border-white/20 rotate-3">
              <img
                src={NGAJI_CERIA_ASSETS.tebakSurahBaru}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF6B6B] text-white text-[10px] font-black uppercase tracking-wider mb-1">
                <SparklesSvg size={12} /> Tantangan
              </div>
              <h2 className="font-display text-lg font-black text-white">
                Pilih Kitab Kuis
              </h2>
              <p className="text-[11px] text-white/80 leading-tight mt-0.5">
                Uji kelancaran membaca tajwid & irama.
              </p>
            </div>
          </div>
        </section>

        {/* List */}
        <motion.section
          variants={staggerContainerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {quizBooks.map((book) => (
            <motion.div key={book.id} variants={staggerItemVariants}>
              <QuizBookEntry
                {...book}
                completedQuestions={
                  book.jilid > 0
                    ? Math.min(
                        book.totalQuestions,
                        Object.entries(starsByPage).filter(
                          ([k, s]) =>
                            k.startsWith(`jilid-${book.jilid}-hal-`) && s > 0,
                        ).length,
                      )
                    : 0
                }
                stars={
                  book.jilid > 0
                    ? Math.max(
                        0,
                        ...Object.entries(starsByPage)
                          .filter(
                            ([k, s]) =>
                              k.startsWith(`jilid-${book.jilid}-hal-`) && s > 0,
                          )
                          .map(([, s]) => s),
                      )
                    : 0
                }
                onOpen={() => {
                  triggerBibiReaction("play");
                  navigate(
                    `/member/ngaji-ceria/quiz/play?jilid=${book.jilid}&hal=1`,
                  );
                }}
                onLocked={() => setPromptOpen(true)}
              />
            </motion.div>
          ))}
        </motion.section>

        <LoginPromptModal
          open={promptOpen}
          onClose={() => setPromptOpen(false)}
        />

        {/* Disclaimer */}
        <div className="pt-4 border-t border-gray-200 text-center mt-4">
          <p className="text-[10px] text-[#134e4a]/70 leading-relaxed max-w-xs mx-auto">
            Materi latihan disusun mandiri berdasarkan urutan pokok bahasan
            umum. "Tilawati" adalah merek terdaftar milik Pesantren Al-Qur'an
            Nurul Falah Surabaya.
          </p>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
