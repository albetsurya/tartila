import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/ui";
import {
  ChevronDown,
  MoreVertical,
  Pause,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "@/components/ui/CustomIcons";
import {
  createUser,
  deleteUser,
  fetchUsers,
  getAdminErrorMessage,
  setUserStatus,
  updateUser,
  type AdminUser,
  type AdminUserRole,
  type AdminUserStatus,
} from "../services/userService";
import { UserFormModal, type UserFormValues } from "../components/UserFormModal";
import { Spinner } from "../components/Spinner";

const ROLE_LABELS: Record<AdminUserRole, string> = {
  superadmin: "Superadmin",
  tartila_admin: "Tartila Admin",
  member: "Member",
};

const STATUS_LABELS: Record<AdminUserStatus, string> = {
  active: "Aktif",
  suspended: "Ditangguhkan",
};

const ROLE_FILTERS: Array<{ value: AdminUserRole | "all"; label: string }> = [
  { value: "all", label: "Semua Role" },
  { value: "superadmin", label: "Superadmin" },
  { value: "tartila_admin", label: "Tartila Admin" },
  { value: "member", label: "Member" },
];

const STATUS_FILTERS: Array<{ value: AdminUserStatus | "all"; label: string }> =
  [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "suspended", label: "Ditangguhkan" },
  ];

const SKELETON_ROWS = 6;

interface RowMenu {
  id: string;
  x: number;
  y: number;
}

function roleColor(role: AdminUserRole): string {
  if (role === "superadmin") return "var(--admin-danger)";
  if (role === "tartila_admin") return "var(--admin-accent)";
  return "var(--admin-text-muted)";
}

function RoleBadge({ role }: { role: AdminUserRole }) {
  const color = roleColor(role);
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: AdminUserStatus }) {
  const color =
    status === "active" ? "var(--admin-accent)" : "var(--admin-danger)";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium"
      style={{ color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

interface FilterSelectProps<T extends string> {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps<T>) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="admin-surface admin-border w-full appearance-none rounded-lg border py-2 pl-3 pr-9 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 sm:w-44"
        style={{ color: "var(--admin-text)" }}
      >
        {options.map((option) => (
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
  );
}

function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: "var(--admin-skeleton)" }}
    />
  );
}

