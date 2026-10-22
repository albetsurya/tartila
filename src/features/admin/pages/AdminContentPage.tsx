import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Info,
  Pencil,
  Plus,
  ScrollText,
  Trash2,
  X,
} from "@/components/ui/CustomIcons";
import {
  deleteMaterial,
  fetchMaterials,
  type AdminMaterial,
  type MaterialStatus,
} from "../services/materialService";
import { Spinner } from "../components/Spinner";

// Fallback data: used when the API is unavailable or returns no rows
// (the backend has no `materials`/`books` master table yet).
const FALLBACK_MATERIALS: AdminMaterial[] = [
  {
    id: "tilawati-jilid-1",
    jilid: 1,
    title: "Tilawati Jilid 1",
    pageCount: 44,
    status: "published",
    lastUpdated: "12 Okt 2025",
  },
  {
    id: "tilawati-jilid-2",
    jilid: 2,
    title: "Tilawati Jilid 2",
    pageCount: 44,
    status: "published",
    lastUpdated: "14 Okt 2025",
  },
  {
    id: "tilawati-jilid-3",
    jilid: 3,
    title: "Tilawati Jilid 3",
    pageCount: 44,
    status: "published",
    lastUpdated: "15 Okt 2025",
  },
  {
    id: "tilawati-jilid-4",
    jilid: 4,
    title: "Tilawati Jilid 4",
    pageCount: 44,
    status: "published",
    lastUpdated: "16 Okt 2025",
  },
  {
    id: "tilawati-jilid-5",
    jilid: 5,
    title: "Tilawati Jilid 5",
    pageCount: 44,
    status: "published",
    lastUpdated: "18 Okt 2025",
  },
  {
    id: "tilawati-jilid-6",
    jilid: 6,
    title: "Tilawati Jilid 6",
    pageCount: 44,
    status: "draft",
    lastUpdated: "19 Okt 2025",
  },
];

const JILID_FILTERS: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "Semua Jilid" },
  ...[1, 2, 3, 4, 5, 6].map((jilid) => ({
    value: jilid,
    label: `Jilid ${jilid}`,
  })),
];

const TIMELINE_EDITOR_PATH = "/member/ngaji-ceria/cek-audio/timeline";

function StatusBadge({ status }: { status: MaterialStatus }) {
  const isPublished = status === "published";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        color: "#ffffff",
        backgroundColor: isPublished
          ? "var(--admin-accent)"
          : "color-mix(in srgb, #71717a 88%, transparent)",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function MaterialCover({ material }: { material: AdminMaterial }) {
  if (material.coverUrl) {
    return (
      <img
        src={material.coverUrl}
        alt={`Cover ${material.title}`}
        className="h-40 w-full object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-40 w-full items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--admin-accent) 92%, #000), color-mix(in srgb, var(--admin-accent) 68%, #000))",
      }}
    >
      <span className="text-3xl font-bold tracking-wide text-white">
        Jilid {material.jilid}
      </span>
    </div>
  );
}

function AddMaterialModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        role="dialog"
        aria-modal="true"
        aria-label="Tambah Materi"
        onClick={(event) => event.stopPropagation()}
        className="admin-surface admin-border w-full max-w-md rounded-lg border p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Tambah Materi</h2>
            <p className="mt-1 text-xs admin-muted">
              Formulir materi baru akan tersedia di sini.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="admin-nav-item rounded-md p-2 transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>

        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-xs admin-muted admin-border">
          {/* TODO: Wire to API once a `materials`/`books` master table exists. */}
          Belum ada tabel master materi di backend. Formulir ini masih berupa
          mockup UI.
        </p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="admin-nav-item rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
          >
            Batal
          </button>
          <button
            type="button"
            disabled
            title="Belum tersedia"
            className="admin-accent-bg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium opacity-60"
          >
            Simpan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function MaterialSkeletonCard() {
  const bar = (className: string) => (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: "var(--admin-skeleton)" }}
    />
  );
  return (
    <div className="admin-surface admin-border overflow-hidden rounded-lg border">
      {bar("h-40 w-full")}
      <div className="space-y-3 p-4">
        {bar("h-4 w-32")}
        {bar("h-3 w-24")}
        {bar("h-8 w-full")}
      </div>
    </div>
  );
}

