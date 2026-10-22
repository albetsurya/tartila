import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Info,
  BookOpen,
} from "../../../components/ui/CustomIcons";

type Tab = "konsonan" | "vokal" | "tips";

interface PanduanMembacaModalProps {
  open: boolean;
  onClose: () => void;
}

const KONSONAN_DATA = [
  {
    arabic: "ا / ء",
    latin: "Alif / Hamzah",
    desc: "Suara dari pangkal tenggorokan, jelas dan lepas (A, I, U).",
    highlight: "'A",
  },
  { arabic: "ب", latin: "Ba", desc: "Kedua bibir merapat rapat lalu terbuka." },
  {
    arabic: "ت",
    latin: "Ta",
    desc: "Ujung lidah menempel di pangkal gigi seri atas (tidak ditekan tebal).",
  },
  {
    arabic: "ث",
    latin: "Tsa",
    desc: "Ujung lidah keluar sedikit di antara gigi atas & bawah, berdesis lembut.",
  },
  {
    arabic: "ج",
    latin: "Jim",
    desc: "Tengah lidah menempel ke langit-langit atas, bunyi kaya & tidak bocor.",
  },
  {
    arabic: "ح",
    latin: "Ha (Pedas)",
    desc: "Tengah tenggorokan, suara bersih, desah halus tanpa getaran leher.",
  },
  {
    arabic: "خ",
    latin: "Kho",
    desc: "Tenggorokan agak ke atas, suara serak tapi tidak menggetarkan leher.",
  },
  {
    arabic: "د",
    latin: "Dal",
    desc: "Ujung lidah di pangkal gigi seri atas, suara jelas dan mantap.",
  },
  {
    arabic: "ذ",
    latin: "Dzal",
    desc: "Ujung lidah di ujung gigi seri atas, bergetar lembut dan berdesis.",
  },
  {
    arabic: "ر",
    latin: "Ro",
    desc: "Ujung lidah bergetar tipis, melengkung ke atas.",
  },
  {
    arabic: "ز",
    latin: "Za",
    desc: "Ujung lidah di belakang gigi seri bawah, desis suara tajam.",
  },
  {
    arabic: "س",
    latin: "Sin",
    desc: "Ujung lidah di belakang gigi seri bawah, hembusan angin bersih.",
  },
  {
    arabic: "ش",
    latin: "Sya",
    desc: "Tengah lidah terangkat, desah suara menyebar.",
  },
  {
    arabic: "ص",
    latin: "Shod",
    desc: "Ujung lidah di belakang gigi, suara tebal dan berat.",
  },
  {
    arabic: "ض",
    latin: "Dhod",
    desc: "Sisi lidah menempel ke gigi geraham atas, suara tebal dan berat.",
  },
  {
    arabic: "ط",
    latin: "Tho",
    desc: "Ujung lidah di pangkal gigi seri atas, suara tebal dan tertahan.",
  },
  {
    arabic: "ظ",
    latin: "Zho",
    desc: "Ujung lidah di ujung gigi seri atas, suara tebal dan berdesis.",
    highlight: "Zho",
  },
  {
    arabic: "ع",
    latin: "'Ain",
    desc: "Tengah tenggorokan, suara ditekan dan tertahan.",
    highlight: "'A",
  },
  {
    arabic: "غ",
    latin: "Ghoin",
    desc: "Pangkal tenggorokan (atas), suara bergetar/berkumur ringan.",
  },
  {
    arabic: "ف",
    latin: "Fa",
    desc: "Bibir bawah bagian dalam menempel gigi seri atas, suara berdesis ringan.",
  },
  {
    arabic: "ق",
    latin: "Qof",
    desc: "Pangkal lidah menempel ke langit-langit lunak, suara tebal dan mantap.",
  },
  {
    arabic: "ك",
    latin: "Kaf",
    desc: "Pangkal lidah sedikit ke depan dari Qof, suara ringan dan bersih.",
  },
  {
    arabic: "ل",
    latin: "Lam",
    desc: "Ujung lidah menempel ke langit-langit depan (gusi atas).",
  },
  {
    arabic: "م",
    latin: "Mim",
    desc: "Kedua bibir merapat, suara keluar dari hidung (dengung).",
  },
  {
    arabic: "ن",
    latin: "Nun",
    desc: "Ujung lidah di bawah makhraj Lam, suara keluar dari hidung (dengung).",
  },
  {
    arabic: "و",
    latin: "Wau",
    desc: "Kedua bibir dibulatkan ke depan, tidak merapat.",
  },
  {
    arabic: "ه",
    latin: "Ha (Ringan)",
    desc: "Pangkal tenggorokan (bawah), suara lepas dan ringan.",
  },
  {
    arabic: "ي",
    latin: "Ya",
    desc: "Tengah lidah menempel ke langit-langit keras, bibir melebar.",
  },
];

