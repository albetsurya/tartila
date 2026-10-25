export const DAILY_RESET_HOUR_WIB = 4;

/**
 * Mengembalikan tanggal aktifitas (YYYY-MM-DD) berbasis zona waktu WIB (UTC+7)
 * dengan patokan reset harian pukul 04:00 Pagi WIB.
 * Sebelum jam 04:00 WIB, hari dianggap masih hari sebelumnya (-4 jam).
 */
export function activityDate(date = new Date()): string {
  // WIB adalah UTC+7. Dengan reset jam 04:00 pagi, waktu efektif digeser -4 jam dari WIB.
  // Net offset dari UTC adalah: +7 - 4 = +3 jam.
  const effective = new Date(date.getTime() + 3 * 3600 * 1000);
  return effective.toISOString().slice(0, 10);
}

/**
 * Mengembalikan tanggal aktifitas kemarin berdasarkan patokan reset 04:00 WIB.
 */
export function yesterdayActivityDate(date = new Date()): string {
  const effective = new Date(date.getTime() + 3 * 3600 * 1000 - 24 * 3600 * 1000);
  return effective.toISOString().slice(0, 10);
}

/**
 * Menghitung sisa waktu menuju jam 04:00 Pagi WIB berikutnya.
 */
export function getTimeUntilDailyResetWib(now = new Date()): {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const wibTime = new Date(now.getTime() + 7 * 3600 * 1000);
  const year = wibTime.getUTCFullYear();
  const month = wibTime.getUTCMonth();
  const day = wibTime.getUTCDate();
  const hour = wibTime.getUTCHours();

  let targetDay = day;
  if (hour >= DAILY_RESET_HOUR_WIB) {
    targetDay += 1;
  }

  const targetUtcMs = Date.UTC(year, month, targetDay, DAILY_RESET_HOUR_WIB, 0, 0) - 7 * 3600 * 1000;
  const totalMs = Math.max(0, targetUtcMs - now.getTime());
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);

  const formatted = `${String(hours).padStart(2, "0")} Jam ${String(minutes).padStart(2, "0")} Menit`;
  return { totalMs, hours, minutes, seconds, formatted };
}
