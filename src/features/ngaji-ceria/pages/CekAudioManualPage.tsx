import { CekAudioContent } from "./CekAudioContent";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";

export default function CekAudioManualPage() {
  return (
    <NgajiCeriaLayout title="Cek Audio Manual" showBack>
      <CekAudioContent variant="member" />
    </NgajiCeriaLayout>
  );
}
