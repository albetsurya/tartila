import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown } from "@/components/ui/CustomIcons";
import { AppModal } from "@/components/ui/AppModal";
import {
  getAdminErrorMessage,
  type AdminUser,
  type AdminUserRole,
  type AdminUserStatus,
} from "../services/userService";
import { Spinner } from "./Spinner";

export interface UserFormValues {
  name: string;
  username: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}

interface UserFormModalProps {
  mode: "create" | "edit";
  initialUser?: AdminUser | null;
  onClose: () => void;
  /** Performs the create/update request. Reject to keep the modal open with an error. */
  onSubmit: (values: UserFormValues) => Promise<void>;
}

const ROLE_OPTIONS: Array<{ value: AdminUserRole; label: string }> = [
  { value: "superadmin", label: "Superadmin" },
  { value: "tartila_admin", label: "Tartila Admin" },
  { value: "member", label: "Member" },
];

const STATUS_OPTIONS: Array<{ value: AdminUserStatus; label: string }> = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

const INPUT_CLASS =
  "admin-surface admin-border w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2";

interface FieldErrors {
  name?: string;
  username?: string;
  email?: string;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium admin-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs" style={{ color: "var(--admin-danger)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function UserFormModal({
  mode,
  initialUser,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [name, setName] = useState(initialUser?.name ?? "");
  const [username, setUsername] = useState(initialUser?.username ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [role, setRole] = useState<AdminUserRole>(initialUser?.role ?? "member");
  const [status, setStatus] = useState<AdminUserStatus>(
    initialUser?.status ?? "active",
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, isSubmitting]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Nama lengkap wajib diisi.";
    if (!username.trim()) next.username = "Username wajib diisi.";
    if (!email.trim()) next.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Format email tidak valid.";
    }
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        role,
        status,
      });
      onClose();
    } catch (err) {
      setSubmitError(getAdminErrorMessage(err, "Gagal menyimpan pengguna."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <AppModal
      isOpen={true}
      onClose={isSubmitting ? () => {} : onClose}
      title={isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
    >
      <p className="mb-4 text-xs admin-muted">
        {isEdit
          ? "Perbarui data pengguna Tartila."
          : "Tambahkan pengguna baru ke platform Tartila."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field id="user-name" label="Nama Lengkap" error={errors.name}>
          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Mis. Abdullah Fattah"
            className={INPUT_CLASS}
            style={{ color: "var(--admin-text)" }}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="user-username" label="Username" error={errors.username}>
            <input
              id="user-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Mis. ceria_abdullah"
              className={INPUT_CLASS}
              style={{ color: "var(--admin-text)" }}
            />
          </Field>
          <Field id="user-email" label="Email" error={errors.email}>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className={INPUT_CLASS}
              style={{ color: "var(--admin-text)" }}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="user-role" label="Role">
            <div className="relative">
              <select
                id="user-role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as AdminUserRole)
                }
                className={`${INPUT_CLASS} appearance-none pr-9`}
                style={{ color: "var(--admin-text)" }}
              >
                {ROLE_OPTIONS.map((option) => (
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
          </Field>
          <Field id="user-status" label="Status">
            <div className="relative">
              <select
                id="user-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as AdminUserStatus)
                }
                className={`${INPUT_CLASS} appearance-none pr-9`}
                style={{ color: "var(--admin-text)" }}
              >
                {STATUS_OPTIONS.map((option) => (
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
          </Field>
        </div>

        {submitError ? (
          <div
            role="alert"
            className="rounded-lg border px-3 py-2 text-xs"
            style={{
              color: "var(--admin-danger)",
              borderColor: "var(--admin-danger)",
              backgroundColor:
                "color-mix(in srgb, var(--admin-danger) 10%, transparent)",
            }}
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="admin-nav-item rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="admin-accent-bg inline-flex min-w-[176px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Spinner size={14} /> : null}
            {isSubmitting
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Pengguna"}
          </button>
        </div>
      </form>
    </AppModal>
  );
}
