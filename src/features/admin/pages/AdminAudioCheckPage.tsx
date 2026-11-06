import { CekAudioContent } from "@/features/ngaji-ceria/pages/CekAudioContent";
import { CARD, PAGE_SUBTITLE, PAGE_TITLE } from "../styles";

export function AdminAudioCheckPage() {
  return (
    <div className="space-y-4 pb-12 font-sans font-bold text-[#134E4A]">
      <div className={`p-5 ${CARD}`}>
        <h1 className={`${PAGE_TITLE} uppercase tracking-tight`}>
          Cek Audio Manual
        </h1>
        <p className={PAGE_SUBTITLE}>
          Audit audio Tilawati: putar per baris, tandai lolos, dan deteksi audio
          hilang (404) atau gagal diputar.
        </p>
      </div>
      <CekAudioContent variant="admin" />
    </div>
  );
}
