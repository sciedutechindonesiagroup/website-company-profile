document.addEventListener("DOMContentLoaded", () => {
    /* --- 1. NAVBAR SCROLL EFFECT --- */
    const navbar = document.getElementById("navbar");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    /* --- 2. MOBILE MENU TOGGLE --- */
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const closeBtn = document.getElementById("close-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    hamburgerBtn.addEventListener("click", () => {
        mobileMenu.classList.add("open");
        document.body.style.overflow = "hidden"; // Mencegah scroll body saat menu terbuka
    });

    closeBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "auto";
    });

    /* --- 3. HERO BACKGROUND SLIDER --- */
    const slides = document.querySelectorAll(".slide");
    const slideNumbers = document.querySelectorAll("#slide-numbers li");
    const progressBar = document.getElementById("progress");
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isScrolling = false; // Mencegah transisi bertumpuk

    // Fungsi untuk mengganti slide
    const changeSlide = (index) => {
        // Hapus kelas active dari semua
        slides.forEach(slide => slide.classList.remove("active"));
        slideNumbers.forEach(num => num.classList.remove("active"));

        // Tambahkan ke yang baru
        slides[index].classList.add("active");
        slideNumbers[index].classList.add("active");

        // Hitung persentase progress bar (Misal 1/6 = 16.6%)
        const progressPercent = ((index + 1) / totalSlides) * 100;
        progressBar.style.height = `${progressPercent}%`;
    };

    // Auto-play Slider (Ganti gambar setiap 5 detik)
    let autoSlide = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        changeSlide(currentSlide);
    }, 5000);

    // Navigasi Slider berdasarkan Klik Angka
    slideNumbers.forEach((item, index) => {
        item.addEventListener("click", () => {
            currentSlide = index;
            changeSlide(currentSlide);
            // Reset interval agar tidak langsung loncat setelah diklik
            clearInterval(autoSlide);
            autoSlide = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                changeSlide(currentSlide);
            }, 5000);
        });
    });

    /* Opsi Tambahan: Ganti slider dengan scroll mouse di area Hero */
    const heroSection = document.getElementById("hero");
    heroSection.addEventListener("wheel", (e) => {
        // Hanya memicu jika posisi scroll window paling atas
        if (window.scrollY === 0) { 
            if (isScrolling) return; // Debounce
            
            if (e.deltaY > 0 && currentSlide < totalSlides - 1) {
                // Scroll bawah
                e.preventDefault();
                currentSlide++;
                changeSlide(currentSlide);
                lockScroll();
            } else if (e.deltaY < 0 && currentSlide > 0) {
                // Scroll atas
                e.preventDefault();
                currentSlide--;
                changeSlide(currentSlide);
                lockScroll();
            }
        }
    }, { passive: false });

    // Fungsi delay untuk Wheel Scroll
    function lockScroll() {
        isScrolling = true;
        clearInterval(autoSlide); // Hentikan autoplay saat user interaksi manual
        setTimeout(() => {
            isScrolling = false;
        }, 1200); // 1.2 detik jeda antar scroll gambar
    }
});