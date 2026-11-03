import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F0FDF4] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[24px] border-[3px] border-[#134E4A] bg-white p-6 sm:p-10 shadow-[4px_4px_0px_#134E4A]">
          {/* Header */}
          <div className="border-b-[3px] border-[#134E4A]/15 pb-6 mb-6">
            <span className="inline-block rounded-full border-2 border-[#134E4A] bg-[#CCFBF1] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#134E4A] shadow-[2px_2px_0px_#134E4A] mb-3">
              Tartila Legal
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-[#134E4A] tracking-tight">
              Kebijakan Privasi
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-[#134E4A]/70">
              Terakhir diperbarui: 3 November 2026
            </p>
          </div>

          {/* Isi Kebijakan Privasi */}
          <div className="space-y-6 font-sans text-sm sm:text-base text-[#134E4A] leading-relaxed">
            <p>
              Selamat datang di Tartila. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi seluruh santri dan pengguna aplikasi kami melalui kebijakan yang transparan, aman, dan ramah anak.
            </p>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                1. Data yang Dikumpulkan
              </h2>
              <p className="mb-2">
                Kami hanya mengumpulkan informasi yang diperlukan untuk mendukung proses pembelajaran:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base pl-2">
                <li>
                  <strong>Informasi Akun:</strong> Nama dan alamat email saat Anda masuk menggunakan Google Login.
                </li>
                <li>
                  <strong>Progres Belajar:</strong> Poin pengalaman (XP), koin virtual, tingkat jilid Tilawati, skor game, dan catatan latihan harakat atau huruf hijaiyah.
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                2. Penggunaan Data
              </h2>
              <p className="mb-2">Data Anda digunakan secara eksklusif untuk:</p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base pl-2">
                <li>Menyimpan progres pembelajaran agar tidak hilang saat berganti perangkat.</li>
                <li>Menampilkan papan peringkat santri (leaderboard) secara sehat dan suportif.</li>
                <li>Menyesuaikan tingkat kesulitan dan rekomendasi materi belajar secara adaptif.</li>
              </ul>
              <p className="mt-3 text-xs sm:text-sm font-bold text-[#0D9488]">
                Tartila bebas dari iklan komersial pihak ketiga. Data anak tidak pernah digunakan untuk kebutuhan periklanan atau profiling komersial.
              </p>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                3. Keamanan & Kerahasiaan Data
              </h2>
              <p>
                Data disimpan dalam infrastruktur terenkripsi dengan pembatasan hak akses yang ketat (Row Level Security). Kami tidak pernah menjual, menyewakan, atau membagikan informasi pribadi santri kepada pihak ketiga manapun.
              </p>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                4. Hak Orang Tua & Pengguna
              </h2>
              <p>
                Orang tua, wali santri, atau pengguna berhak untuk memeriksa, memperbarui, atau meminta penghapusan permanen akun beserta seluruh data riwayat belajar yang tersimpan kapan saja tanpa dipungut biaya.
              </p>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                5. Kontak & Bantuan
              </h2>
              <p>
                Apabila Anda memiliki pertanyaan, saran, atau permohonan penghapusan data akun, silakan hubungi kami melalui:
              </p>
              <p className="mt-2 font-black text-[#0D9488]">
                Email:{" "}
                <a
                  href="mailto:albetsurya66@gmail.com"
                  className="underline hover:text-[#0F766E]"
                >
                  albetsurya66@gmail.com
                </a>
              </p>
            </section>
          </div>

          {/* Tombol Kembali */}
          <div className="mt-8 pt-6 border-t-[3px] border-[#134E4A]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] px-6 py-3 font-display text-sm font-black text-[#134E4A] shadow-[4px_4px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Kembali ke Beranda</span>
            </Link>

            <Link
              to="/terms"
              className="text-xs font-bold text-[#0D9488] underline hover:text-[#0F766E]"
            >
              Lihat Syarat & Ketentuan Layanan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
