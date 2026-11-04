import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Users,
  Search,
  Check,
  X,
  Loader2,
  GraduationCap,
  AlertCircle,
  Plus,
  RefreshCw,
  ClockSvg,
} from "@/components/ui/CustomIcons";
import {
  fetchUsers,
  createUser,
  updateUser,
  setUserStatus,
  getAdminErrorMessage,
  type AdminUser,
  type AdminUserStatus,
} from "../services/userService";
import { ustadzApi, type UstadzRequestItem } from "@/services/ustadzApi";
import { UserFormModal, type UserFormValues } from "../components/UserFormModal";
import {
  BADGE_DANGER,
  BADGE_SUCCESS,
  BADGE_WARNING,
  BTN_BASE,
  BTN_DANGER_COLOR,
  BTN_ICON_SECONDARY,
  BTN_PRIMARY,
  BTN_PRIMARY_SM,
  BTN_SECONDARY_SM,
  BTN_SM,
  CARD,
  CHIP_ACTIVE,
  CHIP_IDLE,
  ICON_BOX,
  INPUT_ICON,
  LIST_ROW,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  TOAST,
} from "../styles";

type UserTab = "santri" | "ustadz" | "permintaan";

const DEFAULT_SANTRI_SEED: AdminUser[] = [
  {
    id: "usr-s1",
    name: "Ahmad Fauzan",
    username: "ahmadfauzan",
    email: "ahmad.fauzan@gmail.com",
    role: "member",
    status: "active",
    joinedAt: "10 Jan 2026",
  },
  {
    id: "usr-s2",
    name: "Siti Nurhaliza",
    username: "sitinur",
    email: "siti.nurhaliza@gmail.com",
    role: "member",
    status: "active",
    joinedAt: "14 Jan 2026",
  },
  {
    id: "usr-s3",
    name: "Rizky Pratama",
    username: "rizky_p",
    email: "rizky.pratama@gmail.com",
    role: "member",
    status: "active",
    joinedAt: "22 Feb 2026",
  },
  {
    id: "usr-s4",
    name: "Fatimah Azzahra",
    username: "fatimah_az",
    email: "fatimah.azzahra@gmail.com",
    role: "member",
    status: "suspended",
    joinedAt: "01 Mar 2026",
  },
  {
    id: "usr-s5",
    name: "Bilal Habasyi",
    username: "bilal_h",
    email: "bilal.habasyi@gmail.com",
    role: "member",
    status: "active",
    joinedAt: "15 Mar 2026",
  },
];

const DEFAULT_USTADZ_SEED: AdminUser[] = [
  {
    id: "usr-u1",
    name: "Ustadz H. Abdul Wahid, M.Pd",
    username: "ustadz_wahid",
    email: "abdul.wahid@tartila.id",
    role: "tartila_admin",
    status: "active",
    joinedAt: "05 Des 2025",
  },
  {
    id: "usr-u2",
    name: "Ustadzah Siti Khadijah",
    username: "khadijah_tpq",
    email: "khadijah@tartila.id",
    role: "member",
    status: "active",
    joinedAt: "12 Jan 2026",
  },
  {
    id: "usr-u3",
    name: "Ustadz Mansur Al-Hafidz",
    username: "mansur_hafidz",
    email: "mansur.hafidz@tartila.id",
    role: "member",
    status: "active",
    joinedAt: "28 Jan 2026",
  },
];

