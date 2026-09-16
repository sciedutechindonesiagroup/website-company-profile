/* =======================================================
   COMPONENT LOADER (VANILLA JS ROUTER)
   ======================================================= */

// 1. Daftar Rute (Pemetaan nama halaman ke file HTML-nya)
const routes = {
    'home': 'components/home/home.html',
    'about': 'components/about/about.html',
    'services': 'components/services/services.html',
    'work': 'components/work-experience/work-experience.html',
    'clients': 'components/clients/clients.html'
};

// 2. Fungsi Utama untuk Memuat Halaman
async function loadPage(page) {
    const appContent = document.getElementById('app-content');
    
    // Cek apakah rute/halaman terdaftar di konfigurasi
    if (!routes[page]) {
        appContent.innerHTML = '<div style="padding: 150px 5%; text-align: center;"><h2>404 - Halaman Tidak Ditemukan</h2></div>';
        return;
    }

    try {
        // (Opsional) Tampilkan teks loading saat proses fetch
        // appContent.innerHTML = '<div style="padding: 150px 5%; text-align: center;">Memuat halaman...</div>';

        // Ambil file HTML dari folder komponen
        const response = await fetch(routes[page]);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Masukkan HTML yang didapat ke dalam wadah <main>
        appContent.innerHTML = html;

        // 3. Update status menu aktif (Garis kuning bawah di Navbar)
        updateActiveNav(page);

        // 4. Inisialisasi ulang script khusus halaman tertentu
        if (page === 'home') {
            initHomeSlider(); // Panggil fungsi slider karena elemen HTML-nya baru saja dimuat
        }

        // 5. Tutup menu mobile otomatis jika navigasi dilakukan dari HP
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = "auto";
        }
        
        // 6. Scroll otomatis ke paling atas setiap ganti halaman
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Gagal memuat halaman:', error);
        appContent.innerHTML = `
            <div style="padding: 150px 5%; text-align: center; color: var(--navy);">
                <h2>Gagal memuat halaman.</h2>
                <p>Pastikan Anda menjalankan proyek ini melalui Local Server (misal: Live Server di VS Code), karena Fetch API tidak mendukung protokol file:// langsung.</p>
            </div>
        `;
    }
}

// Fungsi untuk memperbarui indikator menu aktif di Navbar
function updateActiveNav(page) {
    // Untuk Desktop
    const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
    desktopLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(page)) {
            link.classList.add('active');
        }
    });

    // Untuk Mobile
    const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link-mobile');
    mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(page)) {
            link.classList.add('active');
        }
    });
}

// ---------------------------------------------------------
// PENTING: Pindahkan logika Slider Hero dari main.js ke sini 
// atau buat fungsi global agar bisa dipanggil setelah HTML home dimuat.
// ---------------------------------------------------------
function initHomeSlider() {
    const slides = document.querySelectorAll(".slide");
    const slideNumbers = document.querySelectorAll("#slide-numbers li");
    const progressBar = document.getElementById("progress");
    
    if (slides.length === 0) return; // Keluar jika elemen tidak ditemukan

    let currentSlide = 0;
    const totalSlides = slides.length;

    const changeSlide = (index) => {
        slides.forEach(slide => slide.classList.remove("active"));
        slideNumbers.forEach(num => num.classList.remove("active"));

        slides[index].classList.add("active");
        slideNumbers[index].classList.add("active");

        const progressPercent = ((index + 1) / totalSlides) * 100;
        progressBar.style.height = `${progressPercent}%`;
    };

    // Hapus interval lama jika ada, lalu buat yang baru
    if (window.autoSlideInterval) {
        clearInterval(window.autoSlideInterval);
    }
    
    window.autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        changeSlide(currentSlide);
    }, 5000);

    slideNumbers.forEach((item, index) => {
        item.addEventListener("click", () => {
            currentSlide = index;
            changeSlide(currentSlide);
            clearInterval(window.autoSlideInterval);
            window.autoSlideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                changeSlide(currentSlide);
            }, 5000);
        });
    });
}


// Fungsi Filter Portofolio (Halaman Work Experience)
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.port-card-v2');

    if (filterBtns.length === 0 || portfolioCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus class active dari semua tombol
            filterBtns.forEach(b => b.classList.remove('active'));
            // Tambahkan class active ke tombol yang diklik
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Loop kartu dan sembunyikan/tampilkan sesuai data-category
            portfolioCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Muat halaman Beranda ('home') secara default saat website pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
});