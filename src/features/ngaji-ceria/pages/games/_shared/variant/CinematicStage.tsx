import { NGAJI_CERIA_ASSETS } from "../../../../data/assets";

export function CinematicStage({
  chapter,
  setting,
  score,
}: {
  chapter: string;
  setting: string;
  score: number;
}) {
  return (
    <div
      aria-label="Panggung cinematic story"
      className="relative overflow-hidden rounded-3xl border-2 border-[#134E4A] bg-[#0A2E28] p-4 shadow-[3px_3px_0px_#134E4A]"
    >
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
            Cinematic Chapter
          </span>
          <span className="text-[10px] text-teal-200 font-bold">Hikmah {score}</span>
        </div>
        <h2 className="mt-2 font-display text-xl font-black text-white">
          {chapter}
        </h2>
        <p className="mt-1 text-xs text-amber-100/70">{setting}</p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <img
            src={NGAJI_CERIA_ASSETS.avatarAnak}
            alt="Santri"
            draggable={false}
            className="h-16 w-16 object-contain"
          />
          <img
            src={NGAJI_CERIA_ASSETS.konfeti}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="h-6 w-6 object-contain"
          />
          <img
            src={NGAJI_CERIA_ASSETS.bukuJuzAmma}
            alt="Kitab"
            draggable={false}
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
