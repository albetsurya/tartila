import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  Cards,
  Lock,
  Play,
} from "../../../../components/ui/FontAwesomeIcons";
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
      title="Kartu Ajaib Ngaji"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="space-y-5 bg-[#F0FDF4] px-4 py-4 min-h-full rounded-t-3xl">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-[#134E4A] p-5 text-white shadow-md">
          <div className="absolute -right-8 -top-8 h-28 w-28 rotate-12 rounded-3xl bg-[#0D9488]/30" />
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
              Latihan
            </span>
            <h2 className="mt-1 font-display text-xl font-black leading-tight">
              Pilih kartu ajaibmu
            </h2>
          </div>
        </section>

        {/* Session Grid */}
        <section className="grid grid-cols-2 gap-3">
          {TILAWATI_SESSIONS.map((session) => {
            const isActive = session.unlocked && session.jilid === selectedJilid;
            return (
              <button
                key={session.jilid}
                type="button"
                disabled={!session.unlocked}
                onClick={() => setSelectedJilid(session.jilid)}
                className={`flex flex-col rounded-3xl p-4 text-left shadow-sm transition-transform ${
                  !session.unlocked
                    ? "bg-white opacity-50 border border-gray-100 cursor-not-allowed"
                    : isActive
                      ? "bg-[#F0FDF4] border-2 border-[#0D9488] active:scale-[0.98]"
                      : "bg-white border border-gray-100 active:scale-[0.98]"
                }`}
              >
                <span className="w-10 h-10 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center">
                  {session.unlocked ? (
                    <Cards size={20} className="text-[#0D9488]" />
                  ) : (
                    <Lock size={20} className="text-[#134E4A]/50" />
                  )}
                </span>
                <p className="mt-3 font-display font-black text-sm text-[#134E4A]">
                  {session.title}
                </p>
                <p className="text-[10px] font-bold text-[#134E4A]/50">
                  {session.desc}
                </p>
              </button>
            );
          })}
        </section>

        {/* Bottom CTA */}
        <button
          type="button"
          onClick={() =>
            navigate(`/member/ngaji-ceria/quiz?jilid=${selected.jilid}`)
          }
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0f766e] text-white font-bold text-sm py-3 px-6 shadow-sm active:scale-[0.99] transition-all"
        >
          <Play size={16} />
          Mulai Sesi {selected.title}
        </button>

        <div className="h-32" aria-hidden="true" />
      </div>
    </NgajiCeriaLayout>
  );
}