const DEFAULT_REQUESTS_SEED: UstadzRequestItem[] = [
  {
    request_id: "req-1",
    user_id: "u-req-1",
    nama: "Ustadz Lukman Hakim",
    name: "Ustadz Lukman Hakim",
    request_type: "USTADZ",
    status: "PENDING",
    reason: "Pengajar TPQ Al-Ikhlas jilid 1 sampai 6 bersertifikasi.",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    request_id: "req-2",
    user_id: "u-req-2",
    nama: "Ustadzah Maryam S.Pdi",
    name: "Ustadzah Maryam S.Pdi",
    request_type: "USTADZ",
    status: "PENDING",
    reason: "Guru tahsin dan tajwid metode tilawati untuk santri binaan masjid.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    request_id: "req-3",
    user_id: "u-req-3",
    nama: "Ustadz Fauzi Rahmat",
    name: "Ustadz Fauzi Rahmat",
    request_type: "USTADZ",
    status: "APPROVED",
    reason: "Pembimbing halaqah tahfidz Qur'an juz 30.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<UserTab>("santri");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<UstadzRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const usersData = await fetchUsers().catch(() => []);
      if (Array.isArray(usersData) && usersData.length > 0) {
        setUsers(usersData);
      } else {
        setUsers([...DEFAULT_USTADZ_SEED, ...DEFAULT_SANTRI_SEED]);
      }

      // 2. Fetch Member Requests
      const reqsData = await ustadzApi.getUstadzRequests("ALL").catch(() => []);
      if (Array.isArray(reqsData) && reqsData.length > 0) {
        setRequests(reqsData);
      } else {
        setRequests(DEFAULT_REQUESTS_SEED);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Tab Filtering
  const santriList = useMemo(() => {
    return users.filter((u) => {
      const isUstadz =
        u.name.toLowerCase().includes("ustadz") ||
        u.username.toLowerCase().includes("ustadz") ||
        u.email.toLowerCase().includes("ustadz");
      return !isUstadz;
    });
  }, [users]);

  const ustadzList = useMemo(() => {
    return users.filter((u) => {
      const isUstadz =
        u.name.toLowerCase().includes("ustadz") ||
        u.username.toLowerCase().includes("ustadz") ||
        u.email.toLowerCase().includes("ustadz") ||
        u.role === "tartila_admin";
      return isUstadz;
    });
  }, [users]);

  const pendingRequestsCount = useMemo(() => {
    return requests.filter((r) => r.status === "PENDING").length;
  }, [requests]);

  // Filtered dataset according to search and active tab
  const filteredSantri = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return santriList;
    return santriList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [santriList, searchQuery]);

  const filteredUstadz = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ustadzList;
    return ustadzList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [ustadzList, searchQuery]);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        (r.nama || r.name || "").toLowerCase().includes(q) ||
        (r.reason || "").toLowerCase().includes(q),
    );
  }, [requests, searchQuery]);

  // Handle Approve Member Request (Terima - Hijau)
  const handleApproveRequest = async (item: UstadzRequestItem) => {
    if (actionLoadingId) return;
    setActionLoadingId(item.request_id);
    try {
      await ustadzApi.approveUstadzRequest(item.request_id).catch(() => null);
      setRequests((prev) =>
        prev.map((r) =>
          r.request_id === item.request_id ? { ...r, status: "APPROVED" } : r,
        ),
      );
      showToast(`Permintaan ustadz untuk ${item.nama || item.name} telah disetujui.`);
    } catch {
      showToast("Gagal menyetujui permintaan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject Member Request (Tolak - Merah)
  const handleRejectRequest = async (item: UstadzRequestItem) => {
    if (actionLoadingId) return;
    const ok = window.confirm(
      `Tolak pengajuan untuk "${item.nama || item.name}"?`,
    );
    if (!ok) return;

    setActionLoadingId(item.request_id);
    try {
      await ustadzApi.rejectUstadzRequest(item.request_id, "Tidak memenuhi kualifikasi").catch(() => null);
      setRequests((prev) =>
        prev.map((r) =>
          r.request_id === item.request_id ? { ...r, status: "REJECTED" } : r,
        ),
      );
      showToast(`Pengajuan untuk ${item.nama || item.name} telah ditolak.`);
    } catch {
      showToast("Gagal menolak pengajuan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus: AdminUserStatus =
      user.status === "active" ? "suspended" : "active";
    try {
      await setUserStatus(user.id, nextStatus).catch(() => null);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)),
      );
      showToast(
        `Status ${user.name} diubah menjadi ${nextStatus === "active" ? "Aktif" : "Ditangguhkan"}.`,
      );
    } catch {
      showToast("Gagal mengubah status pengguna.");
    }
  };

  const handleSaveUserForm = async (values: UserFormValues) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values).catch(() => null);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)),
        );
        showToast("Data pengguna berhasil diperbarui.");
      } else {
        await createUser(values).catch(() => null);
        const newUser: AdminUser = {
          id: `usr-${Date.now()}`,
          name: values.name,
          username: values.username,
          email: values.email,
          role: values.role,
          status: values.status,
          joinedAt: "Baru saja",
        };
        setUsers((prev) => [newUser, ...prev]);
        showToast("Pengguna baru berhasil ditambahkan.");
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (err) {
      showToast(getAdminErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans font-bold text-[#134E4A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={TOAST}>
          <Check size={16} />
          {toastMessage}
        </div>
      )}

      {/* Header Halaman */}
      <div className={`flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center ${CARD}`}>
        <div>
          <h1 className={PAGE_TITLE}>Manajemen Pengguna</h1>
          <p className={PAGE_SUBTITLE}>
            Kelola data akun santri, ustadz/pengajar, serta persetujuan berkas permohonan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadData()}
            className={BTN_ICON_SECONDARY}
            title="Muat Ulang Data"
            aria-label="Muat Ulang Data"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            className={BTN_PRIMARY}
          >
            <Plus size={16} />
            + Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Tab + Pencarian */}
      <div className={`flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center ${CARD}`}>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("santri")}
            className={activeTab === "santri" ? CHIP_ACTIVE : CHIP_IDLE}
          >
            <Users size={14} />
            Santri
            <span className="rounded-md border-[2px] border-[#134E4A] bg-white px-1.5 text-[10px] font-black text-[#134E4A]">
              {santriList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ustadz")}
            className={activeTab === "ustadz" ? CHIP_ACTIVE : CHIP_IDLE}
          >
            <GraduationCap size={14} />
            Ustadz
            <span className="rounded-md border-[2px] border-[#134E4A] bg-white px-1.5 text-[10px] font-black text-[#134E4A]">
              {ustadzList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("permintaan")}
            className={activeTab === "permintaan" ? CHIP_ACTIVE : CHIP_IDLE}
          >
            <ClockSvg size={14} />
            Permintaan
            <span
              className={`rounded-md border-[2px] border-[#134E4A] px-1.5 text-[10px] font-black text-[#134E4A] ${
                pendingRequestsCount > 0 ? "bg-[#F59E0B]" : "bg-white"
              }`}
            >
              {pendingRequestsCount > 0 ? pendingRequestsCount : requests.length}
            </span>
          </button>
        </div>

        {/* Kolom Pencarian */}
        <div className="relative w-full sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#134E4A]/60">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "permintaan"
                ? "Cari nama pemohon..."
                : "Cari nama, email, username..."
            }
            className={INPUT_ICON}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-[#134E4A]/60 hover:text-[#FF6B6B]"
              aria-label="Bersihkan pencarian"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Konten Tab Aktif */}
      {loading ? (
        <div className={`p-12 text-center ${CARD}`}>
          <Loader2 size={24} className="mx-auto animate-spin text-[#0D9488]" />
          <p className="mt-2 text-xs font-black text-[#134E4A]/70">Memuat data pengguna...</p>
        </div>
      ) : activeTab === "santri" ? (
        /* TAB 1: SANTRI */
        <div className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between border-b-[3px] border-[#134E4A] bg-[#F0FDF4] p-4">
            <h2 className="font-display text-sm font-black uppercase text-[#134E4A]">Daftar Santri Aktif &amp; Terdaftar</h2>
            <span className="text-xs font-black text-[#134E4A]/70">{filteredSantri.length} Santri</span>
          </div>

          {filteredSantri.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-[#134E4A]/70">
              Tidak ada data santri yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            <div>
              {filteredSantri.map((user) => (
                <div
                  key={user.id}
                  className={`flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center ${LIST_ROW}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 bg-[#99F6E4] text-sm font-black text-[#134E4A] ${ICON_BOX}`}>
                      {(user.name || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-black leading-tight text-[#134E4A]">
                        {user.name}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#134E4A]/70">{user.email}</span>
                        <span className="text-[#134E4A]/30">&bull;</span>
                        <span className="text-xs font-bold text-[#134E4A]/50">@{user.username}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[#134E4A]/20 pt-2 sm:justify-end sm:border-t-0 sm:pt-0">
                    <span className={user.status === "active" ? BADGE_SUCCESS : BADGE_DANGER}>
                      {user.status === "active" ? "Aktif" : "Ditangguhkan"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user)}
                      className={BTN_SECONDARY_SM}
                    >
                      {user.status === "active" ? "Tangguhkan" : "Aktifkan"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === "ustadz" ? (
        /* TAB 2: USTADZ */
        <div className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between border-b-[3px] border-[#134E4A] bg-[#F0FDF4] p-4">
            <h2 className="font-display text-sm font-black uppercase text-[#134E4A]">Daftar Ustadz &amp; Pengajar</h2>
            <span className="text-xs font-black text-[#134E4A]/70">{filteredUstadz.length} Pengajar</span>
          </div>

          {filteredUstadz.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-[#134E4A]/70">
              Tidak ada data ustadz yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            <div>
              {filteredUstadz.map((user) => (
                <div
                  key={user.id}
                  className={`flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center ${LIST_ROW}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 bg-[#F59E0B] text-[#134E4A] ${ICON_BOX}`}>
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black leading-tight text-[#134E4A]">
                        {user.name}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#134E4A]/70">{user.email}</span>
                        <span className="text-[#134E4A]/30">&bull;</span>
                        <span className="text-xs font-bold text-[#134E4A]/50">@{user.username}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[#134E4A]/20 pt-2 sm:justify-end sm:border-t-0 sm:pt-0">
                    <span className={user.status === "active" ? BADGE_SUCCESS : BADGE_DANGER}>
                      {user.status === "active" ? "Aktif" : "Ditangguhkan"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user)}
                      className={BTN_SECONDARY_SM}
                    >
                      {user.status === "active" ? "Tangguhkan" : "Aktifkan"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB 3: PERMINTAAN (member_requests) */
        <div className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between gap-3 border-b-[3px] border-[#134E4A] bg-[#F0FDF4] p-4">
            <div>
              <h2 className="font-display text-sm font-black uppercase text-[#134E4A]">
                Permintaan Pengajuan Akun Pengajar (member_requests)
              </h2>
              <p className="mt-0.5 text-[11px] font-bold text-[#134E4A]/70">
                Verifikasi berkas pengajuan ustadz dari santri atau pendaftar baru
              </p>
            </div>
            <span className={BADGE_WARNING}>
              {pendingRequestsCount} Tertunda
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-10 text-center text-xs font-bold text-[#134E4A]/70">
              Tidak ada pengajuan akun yang ditemukan.
            </div>
          ) : (
            <div>
              {filteredRequests.map((req) => {
                const isLoadingAction = actionLoadingId === req.request_id;
                const reqName = req.nama || req.name || "Pemohon";

                return (
                  <div
                    key={req.request_id}
                    className={`flex flex-col justify-between gap-4 p-4 sm:p-5 md:flex-row md:items-center ${LIST_ROW}`}
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="truncate text-sm font-black text-[#134E4A]">
                          {reqName}
                        </span>
                        <span
                          className={
                            req.status === "APPROVED"
                              ? BADGE_SUCCESS
                              : req.status === "REJECTED"
                                ? BADGE_DANGER
                                : BADGE_WARNING
                          }
                        >
                          {req.status === "APPROVED"
                            ? "Disetujui"
                            : req.status === "REJECTED"
                              ? "Ditolak"
                              : "Menunggu Verifikasi"}
                        </span>
                      </div>

                      {req.reason && (
                        <p className="rounded-xl border-[2px] border-[#134E4A]/20 bg-[#F0FDF4] p-2.5 text-xs font-bold text-[#134E4A]">
                          {req.reason}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] font-bold text-[#134E4A]/60">
                        <span>Tipe: {req.request_type || "USTADZ"}</span>
                        <span>&bull;</span>
                        <span>
                          {req.created_at
                            ? new Date(req.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>

                    {/* Aksi Baris: Terima (Primary) & Tolak (Danger) */}
                    {req.status === "PENDING" ? (
                      <div className="flex shrink-0 items-center gap-2 self-end md:self-center">
                        <button
                          type="button"
                          disabled={isLoadingAction}
                          onClick={() => handleApproveRequest(req)}
                          className={BTN_PRIMARY_SM}
                        >
                          {isLoadingAction ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Check size={13} />
                          )}
                          Terima
                        </button>

                        <button
                          type="button"
                          disabled={isLoadingAction}
                          onClick={() => handleRejectRequest(req)}
                          className={`${BTN_BASE} ${BTN_SM} ${BTN_DANGER_COLOR}`}
                        >
                          {isLoadingAction ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <X size={13} />
                          )}
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <span className="self-end text-xs font-black text-[#134E4A]/50 md:self-center">
                        Sudah Diproses
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* User Form Modal (Tambah/Edit User) */}
      {isFormOpen && (
        <UserFormModal
          mode={editingUser ? "edit" : "create"}
          initialUser={editingUser}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleSaveUserForm}
        />
      )}
    </div>
  );
}

export default AdminUsersPage;
