import React from "react";
import { ArrowLeftSvg } from "@/components/ui/CustomIcons";

interface Props {
  jilid: number;
  hal: number;
  dirty: boolean;
  loading: boolean;
  saving: boolean;
  draft: unknown;
  onLeave: (url: string) => void;
  onSwitchPage: (jilid: number, hal: number) => void;
  onSave: () => void;
}

export const TimelineHeader: React.FC<Props> = ({ jilid, hal, dirty, loading, saving, draft, onLeave, onSwitchPage, onSave }) => (
  <header className="te-header">
    <button className="te-btn flex items-center gap-1" onClick={() => onLeave(`/member/ngaji-ceria/cek-audio?jilid=${jilid}&hal=${hal}`)}>
      <ArrowLeftSvg size={14} />
      <span>Cek Audio Manual</span>
    </button>
    <div><h1>Cloud Timeline Editor</h1><p>Jilid {jilid} · Halaman {hal} · {dirty ? "Draft belum disimpan" : "Sesuai hasil tersimpan"}</p></div>
    <div className="te-page-select">
      <select aria-label="Jilid" value={jilid} disabled={saving} onChange={(e) => onSwitchPage(Number(e.target.value), hal)}>
        {[1,2,3,4,5,6].map((v) => <option key={v} value={v}>Jilid {v}</option>)}
      </select>
      <select aria-label="Halaman" value={hal} disabled={saving} onChange={(e) => onSwitchPage(jilid, Number(e.target.value))}>
        {Array.from({ length: 44 }, (_, i) => <option key={i} value={i + 1}>Hal {i + 1}</option>)}
      </select>
    </div>
    <button className="te-btn te-primary" disabled={loading || saving || !draft || !dirty} onClick={onSave}>
      {saving ? "Merender & menyimpan…" : "Simpan Hasil Akhir"}
    </button>
  </header>
);
