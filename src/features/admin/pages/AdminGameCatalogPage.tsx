import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Eye,
  Gamepad,
  LayoutGrid,
  List,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
} from "@/components/ui/CustomIcons";
import {
  ALL_MATERI_POKOK,
  MATERI_LABELS,
  type GameAccessLevel,
  type JilidNumber,
  type MateriPokok,
} from "@/data/learningCatalog";
import {
  filterAdminGames,
  useAdminGameCatalog,
  type AdminGameCatalogEntry,
  type AdminGameFilter,
  type GameCatalogOverride,
} from "../services/gameCatalogAdminService";
import { AppModal } from "@/components/ui/AppModal";

const JILID_OPTIONS: JilidNumber[] = [1, 2, 3, 4, 5];

export function AdminGameCatalogPage() {
  const {
    games,
    stats,
    loading,
    error,
    toggleActive,
    updateGameConfig,
    toggleAccess,
    toggleValidation,
    updateGame,
    resetGame,
    resetAll,
    refresh,
  } = useAdminGameCatalog();

  // Filter State
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [materiFilter, setMateriFilter] = useState<MateriPokok | "all">("all");
  const [jilidFilter, setJilidFilter] = useState<JilidNumber | "all">("all");
  const [accessFilter, setAccessFilter] = useState<GameAccessLevel | "all">("all");
  const [validationFilter, setValidationFilter] = useState<
    "all" | "needs-validation" | "validated"
  >("all");

  // UI State: Default tabel sesuai spesifikasi FASE 2
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [editingGame, setEditingGame] = useState<AdminGameCatalogEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [togglingGameId, setTogglingGameId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3200);
  };

  const handleDisplayTypeChange = async (
    game: AdminGameCatalogEntry,
    displayType: "standalone" | "hub",
  ) => {
    try {
      await updateGameConfig(game.gameId, {
        display_type: displayType,
        parent_hub_id: displayType === "standalone" ? null : game.parentHubId,
      });
      showToast(`Tipe tampilan "${game.title}" diubah ke ${displayType}!`);
    } catch {
      showToast(`Gagal mengubah tipe tampilan "${game.title}".`);
    }
  };

  const handleParentHubChange = async (
    game: AdminGameCatalogEntry,
    parentHubId: string,
  ) => {
    try {
      await updateGameConfig(game.gameId, {
        parent_hub_id: parentHubId || null,
        display_type: parentHubId ? "hub" : "standalone",
      });
      showToast(`Hub untuk "${game.title}" diperbarui!`);
    } catch {
      showToast(`Gagal mengubah hub untuk "${game.title}".`);
    }
  };

  const handleSortOrderChange = async (
    game: AdminGameCatalogEntry,
    sortOrder: number,
  ) => {
    try {
      await updateGameConfig(game.gameId, { sort_order: sortOrder });
      showToast(`Urutan #${sortOrder} untuk "${game.title}" disimpan!`);
    } catch {
      showToast(`Gagal mengubah urutan "${game.title}".`);
    }
  };

  const isFiltered =
    query.trim() !== "" ||
    statusFilter !== "all" ||
    materiFilter !== "all" ||
    jilidFilter !== "all" ||
    accessFilter !== "all" ||
    validationFilter !== "all";

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setMateriFilter("all");
    setJilidFilter("all");
    setAccessFilter("all");
    setValidationFilter("all");
  };

  const filters: AdminGameFilter = useMemo(
    () => ({
      query,
      status: statusFilter,
      materi: materiFilter,
      jilid: jilidFilter,
      access: accessFilter,
      validationStatus: validationFilter,
    }),
    [query, statusFilter, materiFilter, jilidFilter, accessFilter, validationFilter],
  );

  const filteredGames = useMemo(
    () => filterAdminGames(games, filters),
    [games, filters],
  );

  const handleToggleActive = async (game: AdminGameCatalogEntry) => {
    try {
      setTogglingGameId(game.gameId);
      const willBeActive = !game.isActive;
      await toggleActive(game.gameId);
      showToast(
        willBeActive
          ? `Game "${game.title}" berhasil diaktifkan kembali!`
          : `Game "${game.title}" dinonaktifkan (mode pemeliharaan).`,
      );
    } catch (err: any) {
      showToast(
        `Gagal mengubah status ${game.title}: ${err?.message || "Koneksi backend gagal"}`,
      );
    } finally {
      setTogglingGameId(null);
    }
  };

  const handleToggleAccess = (game: AdminGameCatalogEntry) => {
    toggleAccess(game.gameId);
    const nextText =
      game.access === "guest-open"
        ? "diubah menjadi Khusus Member"
        : "dibuka untuk Tamu (Guest Open)";
    showToast(`Akses ${game.title} ${nextText}!`);
  };

  const handleToggleValidation = (game: AdminGameCatalogEntry) => {
    toggleValidation(game.gameId);
    const nextText = game.needsContentValidation
      ? "disetujui sebagai Tervalidasi"
      : "ditandai sebagai Perlu Validasi";
    showToast(`Status ${game.title} ${nextText}!`);
  };

  const handleResetSingle = (game: AdminGameCatalogEntry) => {
    if (
      window.confirm(
        `Kembalikan metadata game "${game.title}" ke nilai bawaan kurikulum?`,
      )
    ) {
      resetGame(game.gameId);
      showToast(`Metadata ${game.title} dikembalikan ke default!`);
    }
  };

  const handleSaveModal = (updatedData: Partial<GameCatalogOverride>) => {
    if (!editingGame) return;
    updateGame(editingGame.gameId, updatedData);
    setEditingGame(null);
    showToast(`Perubahan metadata "${editingGame.title}" berhasil disimpan!`);
  };

  const handleConfirmResetAll = () => {
    resetAll();
    setConfirmResetAll(false);
    showToast("Seluruh konfigurasi katalog game dikembalikan ke bawaan!");
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-[#059669] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-950/20 animate-in fade-in slide-in-from-top-4"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <Check size={14} />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Katalog Game</h1>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Shield size={12} />
              Superadmin Only
            </span>
            {stats.overriddenCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Sparkles size={12} />
                {stats.overriddenCount} Kustomisasi Aktif
              </span>
            )}
          </div>
          <p className="mt-1 text-sm admin-muted">
            Kelola hak akses santri (tamu publik vs member), pemetaan kurikulum
            Tilawati, dan validasi narasi edukasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refresh();
              showToast("Sinkronisasi status game dari server...");
            }}
            disabled={loading}
            className="admin-surface admin-border inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--admin-accent-soft)]"
            title="Muat ulang konfigurasi dari backend Go"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sinkron Server
          </button>

          {stats.overriddenCount > 0 && (
            <button
              type="button"
              onClick={() => setConfirmResetAll(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
            >
              <RefreshCw size={14} />
              Reset Semua Kustomisasi
            </button>
          )}

          <a
            href="/member/ngaji-ceria/games"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-surface admin-border inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--admin-accent-soft)]"
          >
            <Eye size={14} />
            Buka Portal Santri
          </a>
        </div>
      </header>

      {/* Baris Statistik Ringkas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Game */}
        <div className="admin-surface admin-border rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium admin-muted">Total Game</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
              <Gamepad size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums">{stats.total}</p>
          <p className="mt-0.5 text-xs admin-muted">Tersedia di katalog</p>
        </div>

        {/* Game Aktif (Live di Santri) */}
        <div className="admin-surface admin-border rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium admin-muted">Game Aktif</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
            {stats.activeCount}
          </p>
          <p className="mt-0.5 text-xs admin-muted">Bisa dimainkan santri</p>
        </div>

        {/* Game Non-aktif (Pemeliharaan) */}
        <div className="admin-surface admin-border rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium admin-muted">Pemeliharaan</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
            {stats.inactiveCount}
          </p>
          <p className="mt-0.5 text-xs admin-muted">Status non-aktif santri</p>
        </div>

        {/* Akses Tamu Publik */}
        <div className="admin-surface admin-border rounded-xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium admin-muted">Akses Tamu</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Users size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-teal-600 tabular-nums dark:text-teal-400">
            {stats.guestOpen}
          </p>
          <p className="mt-0.5 text-xs admin-muted">Terbuka tanpa login</p>
        </div>
      </div>

      {/* Control Bar: Pencarian, Filter & Mode Tampilan */}
      <section className="admin-surface admin-border space-y-3 rounded-xl border p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Kolom Pencarian */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="admin-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, gameId, materi pokok, atau instruksi..."
              className="admin-surface admin-border w-full rounded-lg border py-2 pl-9 pr-8 text-sm transition-colors focus:border-emerald-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="admin-muted absolute right-2.5 top-1/2 -translate-y-1/2 hover:text-red-500"
                aria-label="Hapus kata kunci pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mode Tampilan (Grid / Table) */}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--admin-border)] p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--admin-accent)] text-white shadow-xs"
                  : "admin-muted hover:text-[var(--admin-text)]"
              }`}
            >
              <LayoutGrid size={14} />
              Kartu
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-[var(--admin-accent)] text-white shadow-xs"
                  : "admin-muted hover:text-[var(--admin-text)]"
              }`}
            >
              <List size={14} />
              Tabel
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {/* Filter Status Aktif */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "active" | "inactive",
                )
              }
              aria-label="Filter status aktif game"
              className="admin-surface admin-border w-full appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-xs transition-colors focus:border-emerald-500 focus:outline-none font-medium"
            >
              <option value="all">Semua Status Game</option>
              <option value="active">Game Aktif ({stats.activeCount})</option>
              <option value="inactive">Pemeliharaan ({stats.inactiveCount})</option>
            </select>
            <ChevronDown
              size={13}
              className="admin-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Filter Materi */}
          <div className="relative">
            <select
              value={materiFilter}
              onChange={(e) =>
                setMateriFilter(e.target.value as MateriPokok | "all")
              }
              aria-label="Filter materi pokok"
              className="admin-surface admin-border w-full appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-xs transition-colors focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Materi ({ALL_MATERI_POKOK.length})</option>
              {ALL_MATERI_POKOK.map((m) => (
                <option key={m} value={m}>
                  {MATERI_LABELS[m]}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="admin-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Filter Jilid */}
          <div className="relative">
            <select
              value={jilidFilter}
              onChange={(e) =>
                setJilidFilter(
                  e.target.value === "all"
                    ? "all"
                    : (Number(e.target.value) as JilidNumber),
                )
              }
              aria-label="Filter jilid Tilawati"
              className="admin-surface admin-border w-full appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-xs transition-colors focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Jilid (1–5)</option>
              {JILID_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  Jilid {j}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="admin-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Filter Akses */}
          <div className="relative">
            <select
              value={accessFilter}
              onChange={(e) =>
                setAccessFilter(e.target.value as GameAccessLevel | "all")
              }
              aria-label="Filter hak akses game"
              className="admin-surface admin-border w-full appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-xs transition-colors focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Akses</option>
              <option value="guest-open">Akses Tamu (Publik)</option>
              <option value="member-only">Khusus Member</option>
            </select>
            <ChevronDown
              size={13}
              className="admin-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Filter Validasi */}
          <div className="relative">
            <select
              value={validationFilter}
              onChange={(e) =>
                setValidationFilter(
                  e.target.value as "all" | "needs-validation" | "validated",
                )
              }
              aria-label="Filter status validasi kurikulum"
              className="admin-surface admin-border w-full appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-xs transition-colors focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Validasi</option>
              <option value="needs-validation">Perlu Validasi (Draf)</option>
              <option value="validated">Tervalidasi Resmi</option>
            </select>
            <ChevronDown
              size={13}
              className="admin-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* Info Hasil & Reset Filter */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="admin-muted">
            Menampilkan{" "}
            <strong className="text-[var(--admin-text)] font-semibold">
              {filteredGames.length}
            </strong>{" "}
            dari {games.length} game
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <X size={12} />
              Reset Semua Filter
            </button>
          )}
        </div>
      </section>

      {/* Konten Utama: Daftar Game */}
      {filteredGames.length === 0 ? (
        <div className="admin-surface admin-border rounded-xl border py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
            <Gamepad size={24} />
          </div>
          <h3 className="mt-3 text-base font-semibold">Tidak ada game ditemukan</h3>
          <p className="mt-1 text-sm admin-muted">
            Coba sesuaikan kata kunci atau bersihkan pilihan filter di atas.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="admin-accent-bg mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
          >
            Bersihkan Filter
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Tampilan Kartu */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCardItem
              key={game.gameId}
              game={game}
              isToggling={togglingGameId === game.gameId}
              onToggleActive={() => handleToggleActive(game)}
              onDisplayTypeChange={(dt) => handleDisplayTypeChange(game, dt)}
              onParentHubChange={(hub) => handleParentHubChange(game, hub)}
              onSortOrderChange={(ord) => handleSortOrderChange(game, ord)}
              onToggleAccess={() => handleToggleAccess(game)}
              onToggleValidation={() => handleToggleValidation(game)}
              onEdit={() => setEditingGame(game)}
              onReset={() => handleResetSingle(game)}
            />
          ))}
        </div>
      ) : (
        /* Tabel Tampilan List CMS Game Dinamis */
        <div className="admin-surface admin-border overflow-hidden rounded-xl border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead>
                <tr className="admin-border border-b text-xs uppercase tracking-wider admin-muted bg-[var(--admin-accent-soft)]/30">
                  <th className="px-5 py-3 font-semibold">Game</th>
                  <th className="px-4 py-3 font-semibold">Status (Tampil)</th>
                  <th className="px-4 py-3 font-semibold">Tipe Tampilan</th>
                  <th className="px-4 py-3 font-semibold">Pilih Hub</th>
                  <th className="px-4 py-3 font-semibold text-center">Urutan</th>
                  <th className="px-4 py-3 font-semibold">Akses</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {filteredGames.map((game) => (
                  <GameTableRow
                    key={game.gameId}
                    game={game}
                    isToggling={togglingGameId === game.gameId}
                    onToggleActive={() => handleToggleActive(game)}
                    onDisplayTypeChange={(dt) => handleDisplayTypeChange(game, dt)}
                    onParentHubChange={(hub) => handleParentHubChange(game, hub)}
                    onSortOrderChange={(ord) => handleSortOrderChange(game, ord)}
                    onToggleAccess={() => handleToggleAccess(game)}
                    onToggleValidation={() => handleToggleValidation(game)}
                    onEdit={() => setEditingGame(game)}
                    onReset={() => handleResetSingle(game)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit Metadata Game */}
      {editingGame && (
        <EditGameModal
          game={editingGame}
          onClose={() => setEditingGame(null)}
          onSave={handleSaveModal}
          onResetDefault={() => {
            resetGame(editingGame.gameId);
            setEditingGame(null);
            showToast(
              `Metadata ${editingGame.title} dikembalikan ke nilai bawaan!`,
            );
          }}
        />
      )}

      {/* Modal Konfirmasi Reset Semua */}
      <AppModal
        isOpen={confirmResetAll}
        onClose={() => setConfirmResetAll(false)}
        title="Reset Seluruh Kustomisasi Game?"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
          <RefreshCw size={24} />
        </div>
        <p className="mt-2 text-sm admin-muted">
          Tindakan ini akan mengembalikan semua hak akses tamu, status
          validasi, dan deskripsi tujuan pembelajaran {stats.overriddenCount}{" "}
          game yang telah diubah ke konfigurasi bawaan sistem.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmResetAll(false)}
            className="admin-surface admin-border rounded-lg border px-4 py-2 text-sm font-medium hover:bg-[var(--admin-accent-soft)]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmResetAll}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Ya, Reset Semua
          </button>
        </div>
      </AppModal>
    </div>
  );
}

// ── KOMPONEN KARTU GAME ──────────────────────────────────────────

interface GameItemProps {
  game: AdminGameCatalogEntry;
  isToggling?: boolean;
  onToggleActive: () => void;
  onDisplayTypeChange: (displayType: "standalone" | "hub") => void;
  onParentHubChange: (parentHubId: string) => void;
  onSortOrderChange: (sortOrder: number) => void;
  onToggleAccess: () => void;
  onToggleValidation: () => void;
  onEdit: () => void;
  onReset: () => void;
}

function GameCardItem({
  game,
  isToggling,
  onToggleActive,
  onDisplayTypeChange,
  onParentHubChange,
  onSortOrderChange,
  onToggleAccess,
  onToggleValidation,
  onEdit,
  onReset,
}: GameItemProps) {
  const isGuestOpen = game.access === "guest-open";

  return (
    <article className="admin-surface admin-border group flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-150 hover:border-emerald-500/40 hover:shadow-md">
      {/* Header Kartu */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-bold text-[var(--admin-text)]">
                {game.title}
              </h3>
              {game.isOverridden && (
                <span
                  title="Game ini memiliki perubahan yang disimpan superadmin"
                  className="shrink-0 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400"
                >
                  Disesuaikan
                </span>
              )}
            </div>
            <p className="mt-0.5 font-mono text-[11px] admin-muted">
              id: {game.gameId}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {game.isOverridden && (
              <button
                type="button"
                onClick={onReset}
                title="Kembalikan ke default"
                className="admin-muted rounded-md p-1.5 hover:bg-red-500/10 hover:text-red-500"
              >
                <RefreshCw size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={onEdit}
              title="Edit metadata lengkap"
              className="admin-muted rounded-md p-1.5 hover:bg-[var(--admin-accent-soft)] hover:text-[var(--admin-accent)]"
            >
              <Pencil size={14} />
            </button>
          </div>
        </div>

        {/* Switch Status Aktif (Go Backend DB Integration) */}
        <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--admin-border)] bg-zinc-50/80 p-2.5 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                game.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <div>
              <span className="text-xs font-bold text-[var(--admin-text)]">
                {game.isActive ? "Status: Aktif" : "Status: Non-aktif"}
              </span>
              <p className="text-[10px] admin-muted">
                {game.isActive ? "Bisa dimainkan santri" : "Dalam pemeliharaan"}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={game.isActive}
            disabled={isToggling}
            onClick={onToggleActive}
            title={
              game.isActive
                ? "Klik untuk menonaktifkan game (mode pemeliharaan)"
                : "Klik untuk mengaktifkan game"
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              game.isActive ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-600"
            } ${isToggling ? "opacity-50 cursor-wait" : ""}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                game.isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Badges Status Akses & Validasi */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleAccess}
            title="Klik untuk ubah hak akses cepat"
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
              isGuestOpen
                ? "bg-teal-500/15 text-teal-700 hover:bg-teal-500/25 dark:text-teal-300"
                : "bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 dark:text-indigo-300"
            }`}
          >
            {isGuestOpen ? <Users size={12} /> : <Lock size={12} />}
            {isGuestOpen ? "Tamu Publik" : "Khusus Member"}
          </button>

          <button
            type="button"
            onClick={onToggleValidation}
            title="Klik untuk ubah status validasi kurikulum"
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
              game.needsContentValidation
                ? "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-300"
                : "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                game.needsContentValidation ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            {game.needsContentValidation ? "Perlu Validasi" : "Tervalidasi"}
          </button>
        </div>

        {/* Tujuan Pembelajaran */}
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--admin-text)]/90">
          {game.learningObjective}
        </p>

        {/* Tag Kurikulum: Materi & Jilid */}
        <div className="mt-3.5 space-y-1.5 border-t border-[var(--admin-border)] pt-2.5">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-medium uppercase admin-muted mr-1">
              Materi:
            </span>
            {game.materiPokok.map((m) => (
              <span
                key={m}
                className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {MATERI_LABELS[m] || m}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-medium uppercase admin-muted mr-1">
              Jilid:
            </span>
            {game.jilidRelevan.length > 0 ? (
              game.jilidRelevan.map((j) => (
                <span
                  key={j}
                  className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  Jilid {j}
                </span>
              ))
            ) : (
              <span className="text-[10px] admin-muted italic">
                Semua jenjang
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Kartu & Tombol Aksi */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--admin-border)] pt-3">
        <a
          href={`/member/ngaji-ceria/games/${game.gameId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline dark:text-emerald-400"
        >
          <Gamepad size={13} />
          Mainkan Game
        </a>

        <button
          type="button"
          onClick={onEdit}
          className="admin-surface admin-border rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[var(--admin-accent-soft)]"
        >
          Edit Detail
        </button>
      </div>
    </article>
  );
}

// ── KOMPONEN BARIS TABEL GAME ────────────────────────────────────

function GameTableRow({
  game,
  isToggling,
  onToggleActive,
  onDisplayTypeChange,
  onParentHubChange,
  onSortOrderChange,
  onToggleAccess,
  onToggleValidation,
  onEdit,
  onReset,
}: GameItemProps) {
  const isGuestOpen = game.access === "guest-open";

  return (
    <tr className="transition-colors hover:bg-[var(--admin-accent-soft)]/50">
      {/* Kolom Game */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--admin-text)]">
                {game.title}
              </span>
              {game.isOverridden && (
                <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                  Custom
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs admin-muted">{game.gameId}</span>
              <span className="text-[10px] admin-muted">•</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {game.materiPokok.map((m) => MATERI_LABELS[m] || m).join(", ")}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Kolom Status Game (Toggle Tampilkan / Sembunyikan) */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={game.isActive}
            disabled={isToggling}
            onClick={onToggleActive}
            title={game.isActive ? "Klik untuk sembunyikan game" : "Klik untuk tampilkan game"}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              game.isActive ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-600"
            } ${isToggling ? "opacity-50 cursor-wait" : ""}`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                game.isActive ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-xs font-semibold ${
              game.isActive
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-zinc-500"
            }`}
          >
            {game.isActive ? "Tampil" : "Sembunyi"}
          </span>
        </div>
      </td>

      {/* Kolom Tipe Tampilan (Dropdown Standalone / Hub) */}
      <td className="px-4 py-3.5">
        <select
          value={game.displayType || "standalone"}
          onChange={(e) => onDisplayTypeChange(e.target.value as "standalone" | "hub")}
          aria-label={`Tipe tampilan ${game.title}`}
          className="admin-surface admin-border rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors focus:border-emerald-500 focus:outline-none"
        >
          <option value="standalone">Standalone</option>
          <option value="hub">Hub</option>
        </select>
      </td>

      {/* Kolom Pilih Hub (Dropdown Hub jika Tipe = Hub) */}
      <td className="px-4 py-3.5">
        <select
          disabled={game.displayType !== "hub"}
          value={game.parentHubId || ""}
          onChange={(e) => onParentHubChange(e.target.value)}
          aria-label={`Pilih hub untuk ${game.title}`}
          className={`admin-surface admin-border rounded-lg border px-2 py-1 text-xs font-medium transition-colors focus:border-emerald-500 focus:outline-none ${
            game.displayType !== "hub"
              ? "opacity-30 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800"
              : "text-[var(--admin-text)]"
          }`}
        >
          <option value="">-- Tanpa Hub --</option>
          <option value="ritme-ngaji">Ritme Ngaji</option>
          <option value="quiz-ngaji">Quiz Ngaji</option>
          <option value="puzzle-huruf">Puzzle Huruf</option>
          <option value="tajwid-lab">Tajwid Lab</option>
          <option value="petualangan-santri">Petualangan Santri</option>
        </select>
      </td>

      {/* Kolom Urutan (Sort Order) */}
      <td className="px-4 py-3.5 text-center">
        <input
          type="number"
          min={0}
          max={99}
          value={game.sortOrder ?? 0}
          onChange={(e) => onSortOrderChange(Number(e.target.value))}
          aria-label={`Urutan tampil ${game.title}`}
          className="admin-surface admin-border w-14 rounded-lg border py-1 text-center text-xs font-bold transition-colors focus:border-emerald-500 focus:outline-none"
        />
      </td>

      {/* Kolom Akses */}
      <td className="px-4 py-3.5">
        <button
          type="button"
          onClick={onToggleAccess}
          title="Klik untuk ubah cepat"
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isGuestOpen
              ? "bg-teal-500/15 text-teal-700 hover:bg-teal-500/25 dark:text-teal-300"
              : "bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 dark:text-indigo-300"
          }`}
        >
          {isGuestOpen ? <Users size={11} /> : <Lock size={11} />}
          {isGuestOpen ? "Tamu" : "Member"}
        </button>
      </td>

      {/* Kolom Validasi */}
      <td className="px-4 py-3.5">
        <button
          type="button"
          onClick={onToggleValidation}
          title="Klik untuk ubah status validasi"
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            game.needsContentValidation
              ? "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-300"
              : "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              game.needsContentValidation ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
          {game.needsContentValidation ? "Draf" : "Valid"}
        </button>
      </td>

      {/* Kolom Aksi */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <a
            href={`/member/ngaji-ceria/games/${game.gameId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Mainkan game"
            className="admin-muted rounded-md p-1.5 hover:bg-[var(--admin-accent-soft)] hover:text-[var(--admin-accent)]"
          >
            <Gamepad size={14} />
          </a>
          <button
            type="button"
            onClick={onEdit}
            title="Edit metadata"
            className="admin-muted rounded-md p-1.5 hover:bg-[var(--admin-accent-soft)] hover:text-[var(--admin-accent)]"
          >
            <Pencil size={14} />
          </button>
          {game.isOverridden && (
            <button
              type="button"
              onClick={onReset}
              title="Kembalikan ke default"
              className="admin-muted rounded-md p-1.5 hover:bg-red-500/10 hover:text-red-500"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── MODAL EDIT METADATA GAME ─────────────────────────────────────

interface EditGameModalProps {
  game: AdminGameCatalogEntry;
  onClose: () => void;
  onSave: (data: Partial<GameCatalogOverride>) => void;
  onResetDefault: () => void;
}

function EditGameModal({
  game,
  onClose,
  onSave,
  onResetDefault,
}: EditGameModalProps) {
  const [title, setTitle] = useState(game.title);
  const [access, setAccess] = useState<GameAccessLevel>(game.access);
  const [needsContentValidation, setNeedsContentValidation] = useState(
    game.needsContentValidation,
  );
  const [learningObjective, setLearningObjective] = useState(
    game.learningObjective,
  );
  const [caraMain, setCaraMain] = useState(game.caraMain);
  const [tipsUstadz, setTipsUstadz] = useState<string[]>([...game.tipsUstadz]);
  const [materiPokok, setMateriPokok] = useState<MateriPokok[]>([
    ...game.materiPokok,
  ]);
  const [jilidRelevan, setJilidRelevan] = useState<JilidNumber[]>([
    ...game.jilidRelevan,
  ]);

  const handleToggleMateri = (m: MateriPokok) => {
    setMateriPokok((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m],
    );
  };

  const handleToggleJilid = (j: JilidNumber) => {
    setJilidRelevan((prev) =>
      prev.includes(j) ? prev.filter((item) => item !== j) : [...prev, j].sort(),
    );
  };

  const handleAddTip = () => {
    setTipsUstadz((prev) => [...prev, ""]);
  };

  const handleUpdateTip = (index: number, val: string) => {
    setTipsUstadz((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveTip = (index: number) => {
    setTipsUstadz((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      access,
      needsContentValidation,
      learningObjective: learningObjective.trim(),
      caraMain: caraMain.trim(),
      tipsUstadz: tipsUstadz.map((t) => t.trim()).filter(Boolean),
      materiPokok,
      jilidRelevan,
    });
  };

  return (
    <AppModal isOpen={true} onClose={onClose} title="Edit Metadata Game">
      <p className="font-mono text-xs admin-muted">id: {game.gameId}</p>

      <form
        id="edit-game-form"
        onSubmit={handleSubmit}
        className="admin-scroll mt-4 space-y-5 text-sm"
      >
        {/* Judul Game */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
            Judul Game
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="admin-surface admin-border mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Tingkat Akses (Radio Cards) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
            Hak Akses Santri
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                access === "guest-open"
                  ? "border-teal-500 bg-teal-500/10 font-semibold"
                  : "admin-border admin-surface hover:bg-[var(--admin-accent-soft)]"
              }`}
            >
              <input
                type="radio"
                name="access"
                value="guest-open"
                checked={access === "guest-open"}
                onChange={() => setAccess("guest-open")}
                className="mt-0.5 text-teal-600 focus:ring-teal-500"
              />
              <div>
                <span className="block text-xs font-bold text-teal-700 dark:text-teal-300">
                  Terbuka untuk Tamu (Guest Open)
                </span>
                <span className="mt-0.5 block text-[11px] admin-muted">
                  Dapat dimainkan santri tanpa perlu login akun.
                </span>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                access === "member-only"
                  ? "border-indigo-500 bg-indigo-500/10 font-semibold"
                  : "admin-border admin-surface hover:bg-[var(--admin-accent-soft)]"
              }`}
            >
              <input
                type="radio"
                name="access"
                value="member-only"
                checked={access === "member-only"}
                onChange={() => setAccess("member-only")}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="block text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  Khusus Member (Wajib Login)
                </span>
                <span className="mt-0.5 block text-[11px] admin-muted">
                  Santri harus masuk akun terlebih dahulu.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Status Validasi Konten */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
            Status Validasi Kurikulum
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                !needsContentValidation
                  ? "border-emerald-500 bg-emerald-500/10 font-semibold"
                  : "admin-border admin-surface hover:bg-[var(--admin-accent-soft)]"
              }`}
            >
              <input
                type="radio"
                name="validation"
                checked={!needsContentValidation}
                onChange={() => setNeedsContentValidation(false)}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Tervalidasi Resmi
                </span>
                <span className="mt-0.5 block text-[11px] admin-muted">
                  Konten dan materi sudah diverifikasi tim ustadz/kurikulum.
                </span>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                needsContentValidation
                  ? "border-amber-500 bg-amber-500/10 font-semibold"
                  : "admin-border admin-surface hover:bg-[var(--admin-accent-soft)]"
              }`}
            >
              <input
                type="radio"
                name="validation"
                checked={needsContentValidation}
                onChange={() => setNeedsContentValidation(true)}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="block text-xs font-bold text-amber-700 dark:text-amber-300">
                  Perlu Validasi (Draf)
                </span>
                <span className="mt-0.5 block text-[11px] admin-muted">
                  Perlu peninjauan ulang keselarasan tajwid/makhraj.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Materi Pokok Tags Checkbox */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
            Materi Pokok Terkait
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ALL_MATERI_POKOK.map((m) => {
              const checked = materiPokok.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleToggleMateri(m)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    checked
                      ? "bg-[var(--admin-accent)] text-white shadow-xs"
                      : "admin-surface admin-border border admin-muted hover:border-[var(--admin-accent)]"
                  }`}
                >
                  {MATERI_LABELS[m]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jilid Relevan */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
            Jilid Tilawati Relevan
          </label>
          <div className="mt-2 flex items-center gap-2">
            {JILID_OPTIONS.map((j) => {
              const checked = jilidRelevan.includes(j);
              return (
                <button
                  key={j}
                  type="button"
                  onClick={() => handleToggleJilid(j)}
                  className={`flex h-8 w-16 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    checked
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "admin-surface admin-border border admin-muted hover:border-emerald-500"
                  }`}
                >
                  Jilid {j}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tujuan Pembelajaran */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
            Tujuan Pembelajaran
          </label>
          <textarea
            rows={2}
            required
            value={learningObjective}
            onChange={(e) => setLearningObjective(e.target.value)}
            className="admin-surface admin-border mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Cara Bermain */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
            Instruksi / Cara Main
          </label>
          <textarea
            rows={3}
            required
            value={caraMain}
            onChange={(e) => setCaraMain(e.target.value)}
            className="admin-surface admin-border mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Tips Ustadz */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider admin-muted">
              Tips Ustadz ({tipsUstadz.length})
            </label>
            <button
              type="button"
              onClick={handleAddTip}
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <Plus size={13} />
              Tambah Tips
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {tipsUstadz.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => handleUpdateTip(idx, e.target.value)}
                  placeholder={`Tips #${idx + 1}`}
                  className="admin-surface admin-border flex-1 rounded-lg border px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTip(idx)}
                  className="admin-muted p-1 hover:text-red-500"
                  title="Hapus tip"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Footer Modal */}
      <div className="mt-6 flex items-center justify-between">
        {game.isOverridden ? (
          <button
            type="button"
            onClick={onResetDefault}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
          >
            <RefreshCw size={13} />
            Kembalikan ke Default
          </button>
        ) : (
          <span className="text-xs admin-muted">Konfigurasi bawaan</span>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="admin-surface admin-border rounded-lg border px-4 py-2 text-xs font-semibold hover:bg-[var(--admin-accent-soft)]"
          >
            Batal
          </button>
          <button
            type="submit"
            form="edit-game-form"
            className="admin-accent-bg rounded-lg px-4 py-2 text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </AppModal>
  );
}

export default AdminGameCatalogPage;