export function PanduanMembacaModal({
  open,
  onClose,
}: PanduanMembacaModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("konsonan");

  const tabs = [
    { key: "konsonan" as const, label: "Konsonan & Makhraj" },
    { key: "vokal" as const, label: "Vokal & Panjang" },
    { key: "tips" as const, label: "Tips Pendamping" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-[28px] border-[3px] border-[#134E4A] bg-white shadow-[6px_6px_0px_#134E4A] flex flex-col"
          >
            {/* Header - Gaya Sticker Deep Teal */}
            <div className="relative bg-[#134E4A] p-5 rounded-t-[24px]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 text-white flex items-center justify-center active:scale-90 transition-transform"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-3 pr-8">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#F0FDF4] border-[3px] border-[#134E4A] flex items-center justify-center shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                  <BookOpen size={24} className="text-[#0D9488]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-white text-lg leading-tight">
                    Panduan Membaca Latin
                  </h2>
                  <p className="text-[11px] font-bold text-white/70 mt-1">
                    Standar transliterasi resmi untuk pendamping santri.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs - Gaya Tombol Sticker */}
            <div className="flex gap-2 p-3 bg-white border-b-[3px] border-[#134E4A]">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-xl py-2 px-1 text-[10px] font-black leading-tight transition-all border-[2px] ${
                    activeTab === tab.key
                      ? "bg-[#FF6B6B] text-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                      : "bg-white text-[#134E4A] border-[#134E4A]/20 hover:bg-gray-50 active:translate-y-[1px]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area - Background Mint Cloud */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0FDF4]">
              {/* KONSONAN TAB */}
              {activeTab === "konsonan" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Highlight Box - Gaya Sticker Kuning */}
                  <div className="bg-[#FEF3C7] border-[3px] border-[#134E4A] rounded-2xl p-4 flex gap-3 items-start shadow-[3px_3px_0px_#134E4A]">
                    <div className="bg-[#F59E0B] text-white p-1.5 rounded-full shrink-0 mt-0.5 border-2 border-[#134E4A]">
                      <Info size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#134E4A] mb-1">
                        Pembedaan Utama
                      </h4>
                      <p className="text-[11px] font-bold text-[#134E4A]/80 leading-relaxed">
                        Huruf{" "}
                        <span className="font-black text-[#D97706]">ع</span>{" "}
                        ditulis{" "}
                        <span className="font-black text-[#D97706]">'A</span>{" "}
                        (tengah tenggorokan), sedangkan{" "}
                        <span className="font-black text-[#D97706]">ل / ا</span>{" "}
                        ditulis{" "}
                        <span className="font-black text-[#D97706]">A</span>{" "}
                        (pangkal tenggorokan lepas). Huruf{" "}
                        <span className="font-black text-[#D97706]">ظ</span>{" "}
                        ditulis{" "}
                        <span className="font-black text-[#D97706]">Zho</span>.
                      </p>
                    </div>
                  </div>

                  {/* Grid Cards - Gaya Kartu Putih Sticker */}
                  <div className="grid grid-cols-2 gap-3">
                    {KONSONAN_DATA.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_#134E4A]"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-2xl font-arabic text-[#0D9488] block leading-none mb-1.5 font-bold">
                              {item.arabic}
                            </span>
                            <span className="text-[11px] font-black text-[#134E4A]">
                              {item.latin}
                            </span>
                          </div>
                          {item.highlight && (
                            <span className="bg-[#0D9488] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                              {item.highlight}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-[#134E4A]/60 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* VOKAL TAB */}
              {activeTab === "vokal" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Section 1 */}
                  <div className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-4 shadow-[3px_3px_0px_#134E4A]">
                    <h4 className="text-sm font-black text-[#134E4A] mb-2">
                      Harakat (Fathah, Kasrah, Dhammah)
                    </h4>
                    <p className="text-[11px] font-bold text-[#134E4A]/60 mb-3">
                      Diletakkan di atas (A), bawah (I), dan depan (U) huruf.
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-[#F0FDF4] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بَ = Ba
                      </span>
                      <span className="bg-[#F0FDF4] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بِ = Bi
                      </span>
                      <span className="bg-[#F0FDF4] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بُ = Bu
                      </span>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-4 shadow-[3px_3px_0px_#134E4A]">
                    <span className="bg-[#FF6B6B] text-white border-2 border-[#134E4A] text-[9px] font-black px-2 py-1 rounded-md mb-2 inline-block tracking-wider shadow-[1px_1px_0px_#134E4A]">
                      2 HARAKAT (MAD ASLI)
                    </span>
                    <h4 className="text-sm font-black text-[#134E4A] mb-1">
                      Bacaan Panjang: Aa - Ii - Uu
                    </h4>
                    <p className="text-[11px] font-bold text-[#134E4A]/60 mb-3 leading-relaxed">
                      Ditulis dengan dobel huruf vokal untuk menandakan panjang
                      2 harakat (ketukan santai 2 kali).
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#FEF3C7] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بَا = Baa
                      </span>
                      <span className="bg-[#FEF3C7] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بِيْ = Bii
                      </span>
                      <span className="bg-[#FEF3C7] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بُوْ = Buu
                      </span>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-4 shadow-[3px_3px_0px_#134E4A]">
                    <span className="bg-[#0D9488] text-white border-2 border-[#134E4A] text-[9px] font-black px-2 py-1 rounded-md mb-2 inline-block tracking-wider shadow-[1px_1px_0px_#134E4A]">
                      TANWIN (1 HARAKAT + N)
                    </span>
                    <h4 className="text-sm font-black text-[#134E4A] mb-1">
                      Bunyi Tanwin: -an, -in, -un
                    </h4>
                    <p className="text-[11px] font-bold text-[#134E4A]/60 mb-3 leading-relaxed">
                      Ditulis dengan satu huruf vokal diakhiri huruf{" "}
                      <span className="text-[#0D9488]">n</span>. Tanwin tidak
                      memanjangkan suara.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#F0FDF4] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بًا = Ban
                      </span>
                      <span className="bg-[#F0FDF4] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بٍ = Bin
                      </span>
                      <span className="bg-[#F0FDF4] border-[2px] border-[#134E4A] text-[#134E4A] text-xs font-black px-3 py-1.5 rounded-xl shadow-[1px_1px_0px_#134E4A]">
                        بٌ = Bun
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TIPS TAB */}
              {activeTab === "tips" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {/* Highlight Box - Gaya Sticker Peringatan */}
                  <div className="bg-[#FEF3C7] border-[3px] border-[#134E4A] rounded-2xl p-4 flex gap-3 items-start shadow-[3px_3px_0px_#134E4A]">
                    <div className="text-[#D97706] shrink-0 mt-0.5 bg-white p-1 rounded-full border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                      <Star size={18} className="fill-[#D97706]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#134E4A] mb-1 leading-tight">
                        Alat Bantu, Bukan Pengganti
                      </h4>
                      <p className="text-[11px] font-bold text-[#134E4A]/70 leading-relaxed">
                        Tulisan latin dirancang agar orang tua dan anak yang
                        baru belajar tidak salah menebak bunyi dasar huruf.
                      </p>
                    </div>
                  </div>

                  {/* List Items */}
                  {[
                    {
                      num: 1,
                      title: "Selalu Dengar Audio Asli",
                      desc: "Tekan tombol speaker atau kartu soal untuk mendengarkan pelafalan makhraj asli qari/ustadz yang tepat.",
                    },
                    {
                      num: 2,
                      title: "Iqro 1: Suara Pendek dan Tegas",
                      desc: "Di Iqro 1, seluruh bacaan berharakat fathah dan harus dibaca 1 ketukan lepas (A - Ba, bukan Aaa - Baaa).",
                    },
                    {
                      num: 3,
                      title: "Bedakan Pasangan Huruf Mirip",
                      desc: "Perhatikan perbedaan huruf tipis dan tebal seperti Ta (ت) dengan Tho (ط), serta Tsa (ث) dengan Sa (س).",
                    },
                  ].map((tip) => (
                    <div
                      key={tip.num}
                      className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-4 flex gap-3 items-start shadow-[3px_3px_0px_#134E4A]"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#0D9488] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                        {tip.num}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#134E4A] mb-0.5">
                          {tip.title}
                        </h4>
                        <p className="text-[11px] font-bold text-[#134E4A]/60 leading-relaxed">
                          {tip.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer - Gaya Tombol Aksi */}
            <div className="p-4 border-t-[3px] border-[#134E4A] bg-white">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-[#0D9488] py-3.5 text-sm font-black text-white border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Saya Mengerti!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
