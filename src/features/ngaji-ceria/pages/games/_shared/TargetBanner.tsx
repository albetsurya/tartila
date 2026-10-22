export function TargetBanner({
  target,
  name,
  actionLabel = "Tangkap",
}: {
  target: string;
  name: string;
  actionLabel?: string;
}) {
  return (
    <div className="border-[3px] border-[#134E4A] bg-[#CCFBF1] rounded-2xl shadow-[3px_3px_0px_#134E4A] px-4 py-3 flex items-center justify-center gap-3">
      <span className="text-xs font-black uppercase tracking-wide text-[#134E4A]/70">
        {actionLabel}
      </span>
      <span
        dir="rtl"
        className="game-arabic text-3xl font-black text-[#134E4A]"
      >
        {target}
      </span>
      <span className="text-xs font-bold text-[#134E4A]">{name}</span>
    </div>
  );
}
