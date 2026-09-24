# Dokumentasi Database Firestore & Media - PT Diratama Mapan Sejahtera

## 1. Collection: `settings`
Koleksi untuk menyimpan pengaturan global website (Kustomisasi Navigasi & Footer).

### Document ID: `general`

| Field ID (Key) | Tipe Data | Deskripsi / Fungsi di UI | Contoh Data (Default) |
| :--- | :--- | :--- | :--- |
| `logo_url` | String (URL) | URL logo utama (Navigasi) dari Cloudinary | `https://res.cloudinary.com/diratama/image/upload/v1/logo-utama.png` |
| `logo_footer_url` | String (URL) | URL logo putih (Footer) dari Cloudinary | `https://res.cloudinary.com/diratama/image/upload/v1/logo-putih.png` |
| `company_name` | String | Nama perusahaan (Teks logo navbar) | `DIRATAMA MAPAN` |
| `tagline` | String | Moto singkat logo | `SEJAHTERA` |
| `company_desc` | String | Deskripsi perusahaan di Footer | `PT Diratama Mapan Sejahtera merupakan...` |
| `footer_motto` | String | Teks kotak ornamen Footer | `SOLUSI KONSTRUKSI UNTUK NEGERI` |
| `contact_wa` | String | Nomor universal WhatsApp | `6281234567890` |
| `contact_email` | String | Alamat email perusahaan | `ptdiratamamapansejahtera@gmail.com` |
| `contact_address` | String | Alamat fisik kantor | `Pondok Permata Suci Blok C No. 12...` |
| `socmed_linkedin`| String (URL) | Link LinkedIn perusahaan | `https://linkedin.com/company/...` |
| `socmed_ig` | String (URL) | Link Instagram perusahaan | `https://instagram.com/...` |
| `socmed_youtube` | String (URL) | Link YouTube perusahaan | `https://youtube.com/...` |
| `legal_nib` | String | Nomor NIB | `1234567890123` |
| `legal_npwp` | String | Nomor NPWP | `12.345.678.9-012.000` |
| `legal_sbujk` | String | Nomor SBU-JK | `0-1234-56-789012-3` |
| `updated_at` | Timestamp | Waktu terakhir update | `2026-09-19T13:20:59Z` |