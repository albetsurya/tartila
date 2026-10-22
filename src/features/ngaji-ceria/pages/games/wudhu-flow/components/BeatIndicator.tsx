export function BeatIndicator({ progress, bpm, beat }: { progress: number; bpm: number; beat: number }) {
  return (
    <div className="rounded-2xl border-2 border-[#134E4A] bg-[#115E59] p-3 shadow-[2px_2px_0px_#134E4A]">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-teal-200">Ketukan {beat}</span>
        <span className="font-black text-amber-300">{bpm} BPM</span>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full border border-[#134E4A] bg-[#0F3E38]">
        <div
          className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-[#14B8A6]"
          style={{ transform: `translateX(${progress * 200}%)` }}
        />
        <div className="absolute left-1/2 top-[-2px] h-5 w-1.5 -translate-x-1/2 rounded-full border border-[#134E4A] bg-white" />
      </div>
      <p className="mt-2 text-center text-[10px] font-bold text-teal-100">
        Tap saat garis hijau mendekati garis putih
      </p>
    </div>
  );
}
