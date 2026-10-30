import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { Cards, Lock, Play } from "../../../../components/ui/CustomIcons";
import { TILAWATI_SESSIONS } from "./exploreData";

export default function MagicCardsPage() {
  const navigate = useNavigate();
  const [selectedJilid, setSelectedJilid] = useState<number>(
    TILAWATI_SESSIONS[0].jilid,
  );

  const selected =
    TILAWATI_SESSIONS.find((session) => session.jilid === selectedJilid) ??
    TILAWATI_SESSIONS[0];

  return (
    <NgajiCeriaLayout
      title="Kemah Savana Tilawati"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      {/* Latar Padang Rumput Savana (#FEF3C7) */}
      <div className="relative space-y-6 bg-[#FEF3C7] px-4 py-5 min-h-[100dvh] overflow-x-hidden select-none">
        {/* Bukit Rumput Savana di Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-36 bg-[#15803D] border-t-[4px] border-[#134E4A] z-0"
          style={{
            clipPath:
              "polygon(0% 35%, 30% 10%, 60% 30%, 88% 12%, 100% 25%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Hero Pos Api Unggun Savana */}
        <section className="relative z-10 overflow-hidden rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] p-5 text-[#FEF3C7] shadow-[6px_6px_0px_#451A03]">
          <div className="absolute right-4 top-4 w-12 h-12 rounded-2xl bg-[#FDE68A] border-[3px] border-[#451A03] flex items-center justify-center shadow-[3px_3px_0px_#451A03] rotate-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 7 7 7 12C7 15.3 9.2 18 12 18C14.8 18 17 15.3 17 12C17 9.5 15.5 7.5 14 6C14 8 12.5 9 12.5 9C12.5 6 12 2 12 2Z"
                fill="#EF4444"
                stroke="#451A03"
                strokeWidth="2"
              />
              <path
                d="M4 20L20 17M4 17L20 20"
                stroke="#78350F"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="relative z-10 max-w-[78%]">
            <span className="inline-block rounded-lg bg-[#FEF08A] border-[2px] border-[#451A03] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#451A03] shadow-[2px_2px_0px_#451A03]">
              Ekspedisi Savana
            </span>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-black leading-tight text-[#FEF3C7]">
              Pilih Tenda Kemah Tilawatimu
            </h2>
          </div>
        </section>

        {/* Grid Tenda Kemah Sesi */}
        <section className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-8 pt-2">
          {TILAWATI_SESSIONS.map((session) => {
            const isActive =
              session.unlocked && session.jilid === selectedJilid;
            return (
              <div key={session.jilid} className="relative pt-8">
                {/* Atap Segitiga Tenda Kemah (Clip-Path) */}
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-9 bg-[#451A03] z-20"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <div
                    className={`w-full h-full ${
                      isActive ? "bg-[#15803D]" : "bg-[#D97706]"
                    }`}
                    style={{
                      clipPath: "polygon(50% 15%, 95% 100%, 5% 100%)",
                    }}
                  />
                </div>

                <button
                  type="button"
                  disabled={!session.unlocked}
                  onClick={() => setSelectedJilid(session.jilid)}
                  className={`relative z-10 w-full flex flex-col rounded-b-2xl rounded-t-sm p-4 text-left border-[4px] border-[#451A03] transition-transform cursor-pointer ${
                    !session.unlocked
                      ? "bg-[#E2E8F0] opacity-65 cursor-not-allowed shadow-[3px_3px_0px_#451A03]"
                      : isActive
                        ? "bg-[#DCFCE7] shadow-[5px_5px_0px_#451A03] -translate-y-1"
                        : "bg-[#FFFBEB] shadow-[4px_4px_0px_#451A03] active:scale-[0.98]"
                  }`}
                >
                  <span className="w-10 h-10 rounded-xl bg-[#FEF08A] border-[2.5px] border-[#451A03] flex items-center justify-center shadow-[2px_2px_0px_#451A03]">
                    {session.unlocked ? (
                      <Cards size={20} className="text-[#451A03]" />
                    ) : (
                      <Lock size={20} className="text-[#78350F]" />
                    )}
                  </span>
                  <p className="mt-3 font-display font-black text-sm text-[#451A03]">
                    {session.title}
                  </p>
                  <p className="text-[10px] font-bold text-[#78350F]">
                    {session.desc}
                  </p>
                </button>
              </div>
            );
          })}
        </section>

        {/* Bottom CTA: Papan Panah Kayu Savana */}
        <div className="relative z-10 pt-2">
          <button
            type="button"
            onClick={() =>
              navigate(`/member/ngaji-ceria/explore/tilawati/${selected.jilid}`)
            }
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#15803D] hover:bg-[#166534] border-[4px] border-[#451A03] text-[#FFFFFF] font-black text-sm py-3.5 px-6 shadow-[5px_5px_0px_#451A03] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <Play size={16} />
            Masuki Tenda {selected.title}
          </button>
        </div>

        <div className="h-32" aria-hidden="true" />
      </div>
    </NgajiCeriaLayout>
  );
}
