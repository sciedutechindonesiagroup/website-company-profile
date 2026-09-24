# PT Diratama Mapan Sejahtera — Revision Log Phase 1

## Baseline
- Visual/section structure: project versi lama
- CMS/Firestore/Admin: project terbaru
- Client revisions: WhatsApp screenshots provided 22 Sep 2026

## Implemented in Phase 1 — Home
- Hero subtitle changed from `KONTRAKTOR TERPERCAYA` to `SOLUSI TEPAT KEBUTUHAN ANDA`.
- Hero description updated to the client-approved wording about Jasa Konstruksi, Penyedia Tenaga Kerja, and Pengadaan Barang.
- Hero bottom USP/statistics bar removed from public Home.
- Nilai Perusahaan eyebrow removed from public Home.
- Nilai Perusahaan bottom banner removed from public Home.
- Home Layanan eyebrow `LAYANAN UTAMA` removed.
- Home Layanan order changed to:
  1. Jasa Konstruksi
  2. Penyedia Tenaga Kerja
  3. Pengadaan Barang
- `Lihat Detail` buttons removed from all Home service cards.
- Home Work Experience eyebrow removed; section and dynamic portfolio container retained.
- Home Final CTA eyebrow removed.
- Home Final CTA feature strip removed; CTA button remains.

## Admin alignment
- Removed obsolete public-only Home controls for USP/statistics/motto and CTA feature strip.
- Home service admin labels reordered to match the final public order while preserving existing Firestore field IDs for compatibility.
- Hero subtitle placeholder updated to the new approved copy.

## Data compatibility
- Existing Firestore Home documents containing the old Hero subtitle/description are normalized at render time to the new approved copy. Admin edits can still override the content.
- Existing Firestore service fields keep their original IDs (`srv_1`, `srv_2`, `srv_3`), while the public Home maps them to the new visual order.

## Not changed yet
- The exact placement/implementation of the requested `Solusi Terintegrasi untuk Pertumbuhan Anda` second slide is intentionally left for the next Home subsection pass because the screenshots indicate a structural/slide placement change that should be reconciled with the existing component structure before implementation.
- About, Services, Clients, Work Experience, Footer, legal document layout, and responsive refinements are scheduled for the next phases.