function SkeletonRow() {
  return (
    <tr className="admin-border border-b last:border-0">
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <SkeletonBar className="h-9 w-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBar className="h-3 w-32" />
            <SkeletonBar className="h-3 w-40" />
          </div>
        </div>
      </td>
      <td className="px-6 py-3">
        <SkeletonBar className="h-5 w-20 rounded-md" />
      </td>
      <td className="px-6 py-3">
        <SkeletonBar className="h-4 w-20" />
      </td>
      <td className="px-6 py-3">
        <SkeletonBar className="h-4 w-24" />
      </td>
      <td className="px-6 py-3">
        <div className="flex justify-end">
          <SkeletonBar className="h-4 w-16" />
        </div>
      </td>
    </tr>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "all">(
    "all",
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [menu, setMenu] = useState<RowMenu | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchUsers()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(getAdminErrorMessage(err, "Gagal memuat data pengguna."));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  // Dismiss the row action menu on outside click / scroll / resize.
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu]);

  const reload = () => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleRetry = () => {
    setUsers([]);
    reload();
  };

  const openCreateForm = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const openEditForm = (user: AdminUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  // Throws on failure so the modal can surface the backend message inline.
  const handleFormSubmit = async (values: UserFormValues) => {
    if (editingUser) {
      await updateUser(editingUser.id, values);
    } else {
      await createUser(values);
    }
    reload();
  };

  const handleSuspend = async (user: AdminUser) => {
    setMenu(null);
    setActionError(null);
    setSuspendingId(user.id);
    try {
      await setUserStatus(user.id, "suspended");
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, status: "suspended" } : item,
        ),
      );
    } catch (err) {
      setActionError(
        getAdminErrorMessage(err, "Gagal menangguhkan pengguna."),
      );
    } finally {
      setSuspendingId(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    setMenu(null);
    if (
      !window.confirm(
        `Hapus pengguna "${user.name}"? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      return;
    }
    setActionError(null);
    setDeletingId(user.id);
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
    } catch (err) {
      setActionError(getAdminErrorMessage(err, "Gagal menghapus pengguna."));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      if (statusFilter !== "all" && user.status !== statusFilter) return false;
      if (!keyword) return true;
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword)
      );
    });
  }, [users, query, roleFilter, statusFilter]);

  const menuUser = menu ? users.find((user) => user.id === menu.id) : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Manajemen Pengguna</h1>
          <p className="mt-1 text-sm admin-muted">
            Kelola akses, role, dan status pengguna platform Tartila.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="admin-accent-bg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90"
        >
          <Plus size={16} />
          Tambah Pengguna
        </button>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="admin-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama, username, atau email..."
            aria-label="Cari pengguna"
            className="admin-surface admin-border w-full rounded-lg border py-2 pl-9 pr-3 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--admin-text)" }}
          />
        </div>
        <FilterSelect
          label="Filter role"
          value={roleFilter}
          options={ROLE_FILTERS}
          onChange={setRoleFilter}
        />
        <FilterSelect
          label="Filter status"
          value={statusFilter}
          options={STATUS_FILTERS}
          onChange={setStatusFilter}
        />
      </div>

      {actionError ? (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border px-4 py-2 text-sm"
          style={{
            color: "var(--admin-danger)",
            borderColor: "var(--admin-danger)",
            backgroundColor:
              "color-mix(in srgb, var(--admin-danger) 10%, transparent)",
          }}
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            aria-label="Tutup pesan"
            className="shrink-0 opacity-70 transition-opacity duration-150 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      <section className="admin-surface admin-border rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="admin-border border-b text-left text-xs admin-muted">
                <th className="px-6 py-3 font-medium">Pengguna</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Bergabung</th>
                <th className="px-6 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <p className="text-sm font-medium">
                        Gagal memuat data pengguna
                      </p>
                      <p className="max-w-md text-xs admin-muted">{error}</p>
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="admin-accent-bg mt-1 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90"
                      >
                        <RefreshCw size={14} />
                        Coba Lagi
                      </button>
                    </div>
                  </td>
                </tr>
              ) : isLoading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm admin-muted"
                  >
                    {users.length === 0
                      ? "Belum ada pengguna."
                      : "Tidak ada pengguna yang cocok dengan filter."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`admin-border border-b last:border-0 transition-opacity duration-150 hover:bg-[var(--admin-accent-soft)] ${
                      deletingId === user.id || suspendingId === user.id
                        ? "pointer-events-none opacity-40"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size={36} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="truncate text-xs admin-muted">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 admin-muted tabular-nums">
                      {user.joinedAt}
                    </td>
                    <td className="px-6 py-3">
                      {deletingId === user.id || suspendingId === user.id ? (
                        <div
                          className="flex items-center justify-end pr-2"
                          role="status"
                          aria-label="Memproses"
                        >
                          <Spinner size={15} className="admin-muted" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditForm(user)}
                            aria-label={`Ubah ${user.name}`}
                            title="Ubah"
                            className="admin-nav-item rounded-md p-2 transition-colors duration-150"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              const rect =
                                event.currentTarget.getBoundingClientRect();
                              setMenu((prev) =>
                                prev?.id === user.id
                                  ? null
                                  : {
                                      id: user.id,
                                      x: rect.right,
                                      y: rect.bottom,
                                    },
                              );
                            }}
                            aria-label={`Aksi lain untuk ${user.name}`}
                            aria-haspopup="menu"
                            aria-expanded={menu?.id === user.id}
                            title="Aksi lainnya"
                            className="admin-nav-item rounded-md p-2 transition-colors duration-150"
                          >
                            <MoreVertical size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="admin-border border-t px-6 py-3 text-xs admin-muted">
          {error
            ? "Gagal memuat data"
            : isLoading
              ? "Memuat data..."
              : `Menampilkan ${filteredUsers.length} dari ${users.length} pengguna`}
        </footer>
      </section>

      {menu && menuUser ? (
        <div
          className="fixed z-[130]"
          style={{ top: menu.y + 4, left: menu.x }}
          onClick={(event) => event.stopPropagation()}
          role="menu"
        >
          <div className="admin-surface admin-border w-48 -translate-x-full rounded-lg border p-1 shadow-lg">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSuspend(menuUser)}
              className="admin-nav-item flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-150"
            >
              <Pause size={14} />
              Suspend Pengguna
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleDelete(menuUser)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors duration-150 hover:opacity-80"
              style={{ color: "var(--admin-danger)" }}
            >
              <Trash2 size={14} />
              Hapus Pengguna
            </button>
          </div>
        </div>
      ) : null}

      {isFormOpen ? (
        <UserFormModal
          key={editingUser?.id ?? "create"}
          mode={editingUser ? "edit" : "create"}
          initialUser={editingUser}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      ) : null}
    </div>
  );
}
