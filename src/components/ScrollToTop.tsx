import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Memaksa window untuk scroll ke paling atas setiap kali pathname berubah
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Gunakan "smooth" jika ingin efek animasi
    });

    // Cek custom scroll container jika ada
    const el = document.getElementById("main-scroll-container");
    if (el) {
      el.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
