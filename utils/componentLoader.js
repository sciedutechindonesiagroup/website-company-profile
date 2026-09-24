/* =========================================================
   PT DIRATAMA MAPAN SEJAHTERA
   COMPONENT LOADER
   SPA ROUTER
   ========================================================= */


/* =========================================================
   1. ROUTES
   ========================================================= */

const routes = {

    home:
        "components/home/home.html",

    about:
        "components/about/about.html",

    services:
        "components/services/services.html",

    work:
        "components/work-experience/work-experience.html",

    clients:
        "components/clients/clients.html"

};



/* =========================================================
   2. LOAD PAGE
   ========================================================= */

async function loadPage(page) {

    const appContent =
        document.getElementById(
            "app-content"
        );


    if (!appContent) {

        console.error(
            "Element #app-content tidak ditemukan."
        );

        return;

    }


    if (!routes[page]) {

        appContent.innerHTML = `

            <div
                style="
                    padding:150px 5%;
                    text-align:center;
                    color:var(--navy);
                "
            >

                <h2>
                    404 - Halaman Tidak Ditemukan
                </h2>

            </div>

        `;

        return;

    }


    try {

        /* ---------------------------------------------
           CLEANUP HERO SLIDER
           --------------------------------------------- */

        if (
            typeof window.homeSliderCleanup ===
            "function"
        ) {

            window.homeSliderCleanup();

        }


        /* ---------------------------------------------
           FETCH COMPONENT
           --------------------------------------------- */

        const response =
            await fetch(
                routes[page],
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const html =
            await response.text();


        /* ---------------------------------------------
           INJECT HTML
           --------------------------------------------- */

        appContent.innerHTML =
            html;


        /* ---------------------------------------------
           ACTIVE NAV
           --------------------------------------------- */

        updateActiveNav(page);


        /* ---------------------------------------------
           PAGE SPECIFIC INITIALIZATION
           --------------------------------------------- */

        if (
            page === "home"
        ) {

            window.initHomeSlider?.();

        }


        if (
            page === "work"
        ) {

            initPortfolioFilter();

        }


        /* ---------------------------------------------
           REFRESH MOTION SYSTEM
           --------------------------------------------- */

        requestAnimationFrame(() => {

            window.refreshPageAnimations?.(
                appContent
            );

        });


        /* ---------------------------------------------
           CLOSE MOBILE MENU
           --------------------------------------------- */

        const mobileMenu =
            document.getElementById(
                "mobile-menu"
            );


        if (
            mobileMenu &&
            mobileMenu.classList.contains("open")
        ) {

            mobileMenu.classList.remove(
                "open"
            );

            document.body.style.overflow =
                "auto";

        }


        /* ---------------------------------------------
           UPDATE URL HASH
           --------------------------------------------- */

        if (
            window.location.hash !==
            `#${page}`
        ) {

            history.replaceState(
                null,
                "",
                `#${page}`
            );

        }


        /* ---------------------------------------------
           SCROLL TOP
           --------------------------------------------- */

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


        /* ---------------------------------------------
           PAGE LOADED EVENT
           MAIN.JS WILL CATCH THIS
           --------------------------------------------- */

        window.dispatchEvent(

            new CustomEvent(
                "page:loaded",
                {
                    detail: {
                        page
                    }
                }
            )

        );


    } catch (error) {

        console.error(
            "Gagal memuat halaman:",
            error
        );


        appContent.innerHTML = `

            <div
                style="
                    padding:150px 5%;
                    text-align:center;
                    color:var(--navy);
                "
            >

                <h2>
                    Gagal memuat halaman.
                </h2>

                <p>
                    Jalankan website menggunakan
                    Local Server seperti Live Server.
                </p>

            </div>

        `;

    }

}



/* =========================================================
   3. ACTIVE NAVIGATION
   ========================================================= */

function updateActiveNav(page) {

    /* Desktop */

    const desktopLinks =
        document.querySelectorAll(
            ".desktop-nav .nav-link"
        );


    desktopLinks.forEach((link) => {

        link.classList.remove(
            "active"
        );


        const onclick =
            link.getAttribute(
                "onclick"
            ) || "";


        if (
            onclick.includes(
                `'${page}'`
            )
        ) {

            link.classList.add(
                "active"
            );

        }

    });


    /* Mobile */

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-nav .nav-link-mobile"
        );


    mobileLinks.forEach((link) => {

        link.classList.remove(
            "active"
        );


        const onclick =
            link.getAttribute(
                "onclick"
            ) || "";


        if (
            onclick.includes(
                `'${page}'`
            )
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}



/* =========================================================
   4. HERO SLIDER
   Single source of truth
   ========================================================= */

function initHomeSlider() {

    /* Cleanup previous slider */

    if (
        typeof window.homeSliderCleanup ===
        "function"
    ) {

        window.homeSliderCleanup();

    }


    const slides =
        document.querySelectorAll(
            "#bg-slider .slide"
        );


    const slideNumbers =
        document.querySelectorAll(
            "#slide-numbers li"
        );


    const progressBar =
        document.getElementById(
            "progress"
        );


    if (
        slides.length === 0 ||
        slideNumbers.length === 0
    ) {

        return;

    }


    let currentSlide = 0;


    const totalSlides =
        slides.length;


    let intervalId = null;


    function changeSlide(index) {

        slides.forEach(
            (slide) => {

                slide.classList.remove(
                    "active"
                );

            }
        );


        slideNumbers.forEach(
            (item) => {

                item.classList.remove(
                    "active"
                );

            }
        );


        slides[index].classList.add(
            "active"
        );


        slideNumbers[index].classList.add(
            "active"
        );


        if (progressBar) {

            progressBar.style.height =
                `${
                    ((index + 1) /
                    totalSlides) *
                    100
                }%`;

        }

    }


    function startAutoSlide() {

        if (intervalId) {

            clearInterval(
                intervalId
            );

        }


        intervalId =
            setInterval(() => {

                currentSlide =
                    (
                        currentSlide + 1
                    ) %
                    totalSlides;


                changeSlide(
                    currentSlide
                );

            }, 6000);

    }


    function stopAutoSlide() {

        if (intervalId) {

            clearInterval(
                intervalId
            );

            intervalId = null;

        }

    }


    const numberHandlers = [];


    slideNumbers.forEach(
        (item, index) => {

            const handler = () => {

                currentSlide =
                    index;


                changeSlide(
                    currentSlide
                );


                startAutoSlide();

            };


            item.addEventListener(
                "click",
                handler
            );


            numberHandlers.push({
                item,
                handler
            });

        }
    );


    changeSlide(
        currentSlide
    );


    startAutoSlide();


    /* Pause on hover */

    const hero =
        document.getElementById(
            "hero"
        );


    if (hero) {

        hero.addEventListener(
            "mouseenter",
            stopAutoSlide
        );


        hero.addEventListener(
            "mouseleave",
            startAutoSlide
        );

    }


    /* Cleanup function */

    window.homeSliderCleanup =
        () => {

            stopAutoSlide();


            numberHandlers.forEach(
                ({
                    item,
                    handler
                }) => {

                    item.removeEventListener(
                        "click",
                        handler
                    );

                }
            );

        };

}



/* =========================================================
   5. PORTFOLIO FILTER
   ========================================================= */

function initPortfolioFilter() {

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const cards =
        document.querySelectorAll(
            ".port-card-v2"
        );


    if (
        filterButtons.length === 0 ||
        cards.length === 0
    ) {

        return;

    }


    filterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.getAttribute(
                            "data-filter"
                        );


                    cards.forEach(
                        (card) => {

                            const category =
                                card.getAttribute(
                                    "data-category"
                                );


                            if (
                                filter ===
                                "all" ||
                                category ===
                                filter
                            ) {

                                card.classList.remove(
                                    "hidden"
                                );

                            } else {

                                card.classList.add(
                                    "hidden"
                                );

                            }

                        }
                    );


                    window.refreshPageAnimations?.(
                        document.getElementById(
                            "app-content"
                        )
                    );

                }
            );

        }
    );

}



/* =========================================================
   6. GLOBAL
   ========================================================= */

window.loadPage =
    loadPage;


window.initHomeSlider =
    initHomeSlider;



/* =========================================================
   7. INITIAL PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPage(
            "home"
        );

    }
);