# Database Migration Drift (Cloud vs Local)

**Status:** Pending (Tunda)

**Masalah:** Riwayat migrasi di Supabase Cloud (csxprjdlljynlqzcvvbi) 
berbeda dengan folder lokal `supabase/migrations/`. Ada migrasi lama 
(seperti 012) yang ada di cloud tapi sudah dihapus di lokal.

**Dampak:** `supabase db push` akan gagal di masa depan.

**Solusi (Saat Dibutuhkan):** Lakukan backup database cloud, jalankan 
`supabase db pull` untuk menyamakan state lokal dengan cloud, lalu commit 
file migrasi baru tersebut.