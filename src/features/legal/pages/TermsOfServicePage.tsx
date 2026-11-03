import { Link } from "react-router-dom";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F0FDF4] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[24px] border-[3px] border-[#134E4A] bg-white p-6 sm:p-10 shadow-[4px_4px_0px_#134E4A]">
          {/* Header */}
          <div className="border-b-[3px] border-[#134E4A]/15 pb-6 mb-6">
            <span className="inline-block rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#134E4A] shadow-[2px_2px_0px_#134E4A] mb-3">
              Tartila Legal
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-[#134E4A] tracking-tight">
              Syarat & Ketentuan Layanan
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-[#134E4A]/70">
              Terakhir diperbarui: 3 November 2026
            </p>
          </div>

          {/* Isi Syarat dan Ketentuan */}
          <div className="space-y-6 font-sans text-sm sm:text-base text-[#134E4A] leading-relaxed">
            <p>
              Selamat datang di Tartila. Dokumen ini memuat syarat dan ketentuan penggunaan platform edukasi mengaji berbasis metode Tilawati.
            </p>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                1. Penerimaan Ketentuan
              </h2>
              <p>
                Dengan mengakses atau menggunakan aplikasi Tartila, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui sebagian atau seluruh ketentuan ini, Anda dipersilakan untuk tidak menggunakan aplikasi.
              </p>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                2. Penggunaan yang Wajar & Integritas Belajar
              </h2>
              <p className="mb-2">
                Tartila dirancang sebagai lingkungan pembelajaran Al-Qur'an yang aman, bermakna, dan suportif:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base pl-2">
                <li>Gunakan aplikasi semata-mata untuk tujuan pendidikan mengaji dan pembinaan keagamaan.</li>
                <li>Dilarang keras melakukan kecurangan (cheat), manipulasi skor/XP, eksploitasi celah keamanan, atau serangan teknis yang merugikan stabilitas sistem dan santri lain.</li>
                <li>Dilarang mengunggah atau menyebarkan konten yang melanggar hukum, norma kesopanan, atau hak cipta.</li>
              </ul>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                3. Kepemilikan Akun & Pengawasan Anak
              </h2>
              <p className="mb-2">
                Setiap akun bersifat pribadi dan pengguna bertanggung jawab penuh atas keamanan kredensial akun masing-masing:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base pl-2">
                <li>Pengguna usia anak-anak disarankan menggunakan aplikasi di bawah pengawasan dan bimbingan orang tua, wali, atau ustadz/ustadzah.</li>
                <li>Tartila berhak menangguhkan akun yang terbukti melanggar aturan integritas platform.</li>
              </ul>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                4. Perubahan & Pembaruan Layanan
              </h2>
              <p>
                Kami terus mengembangkan kurikulum, permainan, dan fitur pendukung pembelajaran santri. Tartila berhak memperbarui, mengubah, atau menyempurnakan fitur aplikasi dari waktu ke waktu demi pengalaman belajar yang lebih berkualitas.
              </p>
            </section>

            <section className="rounded-2xl border-2 border-[#134E4A]/20 bg-[#F8FAFC] p-4 sm:p-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#134E4A] mb-2">
                5. Kontak & Bantuan
              </h2>
              <p>
                Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan Layanan ini, silakan hubungi tim kami melalui:
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
              to="/privacy"
              className="text-xs font-bold text-[#0D9488] underline hover:text-[#0F766E]"
            >
              Lihat Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
