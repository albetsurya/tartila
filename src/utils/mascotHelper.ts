export type MascotGender = "boy" | "girl" | "neutral" | string | null | undefined;

/**
 * Resolves any gender string or economy store value into either 'boy' or 'girl'.
 * Default fallback is always 'girl' (Tila).
 */
export function resolveMascotGender(gender?: MascotGender): "boy" | "girl" {
  if (!gender) return "girl";
  const g = String(gender).toLowerCase().trim();
  if (
    g === "boy" ||
    g === "male" ||
    g === "l" ||
    g === "laki-laki" ||
    g === "pria" ||
    g === "tito"
  ) {
    return "boy";
  }
  return "girl";
}

/**
 * Mengembalikan nama maskot yang sesuai berdasarkan gender:
 * - 'boy' / 'male' / 'L' -> "Tito"
 * - 'girl' / 'female' / default -> "Tila"
 */
export function getMascotName(gender?: MascotGender): string {
  return resolveMascotGender(gender) === "boy" ? "Tito" : "Tila";
}

export type MascotAccessory =
  | "none"
  | "peci"
  | "hairbow"
  | "flowercrown"
  | "glasses"
  | "crown";

/**
 * Validasi tegas apakah suatu aksesoris diperbolehkan untuk gender tertentu:
 * - Jantan (Tito / Boy): 'peci', 'glasses', 'crown', 'none'
 * - Betina (Tila / Girl): 'hairbow', 'flowercrown', 'glasses', 'crown', 'none'
 */
export function isAccessoryAllowedForGender(
  accessory: MascotAccessory | string | undefined | null,
  gender: "boy" | "girl",
): boolean {
  if (!accessory || accessory === "none") return true;
  if (gender === "boy") {
    // Tito dilarang memakai pita rambut atau mahkota bunga
    return (
      accessory === "peci" || accessory === "glasses" || accessory === "crown"
    );
  }
  if (gender === "girl") {
    // Tila dilarang memakai peci songkok santri putra
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
 * - Tito -> 'peci'
 * - Tila -> 'hairbow'
 */
export function getDefaultAccessoryForGender(
  gender: "boy" | "girl",
): MascotAccessory {
  return gender === "boy" ? "peci" : "hairbow";
}

/**
 * Sinkronisasi otomatis aksesoris agar sesuai dengan gender maskot:
 * Jika Tila (girl) dipasangi 'peci', otomatis dialihkan ke 'hairbow'.
 * Jika Tito (boy) dipasangi 'hairbow' atau 'flowercrown', otomatis dialihkan ke 'peci'.
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