export function AdminContentPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<AdminMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [jilidFilter, setJilidFilter] = useState<number | "all">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMaterials()
      .then((data) => {
        if (!active) return;
        if (data.length > 0) {
          setMaterials(data);
          setUsingFallback(false);
        } else {
          setMaterials(FALLBACK_MATERIALS);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        // 401 is handled globally by SessionExpiryHandler; other errors
        // (404/500/timeout) fall back to local mock data so the UI stays usable.
        if (!active) return;
        setMaterials(FALLBACK_MATERIALS);
        setUsingFallback(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredMaterials = useMemo(
    () =>
      jilidFilter === "all"
        ? materials
        : materials.filter((material) => material.jilid === jilidFilter),
    [materials, jilidFilter],
  );

  const handleManagePages = (jilid: number) => {
    navigate(`${TIMELINE_EDITOR_PATH}?jilid=${jilid}&hal=1`);
  };

  const handleEditDetail = (_material: AdminMaterial) => {
    // TODO: Wire to API once a `materials`/`books` master table exists.
    // console.log("[AdminContent] edit detail", _material.id);
  };

  const handleDelete = async (material: AdminMaterial) => {
    if (deletingId) return;
    if (!window.confirm(`Hapus materi "${material.title}"?`)) return;
    setDeletingId(material.id);
    try {
      await deleteMaterial(material.id);
      setMaterials((prev) => prev.filter((item) => item.id !== material.id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Materi Tilawati</h1>
          <p className="mt-1 text-sm admin-muted">
            Kelola jilid, halaman, dan aset audio pembelajaran.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="admin-accent-bg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90"
        >
          <Plus size={16} />
          Tambah Materi
        </button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-56">
          <select
            aria-label="Filter jilid"
            value={jilidFilter}
            onChange={(event) =>
              setJilidFilter(
                event.target.value === "all"
                  ? "all"
                  : Number(event.target.value),
              )
            }
            className="admin-surface admin-border w-full appearance-none rounded-lg border py-2 pl-3 pr-9 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--admin-text)" }}
          >
            {JILID_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="admin-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
        <p className="text-xs admin-muted">
          Menampilkan {filteredMaterials.length} dari {materials.length} jilid
        </p>
      </div>

      {usingFallback ? (
        <div
          className="flex items-start gap-2 rounded-lg border border-dashed px-4 py-2 text-xs admin-muted admin-border"
          role="status"
        >
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            Data contoh ditampilkan — API materi belum mengembalikan data.
          </span>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <MaterialSkeletonCard key={index} />
          ))}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="admin-surface admin-border rounded-lg border px-6 py-16 text-center text-sm admin-muted">
          Tidak ada materi untuk filter ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <article
              key={material.id}
              className={`admin-surface admin-border flex min-w-0 flex-col overflow-hidden rounded-lg border transition-all duration-150 hover:-translate-y-1 hover:shadow-md ${
                deletingId === material.id
                  ? "pointer-events-none opacity-40"
                  : ""
              }`}
            >
              <div className="relative">
                <MaterialCover material={material} />
                <span className="absolute right-3 top-3">
                  <StatusBadge status={material.status} />
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="font-semibold">{material.title}</h3>
                  <p className="mt-1 text-xs admin-muted">
                    Jilid {material.jilid} · Tilawati
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs admin-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <ScrollText size={13} />
                    {material.pageCount} Halaman
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} />
                    {material.lastUpdated}
                  </span>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleEditDetail(material)}
                    disabled={Boolean(deletingId)}
                    className="admin-nav-item inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70 admin-border"
                  >
                    <Pencil size={14} />
                    Edit Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManagePages(material.jilid)}
                    disabled={Boolean(deletingId)}
                    className="admin-accent-bg inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <BookOpen size={14} />
                    Kelola Halaman
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(material)}
                    disabled={Boolean(deletingId)}
                    aria-label={`Hapus ${material.title}`}
                    title="Hapus"
                    className="inline-flex items-center justify-center rounded-lg border px-3 py-2 transition-colors duration-150 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70 admin-border"
                    style={{ color: "var(--admin-danger)" }}
                  >
                    {deletingId === material.id ? (
                      <Spinner size={14} />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isAddOpen ? (
        <AddMaterialModal onClose={() => setIsAddOpen(false)} />
      ) : null}
    </div>
  );
}
