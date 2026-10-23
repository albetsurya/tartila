/** Kode join kelas: algoritma murni agar mudah diuji di luar Supabase. */

export const JOIN_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const JOIN_CODE_LENGTH = 6;

/** Kode join 6 karakter (huruf besar-angka, tanpa karakter mudah tertukar). */
export function generateJoinCode(random: () => number = Math.random): string {
  let code = '';
  for (let i = 0; i < JOIN_CODE_LENGTH; i += 1) {
    code += JOIN_CODE_ALPHABET[Math.floor(random() * JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

/** Kode yang diinput murid dibersihkan: kapital, tanpa pemisah. */
export function normalizeJoinCode(rawInput: string): string {
  return rawInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}
