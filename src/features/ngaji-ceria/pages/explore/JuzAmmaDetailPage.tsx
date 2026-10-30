import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import { Volume2, ChevronLeftSvg } from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { JUZ_AMMA_SURAHS, everyAyahAudio } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

interface EquranAyah {
  nomorAyah: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio?: Record<string, string>;
}

interface EquranSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  ayat: EquranAyah[];
}

export default function JuzAmmaDetailPage() {
  const navigate = useNavigate();
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const surahMeta = useMemo(
    () => JUZ_AMMA_SURAHS.find((s) => s.number === Number(surahNumber)),
    [surahNumber],
  );
  const surahNum = surahMeta?.number ?? 78;

  const [surah, setSurah] = useState<EquranSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAyah, setExpandedAyah] = useState<number | null>(null);

  const { isPlaying, currentAudioUrl, play, pause, toggle } = useAudioPlayer();

  const fetchSurah = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://equran.id/api/v2/surat/${surahNum}`, {
        signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.code !== 200 || !json.data?.ayat) {
        throw new Error(json.message || "Data tidak valid");
      }
      setSurah(json.data as EquranSurah);
      setExpandedAyah(null);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Gagal memuat ayat. Periksa koneksi internet lalu coba lagi.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchSurah(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNum]);

  const playingAyah =
    isPlaying && currentAudioUrl
      ? Number(currentAudioUrl.match(/(\d{4,6})\.mp3/)?.[1]?.slice(-3))
      : null;

  const handlePlayAyah = (ayahNumber: number) => {
    triggerBibiReaction("play");
    const url = everyAyahAudio(surahNum, ayahNumber);
    if (isPlaying && currentAudioUrl === url) {
      pause();
      return;
    }
    if (isPlaying) {
      toggle(url);
      return;
    }
    play(url);
  };

  const handleBack = () => {
    navigate("/member/ngaji-ceria/explore/juz-amma");
  };

  if (!surahMeta) {
    return (
      <NgajiCeriaLayout
        title="Samudra Hafalan"
        hideHeader={true}
        showBack
        themeScope="juz-amma"
        onBack={handleBack}
      >
        <ThemedHeader
          title="Samudra Hafalan"
          onBack={handleBack}
          themeColorClass="bg-[#0369A1]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
        />
        <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6 text-center bg-[#0284C7]">
          <p className="font-display text-xl font-black text-[#FEF3C7]">
            Peta Surah tidak ditemukan
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl bg-[#FEF08A] px-4 py-2 text-sm font-black text-[#134E4A] border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] cursor-pointer"
          >
            Kembali ke Samudra
          </button>
        </div>
      </NgajiCeriaLayout>
    );
  }

  return (
    <NgajiCeriaLayout
      title={surahMeta.name}
      hideHeader={true}
      showBack
      themeScope="juz-amma"
      onBack={handleBack}
    >
      <ThemedHeader
        title={`Layar Surah ${surahMeta.name}`}
        onBack={handleBack}
        themeColorClass="bg-[#0369A1] border-b-[4px] border-[#134E4A]"
        textColorClass="text-[#FEF08A]"
        statVariant="capsule"
      />

      {/* Latar Belakang Samudra Biru & Bintang Kuning (#0284C7) */}
      <div
        className="min-h-[100dvh] bg-[#0284C7] px-4 py-6 pb-28 relative overflow-x-hidden"
        style={{
          backgroundImage:
            "radial-gradient(#FEF08A 1.75px, transparent 1.75px)",
          backgroundSize: "32px 32px",
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* ANJUNGAN KAPAL & BENDERA LAYAR SURAH */}
          <div className="flex justify-center -mb-1">
            <div
              className="h-6 w-36 bg-[#FEF08A] border-t-[3.5px] border-x-[3.5px] border-[#451A03] flex items-center justify-center text-[10px] font-black uppercase text-[#451A03]"
              style={{
                clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
              }}
            >
              ★ Kapal Juz 30 ★
            </div>
          </div>

          <section className="relative overflow-hidden rounded-2xl bg-[#78350F] p-5 sm:p-6 text-[#FEF3C7] border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03] mb-8">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#FEF08A] px-3 py-1 text-[10px] font-black text-[#451A03] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03]">
                  Peta Pelayaran #{surahMeta.number}
                </span>
                <p className="mt-2 font-display text-2xl font-black text-[#FEF3C7]">
                  {surahMeta.name}
                </p>
                <p className="text-xs font-bold text-[#FDE68A] mt-0.5">
                  {surah ? `${surah.arti} · ${surah.tempatTurun}` : "Memuat…"} ·{" "}
                  {surahMeta.ayah} Titik Harta Ayat
                </p>
              </div>
              <h2
                dir="rtl"
                className="font-arabic text-3xl sm:text-4xl font-bold leading-loose text-[#451A03] bg-[#FEF3C7] px-4 py-2 rounded-2xl border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03]"
              >
                {surah?.nama ?? ""}
              </h2>
            </div>
          </section>

          {/* LOADING / ERROR */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-12 text-[#FEF3C7]">
              <span className="block h-10 w-10 animate-spin rounded-full border-[4px] border-[#FEF3C7] border-t-[#FACC15]" />
              <p className="text-sm font-black text-[#FEF3C7]">
                Membentangkan gulungan layar & peta harta karun…
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border-[4px] border-[#451A03] bg-[#FFE4E6] p-6 text-center shadow-[5px_5px_0px_#451A03]">
              <p className="text-sm font-black text-[#B91C1C]">{error}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  void fetchSurah();
                }}
                className="rounded-xl bg-[#EF4444] px-4 py-2 text-xs font-black text-[#FFFFFF] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* GULUNGAN LAYAR KAPAL / PETA HARTA KARUN KREM (#FEF3C7) */}
          {!loading && !error && surah?.ayat && (
            <div className="relative">
              {/* Palang Tiang Layar Kayu Atas */}
              <div className="relative z-20 flex items-center">
                <div className="h-7 w-4 rounded-l-full bg-[#451A03]" />
                <div className="h-5 flex-1 rounded-full bg-[#78350F] border-[3.5px] border-[#451A03] shadow-[0_4px_0px_#451A03]" />
                <div className="h-7 w-4 rounded-r-full bg-[#451A03]" />
              </div>

              {/* Kanvas Peta Harta Karun / Layar Kapal (#FEF3C7) */}
              <div className="relative z-10 mx-2 sm:mx-4 -my-1 bg-[#FEF3C7] border-x-[4px] border-[#451A03] px-4 sm:px-7 py-8 shadow-[8px_8px_0px_#134E4A]">
                {/* Garis Rute Pelayaran Harta Karun Putus-putus */}
                <div className="pointer-events-none absolute left-8 sm:left-11 top-8 bottom-8 w-1 border-l-[3.5px] border-dashed border-[#D97706]" />

                <section className="space-y-6">
                  {surah.ayat.map((ayah) => {
                    const url = everyAyahAudio(surahNum, ayah.nomorAyah);
                    const isAyahPlaying = isPlaying && currentAudioUrl === url;

                    return (
                      <div
                        key={ayah.nomorAyah}
                        className="relative pl-9 sm:pl-12"
                      >
                        {/* Simbol Kompas / Bintang Harta Karun di Jalur Peta */}
                        <div className="pointer-events-none absolute left-0 top-5 w-7 h-7 rounded-full bg-[#FACC15] border-[3px] border-[#451A03] flex items-center justify-center text-[10px] font-black text-[#451A03] shadow-[2px_2px_0px_#451A03] z-10">
                          ★
                        </div>

                        <motion.article
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`relative rounded-2xl border-[3.5px] border-[#451A03] p-4 sm:p-5 shadow-[5px_5px_0px_#451A03] transition-colors ${
                            playingAyah === ayah.nomorAyah
                              ? "bg-[#FEF08A]"
                              : "bg-[#FFFBEB]"
                          }`}
                        >
                          {/* Baris Atas: Nomor Titik Peta + Tombol Putar */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black shadow-[2px_2px_0px_#451A03] ${
                                playingAyah === ayah.nomorAyah
                                  ? "bg-[#EF4444] text-[#FFFFFF]"
                                  : "bg-[#D97706] text-[#FEF3C7]"
                              }`}
                            >
                              Titik Ayat #{ayah.nomorAyah}
                            </span>

                            <button
                              type="button"
                              onClick={() => handlePlayAyah(ayah.nomorAyah)}
                              aria-label={
                                isAyahPlaying
                                  ? `Jeda ayat ${ayah.nomorAyah}`
                                  : `Putar ayat ${ayah.nomorAyah}`
                              }
                              className={`flex h-9 items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#451A03] px-3 text-xs font-black shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                                isAyahPlaying
                                  ? "bg-[#EF4444] text-[#FFFFFF]"
                                  : "bg-[#0284C7] text-[#FFFFFF]"
                              }`}
                            >
                              {isAyahPlaying ? (
                                <EqualizerIcon
                                  isPlaying={true}
                                  size={13}
                                  barClassName="bg-[#FFFFFF]"
                                />
                              ) : (
                                <Volume2 size={14} />
                              )}
                              {isAyahPlaying ? "Jeda" : "Putar Ayat"}
                            </button>
                          </div>

                          {/* Teks Arab di atas Lembaran Peta */}
                          <p
                            dir="rtl"
                            className="font-arabic text-2xl sm:text-3xl leading-loose text-[#451A03] text-right bg-[#FEF3C7] p-4 rounded-xl border-[3px] border-dashed border-[#B45309]"
                          >
                            {ayah.teksArab}
                          </p>

                          {/* Toggle Terjemahan */}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedAyah(
                                expandedAyah === ayah.nomorAyah
                                  ? null
                                  : ayah.nomorAyah,
                              )
                            }
                            className="mt-3 inline-block rounded-lg bg-[#78350F] text-[#FEF08A] border-[2px] border-[#451A03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide active:scale-95 cursor-pointer"
                          >
                            {expandedAyah === ayah.nomorAyah
                              ? "Tutup Kompas Arti"
                              : "Buka Latin & Arti"}
                          </button>

                          {expandedAyah === ayah.nomorAyah && (
                            <div className="mt-3 rounded-xl border-[3px] border-[#451A03] bg-[#FFFFFF] p-3.5 shadow-[3px_3px_0px_#451A03]">
                              <p className="text-xs font-black italic text-[#0284C7]">
                                {ayah.teksLatin}
                              </p>
                              <p className="mt-1.5 text-xs font-bold leading-relaxed text-[#451A03]">
                                {ayah.teksIndonesia}
                              </p>
                            </div>
                          )}
                        </motion.article>
                      </div>
                    );
                  })}
                </section>
              </div>

              {/* Palang Tiang Layar Kayu Bawah */}
              <div className="relative z-20 flex items-center">
                <div className="h-7 w-4 rounded-l-full bg-[#451A03]" />
                <div className="h-5 flex-1 rounded-full bg-[#78350F] border-[3.5px] border-[#451A03] shadow-[0_4px_0px_#451A03]" />
                <div className="h-7 w-4 rounded-r-full bg-[#451A03]" />
              </div>
            </div>
          )}

          {/* Navigasi Antar Pulau Surah */}
          {!loading && !error && surah && (
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={surahNum <= 78}
                onClick={() =>
                  navigate(
                    `/member/ngaji-ceria/explore/juz-amma/${surahNum - 1}`,
                  )
                }
                className="flex items-center gap-1.5 rounded-xl border-[3.5px] border-[#451A03] bg-[#FEF3C7] px-4 py-2.5 text-xs font-black text-[#451A03] shadow-[4px_4px_0px_#451A03] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeftSvg size={14} /> Pelayaran Sebelumnya
              </button>
              <button
                type="button"
                disabled={surahNum >= 114}
                onClick={() =>
                  navigate(
                    `/member/ngaji-ceria/explore/juz-amma/${surahNum + 1}`,
                  )
                }
                className="rounded-xl border-[3.5px] border-[#451A03] bg-[#FACC15] px-4 py-2.5 text-xs font-black text-[#451A03] shadow-[4px_4px_0px_#451A03] disabled:opacity-40 cursor-pointer"
              >
                Pelayaran Berikutnya
              </button>
            </div>
          )}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
