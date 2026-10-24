import { CekAudioContent } from "@/features/ngaji-ceria/pages/CekAudioContent";

export function AdminAudioCheckPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Cek Audio Manual
        </h1>
        <p className="text-sm admin-muted">
          Audit audio Tilawati: putar per baris, tandai lolos, dan deteksi audio
          hilang (404) atau gagal diputar.
        </p>
      </div>
      <CekAudioContent variant="admin" />
    </div>
  );
}
