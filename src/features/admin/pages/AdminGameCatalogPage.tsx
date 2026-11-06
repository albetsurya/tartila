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
import {
  BADGE_NEUTRAL,
  BADGE_SUCCESS,
  BADGE_WARNING,
  BTN_BASE,
  BTN_DANGER,
  BTN_DANGER_COLOR,
  BTN_ICON_XS,
  BTN_PRIMARY,
  BTN_PRIMARY_SM,
  BTN_SECONDARY,
  BTN_SECONDARY_COLOR,
  BTN_SECONDARY_SM,
  BTN_SM,
  CARD,
  CHIP_ACTIVE,
  CHIP_IDLE,
  ICON_BOX,
  INPUT,
  INPUT_ICON,
  INPUT_NUM,
  INPUT_SM,
  LABEL,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SELECT_SM,
  TABLE_WRAP,
  TH,
  TOAST,
  TR,
} from "../styles";

/** Pil badge yang bisa diklik (akses / validasi). */
const BADGE_BTN = "cursor-pointer transition-all hover:brightness-95";
/** Tombol ikon kecil tanpa shadow berat, dipakai di kartu & baris tabel. */
const MINI_ICON_BTN = `${BTN_BASE} ${BTN_ICON_XS} ${BTN_SECONDARY_COLOR}`;
const MINI_ICON_DANGER = `${BTN_BASE} ${BTN_ICON_XS} ${BTN_DANGER_COLOR}`;
/** Toggle switch: border tebal, Teal saat aktif. */
const SWITCH_BASE =
  "relative inline-flex shrink-0 cursor-pointer rounded-full border-[2.5px] border-[#134E4A] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#0D9488]/30";

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
    <div className="space-y-6 pb-12 font-sans font-bold text-[#134E4A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={TOAST}
        >
          <Check size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman */}
      <header className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${CARD}`}>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className={PAGE_TITLE}>Katalog Game</h1>
            <span className={BADGE_SUCCESS}>
              <Shield size={12} />
              Superadmin Only
            </span>
            {stats.overriddenCount > 0 && (
              <span className={BADGE_WARNING}>
                <Sparkles size={12} />
                {stats.overriddenCount} Kustomisasi Aktif
              </span>
            )}
          </div>
          <p className={PAGE_SUBTITLE}>
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
            className={BTN_SECONDARY_SM}
            title="Muat ulang konfigurasi dari backend Go"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sinkron Server
          </button>

          {stats.overriddenCount > 0 && (
            <button
              type="button"
              onClick={() => setConfirmResetAll(true)}
              className={`${BTN_BASE} ${BTN_SM} ${BTN_DANGER_COLOR}`}
            >
              <RefreshCw size={14} />
              Reset Semua Kustomisasi
            </button>
          )}

          <a
            href="/member/ngaji-ceria/games"
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_SECONDARY_SM}
          >
            <Eye size={14} />
            Buka Portal Santri
          </a>
        </div>
      </header>

      {/* Baris Statistik Ringkas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Game */}
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#134E4A]/70">Total Game</span>
            <span className={`h-8 w-8 bg-[#F0FDF4] text-[#134E4A] ${ICON_BOX}`}>
              <Gamepad size={16} />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl font-black tabular-nums text-[#134E4A]">{stats.total}</p>
          <p className="mt-0.5 text-xs font-bold text-[#134E4A]/60">Tersedia di katalog</p>
        </div>

        {/* Game Aktif (Live di Santri) */}
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#134E4A]/70">Game Aktif</span>
            <span className={`h-8 w-8 bg-[#99F6E4] text-[#134E4A] ${ICON_BOX}`}>
              <Check size={16} />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl font-black tabular-nums text-[#134E4A]">
            {stats.activeCount}
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#134E4A]/60">Bisa dimainkan santri</p>
        </div>

        {/* Game Non-aktif (Pemeliharaan) */}
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#134E4A]/70">Pemeliharaan</span>
            <span className={`h-8 w-8 bg-[#F59E0B] text-[#134E4A] ${ICON_BOX}`}>
              <Lock size={16} />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl font-black tabular-nums text-[#134E4A]">
            {stats.inactiveCount}
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#134E4A]/60">Status non-aktif santri</p>
        </div>

        {/* Akses Tamu Publik */}
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#134E4A]/70">Akses Tamu</span>
            <span className={`h-8 w-8 bg-[#0D9488] text-white ${ICON_BOX}`}>
              <Users size={16} />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl font-black tabular-nums text-[#134E4A]">
            {stats.guestOpen}
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#134E4A]/60">Terbuka tanpa login</p>
        </div>
      </div>

      {/* Control Bar: Pencarian, Filter & Mode Tampilan */}
      <section className={`space-y-3 p-4 ${CARD}`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Kolom Pencarian */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#134E4A]/60"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, gameId, materi pokok, atau instruksi..."
              className={INPUT_ICON}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#134E4A]/60 hover:text-[#FF6B6B]"
                aria-label="Hapus kata kunci pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mode Tampilan (Grid / Table) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? CHIP_ACTIVE : CHIP_IDLE}
            >
              <LayoutGrid size={14} />
              Kartu
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? CHIP_ACTIVE : CHIP_IDLE}
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
              className={SELECT_SM}
            >
              <option value="all">Semua Status Game</option>
              <option value="active">Game Aktif ({stats.activeCount})</option>
              <option value="inactive">Pemeliharaan ({stats.inactiveCount})</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#134E4A]"
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
              className={SELECT_SM}
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
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#134E4A]"
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
              className={SELECT_SM}
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
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#134E4A]"
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
              className={SELECT_SM}
            >
              <option value="all">Semua Akses</option>
              <option value="guest-open">Akses Tamu (Publik)</option>
              <option value="member-only">Khusus Member</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#134E4A]"
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
              className={SELECT_SM}
            >
              <option value="all">Semua Validasi</option>
              <option value="needs-validation">Perlu Validasi (Draf)</option>
              <option value="validated">Tervalidasi Resmi</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#134E4A]"
            />
          </div>
        </div>

        {/* Info Hasil & Reset Filter */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="font-bold text-[#134E4A]/70">
            Menampilkan{" "}
            <strong className="font-black text-[#134E4A]">
              {filteredGames.length}
            </strong>{" "}
            dari {games.length} game
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-black text-[#0D9488] underline-offset-2 hover:underline"
            >
              <X size={12} />
              Reset Semua Filter
            </button>
          )}
        </div>
      </section>

      {/* Konten Utama: Daftar Game */}
      {filteredGames.length === 0 ? (
        <div className={`py-16 text-center ${CARD}`}>
          <div className={`mx-auto h-12 w-12 bg-[#99F6E4] text-[#134E4A] ${ICON_BOX}`}>
            <Gamepad size={24} />
          </div>
          <h3 className="mt-3 font-display text-base font-black text-[#134E4A]">Tidak ada game ditemukan</h3>
          <p className="mt-1 text-sm font-bold text-[#134E4A]/70">
            Coba sesuaikan kata kunci atau bersihkan pilihan filter di atas.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className={`${BTN_PRIMARY_SM} mt-4`}
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
        <div className={TABLE_WRAP}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className={`px-5 py-3 ${TH}`}>Game</th>
                  <th className={`px-4 py-3 ${TH}`}>Status (Tampil)</th>
                  <th className={`px-4 py-3 ${TH}`}>Tipe Tampilan</th>
                  <th className={`px-4 py-3 ${TH}`}>Pilih Hub</th>
                  <th className={`px-4 py-3 text-center ${TH}`}>Urutan</th>
                  <th className={`px-4 py-3 ${TH}`}>Akses</th>
                  <th className={`px-4 py-3 text-right ${TH}`}>Aksi</th>
                </tr>
              </thead>
              <tbody>
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
        <div className={`h-12 w-12 bg-[#FF6B6B] text-white ${ICON_BOX}`}>
          <RefreshCw size={24} />
        </div>
        <p className="mt-2 text-sm font-bold text-[#134E4A]/70">
          Tindakan ini akan mengembalikan semua hak akses tamu, status
          validasi, dan deskripsi tujuan pembelajaran {stats.overriddenCount}{" "}
          game yang telah diubah ke konfigurasi bawaan sistem.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmResetAll(false)}
            className={BTN_SECONDARY}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmResetAll}
            className={BTN_DANGER}
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
    <article className={`group flex flex-col justify-between p-4 ${CARD}`}>
      {/* Header Kartu */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-display text-base font-black text-[#134E4A]">
                {game.title}
              </h3>
              {game.isOverridden && (
                <span
                  title="Game ini memiliki perubahan yang disimpan superadmin"
                  className="shrink-0 rounded-md border-[2px] border-[#134E4A] bg-[#F59E0B] px-1.5 py-0.5 text-[10px] font-black text-[#134E4A]"
                >
                  Disesuaikan
                </span>
              )}
            </div>
            <p className="mt-0.5 font-mono text-[11px] font-bold text-[#134E4A]/60">
              id: {game.gameId}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {game.isOverridden && (
              <button
                type="button"
                onClick={onReset}
                title="Kembalikan ke default"
                className={MINI_ICON_DANGER}
              >
                <RefreshCw size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={onEdit}
              title="Edit metadata lengkap"
              className={MINI_ICON_BTN}
            >
              <Pencil size={14} />
            </button>
          </div>
        </div>

        {/* Switch Status Aktif (Go Backend DB Integration) */}
        <div className="mt-3 flex items-center justify-between rounded-xl border-[2px] border-[#134E4A]/20 bg-[#F0FDF4] p-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                game.isActive ? "animate-pulse bg-[#0D9488]" : "bg-[#FF6B6B]"
              }`}
            />
            <div>
              <span className="text-xs font-black text-[#134E4A]">
                {game.isActive ? "Status: Aktif" : "Status: Non-aktif"}
              </span>
              <p className="text-[10px] font-bold text-[#134E4A]/60">
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
            className={`${SWITCH_BASE} h-7 w-12 ${
              game.isActive ? "bg-[#0D9488]" : "bg-white"
            } ${isToggling ? "cursor-wait opacity-50" : ""}`}
          >
            <span
              className={`pointer-events-none mt-px ml-px inline-block h-5 w-5 transform rounded-full border-2 border-[#134E4A] transition duration-200 ease-in-out ${
                game.isActive ? "translate-x-5 bg-white" : "translate-x-0 bg-[#F59E0B]"
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
            className={`${isGuestOpen ? BADGE_SUCCESS : BADGE_NEUTRAL} ${BADGE_BTN}`}
          >
            {isGuestOpen ? <Users size={12} /> : <Lock size={12} />}
            {isGuestOpen ? "Tamu Publik" : "Khusus Member"}
          </button>

          <button
            type="button"
            onClick={onToggleValidation}
            title="Klik untuk ubah status validasi kurikulum"
            className={`${game.needsContentValidation ? BADGE_WARNING : BADGE_SUCCESS} ${BADGE_BTN}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                game.needsContentValidation ? "bg-[#134E4A]" : "bg-[#0D9488]"
              }`}
            />
            {game.needsContentValidation ? "Perlu Validasi" : "Tervalidasi"}
          </button>
        </div>

        {/* Tujuan Pembelajaran */}
        <p className="mt-3 line-clamp-2 text-xs font-bold leading-relaxed text-[#134E4A]/90">
          {game.learningObjective}
        </p>

        {/* Tag Kurikulum: Materi & Jilid */}
        <div className="mt-3.5 space-y-1.5 border-t border-[#134E4A]/20 pt-2.5">
          <div className="flex flex-wrap items-center gap-1">
            <span className="mr-1 text-[10px] font-black uppercase text-[#134E4A]/60">
              Materi:
            </span>
            {game.materiPokok.map((m) => (
              <span
                key={m}
                className="rounded-md border border-[#134E4A]/30 bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#134E4A]"
              >
                {MATERI_LABELS[m] || m}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="mr-1 text-[10px] font-black uppercase text-[#134E4A]/60">
              Jilid:
            </span>
            {game.jilidRelevan.length > 0 ? (
              game.jilidRelevan.map((j) => (
                <span
                  key={j}
                  className="rounded-md border border-[#134E4A]/30 bg-[#99F6E4] px-1.5 py-0.5 text-[10px] font-black text-[#134E4A]"
                >
                  Jilid {j}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-bold italic text-[#134E4A]/60">
                Semua jenjang
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Kartu & Tombol Aksi */}
      <div className="mt-4 flex items-center justify-between border-t border-[#134E4A]/20 pt-3">
        <a
          href={`/member/ngaji-ceria/games/${game.gameId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-black text-[#0D9488] underline-offset-2 transition-colors hover:text-[#0F766E] hover:underline"
        >
          <Gamepad size={13} />
          Mainkan Game
        </a>

        <button
          type="button"
          onClick={onEdit}
          className={BTN_SECONDARY_SM}
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
    <tr className={TR}>
      {/* Kolom Game */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[#134E4A]">
                {game.title}
              </span>
              {game.isOverridden && (
                <span className="rounded-md border border-[#134E4A] bg-[#F59E0B] px-1 text-[9px] font-black text-[#134E4A]">
                  Custom
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-bold text-[#134E4A]/60">{game.gameId}</span>
              <span className="text-[10px] text-[#134E4A]/40">•</span>
              <span className="text-[10px] font-black text-[#0D9488]">
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
            className={`${SWITCH_BASE} h-6 w-10 ${
              game.isActive ? "bg-[#0D9488]" : "bg-white"
            } ${isToggling ? "cursor-wait opacity-50" : ""}`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full border-2 border-[#134E4A] transition duration-200 ease-in-out ${
                game.isActive ? "translate-x-4 bg-white" : "translate-x-0 bg-[#F59E0B]"
              }`}
            />
          </button>
          <span
            className={`text-xs font-black ${
              game.isActive ? "text-[#0D9488]" : "text-[#134E4A]/50"
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
          className={INPUT_SM}
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
          className={`${INPUT_SM} ${
            game.displayType !== "hub" ? "cursor-not-allowed bg-[#F0FDF4] opacity-40" : ""
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
          className={INPUT_NUM}
        />
      </td>

      {/* Kolom Akses */}
      <td className="px-4 py-3.5">
        <button
          type="button"
          onClick={onToggleAccess}
          title="Klik untuk ubah cepat"
          className={`${isGuestOpen ? BADGE_SUCCESS : BADGE_NEUTRAL} ${BADGE_BTN}`}
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
          className={`${game.needsContentValidation ? BADGE_WARNING : BADGE_SUCCESS} ${BADGE_BTN}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              game.needsContentValidation ? "bg-[#134E4A]" : "bg-[#0D9488]"
            }`}
          />
          {game.needsContentValidation ? "Draf" : "Valid"}
        </button>
      </td>

      {/* Kolom Aksi */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <a
            href={`/member/ngaji-ceria/games/${game.gameId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Mainkan game"
            className={MINI_ICON_BTN}
          >
            <Gamepad size={14} />
          </a>
          <button
            type="button"
            onClick={onEdit}
            title="Edit metadata"
            className={MINI_ICON_BTN}
          >
            <Pencil size={14} />
          </button>
          {game.isOverridden && (
            <button
              type="button"
              onClick={onReset}
              title="Kembalikan ke default"
              className={MINI_ICON_DANGER}
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
      <p className="font-mono text-xs font-bold text-[#134E4A]/60">id: {game.gameId}</p>

      <form
        id="edit-game-form"
        onSubmit={handleSubmit}
        className="admin-scroll mt-4 space-y-5 text-sm font-bold text-[#134E4A]"
      >
        {/* Judul Game */}
        <div>
          <label className={LABEL}>
            Judul Game
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={INPUT}
          />
        </div>

        {/* Tingkat Akses (Radio Cards) */}
        <div>
          <label className={LABEL}>
            Hak Akses Santri
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-[2.5px] border-[#134E4A] p-3 transition-all ${
                access === "guest-open"
                  ? "bg-[#99F6E4] shadow-[2px_2px_0px_#134E4A]"
                  : "bg-white hover:bg-[#F0FDF4]"
              }`}
            >
              <input
                type="radio"
                name="access"
                value="guest-open"
                checked={access === "guest-open"}
                onChange={() => setAccess("guest-open")}
                className="mt-0.5 accent-[#0D9488] focus:ring-[#0D9488]"
              />
              <div>
                <span className="block text-xs font-black text-[#134E4A]">
                  Terbuka untuk Tamu (Guest Open)
                </span>
                <span className="mt-0.5 block text-[11px] font-bold text-[#134E4A]/70">
                  Dapat dimainkan santri tanpa perlu login akun.
                </span>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-[2.5px] border-[#134E4A] p-3 transition-all ${
                access === "member-only"
                  ? "bg-[#99F6E4] shadow-[2px_2px_0px_#134E4A]"
                  : "bg-white hover:bg-[#F0FDF4]"
              }`}
            >
              <input
                type="radio"
                name="access"
                value="member-only"
                checked={access === "member-only"}
                onChange={() => setAccess("member-only")}
                className="mt-0.5 accent-[#0D9488] focus:ring-[#0D9488]"
              />
              <div>
                <span className="block text-xs font-black text-[#134E4A]">
                  Khusus Member (Wajib Login)
                </span>
                <span className="mt-0.5 block text-[11px] font-bold text-[#134E4A]/70">
                  Santri harus masuk akun terlebih dahulu.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Status Validasi Konten */}
        <div>
          <label className={LABEL}>
            Status Validasi Kurikulum
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-[2.5px] border-[#134E4A] p-3 transition-all ${
                !needsContentValidation
                  ? "bg-[#99F6E4] shadow-[2px_2px_0px_#134E4A]"
                  : "bg-white hover:bg-[#F0FDF4]"
              }`}
            >
              <input
                type="radio"
                name="validation"
                checked={!needsContentValidation}
                onChange={() => setNeedsContentValidation(false)}
                className="mt-0.5 accent-[#0D9488] focus:ring-[#0D9488]"
              />
              <div>
                <span className="block text-xs font-black text-[#134E4A]">
                  Tervalidasi Resmi
                </span>
                <span className="mt-0.5 block text-[11px] font-bold text-[#134E4A]/70">
                  Konten dan materi sudah diverifikasi tim ustadz/kurikulum.
                </span>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-[2.5px] border-[#134E4A] p-3 transition-all ${
                needsContentValidation
                  ? "bg-[#F59E0B]/40 shadow-[2px_2px_0px_#134E4A]"
                  : "bg-white hover:bg-[#F0FDF4]"
              }`}
            >
              <input
                type="radio"
                name="validation"
                checked={needsContentValidation}
                onChange={() => setNeedsContentValidation(true)}
                className="mt-0.5 accent-[#0D9488] focus:ring-[#0D9488]"
              />
              <div>
                <span className="block text-xs font-black text-[#134E4A]">
                  Perlu Validasi (Draf)
                </span>
                <span className="mt-0.5 block text-[11px] font-bold text-[#134E4A]/70">
                  Perlu peninjauan ulang keselarasan tajwid/makhraj.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Materi Pokok Tags Checkbox */}
        <div>
          <label className={LABEL}>
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
                  className={checked ? CHIP_ACTIVE : CHIP_IDLE}
                >
                  {MATERI_LABELS[m]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jilid Relevan */}
        <div>
          <label className={LABEL}>
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
                  className={`${checked ? CHIP_ACTIVE : CHIP_IDLE} w-16`}
                >
                  Jilid {j}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tujuan Pembelajaran */}
        <div>
          <label className={LABEL}>
            Tujuan Pembelajaran
          </label>
          <textarea
            rows={2}
            required
            value={learningObjective}
            onChange={(e) => setLearningObjective(e.target.value)}
            className={INPUT}
          />
        </div>

        {/* Cara Bermain */}
        <div>
          <label className={LABEL}>
            Instruksi / Cara Main
          </label>
          <textarea
            rows={3}
            required
            value={caraMain}
            onChange={(e) => setCaraMain(e.target.value)}
            className={INPUT}
          />
        </div>

        {/* Tips Ustadz */}
        <div>
          <div className="flex items-center justify-between">
            <label className={LABEL}>
              Tips Ustadz ({tipsUstadz.length})
            </label>
            <button
              type="button"
              onClick={handleAddTip}
              className={BTN_PRIMARY_SM}
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
                  className={`${INPUT_SM} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTip(idx)}
                  className={MINI_ICON_DANGER}
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
            className={`${BTN_BASE} ${BTN_SM} ${BTN_DANGER_COLOR}`}
          >
            <RefreshCw size={13} />
            Kembalikan ke Default
          </button>
        ) : (
          <span className="text-xs font-bold text-[#134E4A]/70">Konfigurasi bawaan</span>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={BTN_SECONDARY}
          >
            Batal
          </button>
          <button
            type="submit"
            form="edit-game-form"
            className={BTN_PRIMARY}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </AppModal>
  );
}

export default AdminGameCatalogPage;
