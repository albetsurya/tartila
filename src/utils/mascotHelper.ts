import {
  MASCOT_NAME,
  MASCOT_BOY_NAME,
  MASCOT_GIRL_NAME,
  MASCOT_STORAGE_KEY,
} from "@/constants/mascot";

export type MascotGender = "boy" | "girl" | "neutral" | string | null | undefined;

/**
 * Resolves any gender string or economy store value into either 'boy' or 'girl'.
 * Default fallback is 'boy' (Tito).
 */
export function resolveMascotGender(gender?: MascotGender): "boy" | "girl" {
  if (!gender) return "boy";
  const g = String(gender).toLowerCase().trim();
  if (
    g === "girl" ||
    g === "female" ||
    g === "p" ||
    g === "perempuan" ||
    g === "wanita" ||
    g === "tila" ||
    g === "betina"
  ) {
    return "girl";
  }
  return "boy";
}

/**
 * Mengembalikan nama maskot resmi:
 * - "Tito" untuk santri putra (boy)
 * - "Tila" untuk santri putri (girl)
 */
export function getMascotName(gender?: MascotGender): string {
  const resolved = resolveMascotGender(gender);
  return resolved === "girl" ? MASCOT_GIRL_NAME : MASCOT_BOY_NAME;
}

/**
 * Mengembalikan label lengkap nama maskot dan karakter:
 * - "Tito (Putra)" untuk santri putra (boy)
 * - "Tila (Putri)" untuk santri putri (girl)
 */
export function getMascotFullLabel(gender?: MascotGender): string {
  const resolved = resolveMascotGender(gender);
  return resolved === "girl"
    ? `${MASCOT_GIRL_NAME} (Putri)`
    : `${MASCOT_BOY_NAME} (Putra)`;
}

export type MascotAccessory =
  | "none"
  | "peci"
  | "hairbow"
  | "flowercrown"
  | "glasses"
  | "crown";

/**
 * Validasi tegas apakah suatu aksesoris diperbolehkan untuk karakter tertentu:
 * - Tito (Santri Putra / Boy): 'peci', 'glasses', 'crown', 'none'
 * - Tila (Santri Putri / Girl): 'hairbow', 'flowercrown', 'glasses', 'crown', 'none'
 */
export function isAccessoryAllowedForGender(
  accessory: MascotAccessory | string | undefined | null,
  gender: "boy" | "girl",
): boolean {
  if (!accessory || accessory === "none") return true;
  if (gender === "boy") {
    // Tito Santri Putra dilarang memakai pita rambut atau mahkota bunga
    return (
      accessory === "peci" || accessory === "glasses" || accessory === "crown"
    );
  }
  if (gender === "girl") {
    // Tila Santri Putri dilarang memakai peci songkok santri putra
    return (
      accessory === "hairbow" ||
      accessory === "flowercrown" ||
      accessory === "glasses" ||
      accessory === "crown"
    );
  }
  return true;
}

/**
 * Aksesoris khas default untuk masing-masing gender:
 * - Tito Putra -> 'peci'
 * - Tila Putri -> 'hairbow'
 */
export function getDefaultAccessoryForGender(
  gender: "boy" | "girl",
): MascotAccessory {
  return gender === "boy" ? "peci" : "hairbow";
}

/**
 * Sinkronisasi otomatis aksesoris agar sesuai dengan gender maskot:
 * Jika Tila Putri (girl) dipasangi 'peci', otomatis dialihkan ke 'hairbow'.
 * Jika Tito Putra (boy) dipasangi 'hairbow' atau 'flowercrown', otomatis dialihkan ke 'peci'.
 */
export function resolveAccessoryForGender(
  accessory: MascotAccessory | string | undefined | null,
  gender: "boy" | "girl",
): MascotAccessory {
  if (!accessory || accessory === "none") return "none";
  if (isAccessoryAllowedForGender(accessory, gender)) {
    return accessory as MascotAccessory;
  }
  return getDefaultAccessoryForGender(gender);
}
