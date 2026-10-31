import { useNgajiCeriaStore, NgajiCeriaState } from "./useNgajiCeriaStore";
import { TilawatiJilid } from "../data/tilawati";

export function useNgajiCeriaProgress(_jilidData?: TilawatiJilid[]) {
  const stars = useNgajiCeriaStore((state: NgajiCeriaState) => state.stars);

  const completedPages = Object.values(stars).filter((s) => (s || 0) === 3).length;
  const totalHalaman = 6 * 44;
  const progressPercentage =
    totalHalaman === 0 ? 0 : Math.round((completedPages / totalHalaman) * 100);

  let currentJilidStr = "jilid-1";
  let currentPageNum = 1;

  outerLoop: for (let j = 1; j <= 6; j++) {
    for (let p = 1; p <= 44; p++) {
      const key = `jilid-${j}-hal-${p}`;
      if ((stars[key] || 0) < 3) {
        currentJilidStr = `jilid-${j}`;
        currentPageNum = p;
        break outerLoop;
      }
    }
  }

  return {
    currentJilid: currentJilidStr,
    currentPage: currentPageNum,
    totalJilid: 6,
    totalHalaman,
    progressPercentage,
  };
}
