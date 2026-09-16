# Product Requirements Document (PRD)

**Proyek:** Pengembangan Website Company Profile PT Diratama Mapan Sejahtera
**Klien:** PT Diratama Mapan Sejahtera
**Pengembang:** Sciedutech Indonesia Group (Muhammad Rizky Ashdaqofillah)
**Tanggal Dokumen:** 14 September 2026
**Target Peluncuran (Go-Live):** 10 Oktober 2026

---

## 1. Project Overview
PT Diratama Mapan Sejahtera adalah perusahaan yang bergerak di bidang jasa penyedia tenaga kerja, kontraktor, dan pengadaan barang[cite: 1]. Proyek ini bertujuan untuk membangun *website company profile* yang berfungsi sebagai wajah digital profesional perusahaan. 

**Tujuan Utama (Conversion Goals):**
*   **Branding & Profesionalisme:** Memberikan kesan mapan dan tepercaya bagi publik dan calon mitra B2B.
*   **Etalase Portofolio:** Menampilkan rekam jejak proyek dan daftar klien besar secara terstruktur.
*   **Fokus Layanan:** Mendorong visibilitas pada sektor *manpower* (Outsourcing) dan pengadaan barang (Supplier), serta ekspansi terbaru di bidang Jasa Konstruksi[cite: 1].

---

## 2. Tech Stack & Ekosistem Eksternal
*   **Frontend:** HTML, CSS, JavaScript dengan opsi *framework* berbasis komponen (misal: React.js atau Next.js) untuk mendukung transisi dinamis.
*   **Backend & Database:** Node.js dan database (Firebase atau SQL) khusus untuk mengelola modul CMS pada halaman Portofolio/Work Experience.
*   **Domain:** Menggunakan ekstensi `.com`.
*   **Email Operasional:** Tetap menggunakan email *default* saat ini: `ptdiratamamapansejahtera@gmail.com`[cite: 1].
*   **Bahasa Utama:** Bahasa Indonesia.

---

## 3. Sitemap & Information Architecture
Struktur navigasi utama (Navbar) terdiri dari 5 menu utama dan 1 aksi:
1.  **Beranda (Home):** Ringkasan layanan, profil singkat, *highlight* portofolio, dan *marquee* logo klien.
2.  **Tentang Kami (About Us):** Penjabaran Visi, Misi, Nilai Perusahaan, Keunggulan, dan informasi Legalitas (NIB, NPWP, SBU-JK, GAPENSI)[cite: 1].
3.  **Layanan (Services):** Detail komprehensif menggunakan *Z-Pattern layout* untuk layanan Outsourcing Service, General Contractor, dan Supplier[cite: 1].
4.  **Work Experience:** Galeri portofolio proyek dinamis (terintegrasi CMS) dengan fitur filter kategori.
5.  **Klien:** *Showcase* logo-logo klien besar seperti Agristar, JIIPE, J&T Cargo[cite: 1], untuk menumbuhkan *trust* B2B.
6.  **CTA Button:** "Hubungi Kami" (Terhubung ke *section* kontak atau langsung ke WhatsApp).

---

## 4. UI/UX Design Guidelines
Konsep desain: **Modern Industrial Corporate**—menggabungkan kebersihan korporat modern dengan ketegasan industri konstruksi.

### A. Palet Warna (Color Scheme)
*   **Primer (Biru Navy):** Kesan profesional dan kokoh. Digunakan pada teks judul, latar *footer*, dan elemen struktural utama[cite: 1].
*   **Aksen (Kuning/Emas):** Digunakan untuk tombol *Call-to-Action* (CTA), garis bawah (*underline*), dan ikon[cite: 1].
*   **Background (Putih & Abu-abu Terang #F8F9FA):** Menjaga *clean layout* dan memberikan *white space*.

### B. Geometri & Interaksi Visual
*   **Bentuk (Shape):** Mengadopsi bentuk heksagon logo perusahaan[cite: 1]. Elemen *card*, foto, dan tombol menggunakan **sudut tajam/bersiku (border-radius: 0px)**.
*   **Efek Interaksi (Hover):** Menampilkan *drop shadow* terangkat atau aksen garis bawah Kuning.
*   **Navigasi:** *Sticky Navbar* transparan di atas, berubah menjadi latar putih saat pengguna melakukan *scroll*.

---

## 5. Functional Requirements (Fitur Dinamis)
### A. Modul Content Management System (CMS) - Work Experience
*   **Fungsi:** Tim internal dapat menambah, mengedit, atau menghapus data proyek dan foto secara mandiri.
*   **Batasan:** Tidak ada fitur pendaftaran akun publik. Fitur unggah CV pada divisi *Outsourcing* tidak diaktifkan pada rilis awal ini.

---

## 6. Draft Database Schema (Work Experience / Portofolio)

**Tabel `categories`**
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto-increment |
| `category_name` | VARCHAR | Misal: "Jasa Konstruksi", "Pengadaan Barang" |

**Tabel `projects`**
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto-increment |
| `title` | VARCHAR | Nama proyek (Misal: Pembangunan Gudang) |
| `client_name` | VARCHAR | Nama klien/mitra (Misal: PT Bumimulia)[cite: 1] |
| `category_id` | INT (FK) | Relasi ke tabel `categories` |
| `location` | VARCHAR | Lokasi proyek dikerjakan |
| `description` | TEXT | Rincian pengerjaan / ringkasan proyek |
| `completion_date`| DATE | Waktu proyek diselesaikan |
| `thumbnail_url` | VARCHAR | Path/URL foto utama untuk *grid gallery* |
| `gallery_urls` | JSON / ARRAY | Kumpulan URL foto detail pengerjaan (opsional) |
| `created_at` | TIMESTAMP | Waktu unggah otomatis |