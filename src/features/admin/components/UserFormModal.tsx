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
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  INPUT,
  LABEL,
  SELECT,
} from "../styles";

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
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-black text-[#FF6B6B]">
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
      <p className="mb-4 text-xs font-bold text-[#134E4A]/70">
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
            className={INPUT}
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
              className={INPUT}
            />
          </Field>
          <Field id="user-email" label="Email" error={errors.email}>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className={INPUT}
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
                className={SELECT}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#134E4A]"
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
                className={SELECT}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#134E4A]"
              />
            </div>
          </Field>
        </div>

        {submitError ? (
          <div
            role="alert"
            className="rounded-xl border-[2.5px] border-[#134E4A] bg-[#FF6B6B]/15 px-3 py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={BTN_SECONDARY}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={`${BTN_PRIMARY} min-w-[176px]`}
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
