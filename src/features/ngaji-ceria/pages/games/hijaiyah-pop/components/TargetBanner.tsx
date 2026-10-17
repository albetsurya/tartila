export function TargetBanner({ target, name }: { target: string; name: string }) {
  return <div className="flex items-center justify-center gap-3 rounded-2xl border border-teal-300/30 bg-teal-500/10 px-3 py-2"><span className="text-xs text-teal-100/80">Tap huruf</span><span dir="rtl" className="game-arabic text-3xl text-teal-200">{target}</span><span className="text-xs font-bold text-teal-300">{name}</span></div>;
}
