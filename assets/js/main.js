/**
 * ============================================================================
 * PT DIRATAMA MAPAN SEJAHTERA
 * MAIN PUBLIC SCRIPT
 * FIREBASE DATA SYNCHRONIZATION
 * ============================================================================
 */


/* =========================================================
   1. FIREBASE
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyBypc8e3XTsYJYJCJ-aA3wn6P-AUNRBcrU",

    authDomain:
        "ptdiratamamapansejahtera-415b1.firebaseapp.com",

    projectId:
        "ptdiratamamapansejahtera-415b1",

    storageBucket:
        "ptdiratamamapansejahtera-415b1.firebasestorage.app",

    messagingSenderId:
        "493525992855",

    appId:
        "1:493525992855:web:31b52632a96c66a87870d2",

    measurementId:
        "G-Y5B5QF9QW5"

};


const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(
        app
    );


let cachedSettings = null;



/* =========================================================
   2. HELPERS
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element &&
        value !== undefined &&
        value !== null
    ) {

        element.textContent =
            value;

    }

}


function setHTML(
    id,
    value,
    lineBreak = false
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element &&
        value !== undefined &&
        value !== null
    ) {

        element.innerHTML =
            lineBreak
                ? String(
                    value
                ).replace(
                    /\n/g,
                    "<br>"
                )
                : value;

    }

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        (
            character
        ) => {

            const map = {

                "&":
                    "&amp;",

                "<":
                    "&lt;",

                ">":
                    "&gt;",

                '"':
                    "&quot;",

                "'":
                    "&#039;"

            };

            return map[
                character
            ];

        }
    );

}


function normalizeWhatsApp(
    value
) {

    return String(
        value ?? ""
    ).replace(
        /\D/g,
        ""
    );

}


function formatWhatsApp(
    value
) {

    const phone =
        normalizeWhatsApp(
            value
        );


    if (!phone) {

        return "";

    }


    return `+${phone}`;

}



function getEl(
    ...selectors
) {

    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {

            return element;

        }

    }


    return null;

}



function getAll(
    selector
) {

    return [
        ...document.querySelectorAll(
            selector
        )
    ];

}



/* =========================================================
   3. GLOBAL SETTINGS
   ========================================================= */

function applyGlobalSettings(
    data
) {

    if (!data) {

        return;

    }


    /* LOGO */

    if (
        data.logo_url
    ) {

        const navLogo =
            document.getElementById(
                "nav-logo-img"
            );


        const mobileLogo =
            document.getElementById(
                "mob-logo-img"
            );


        if (navLogo) {

            navLogo.src =
                data.logo_url;

        }


        if (mobileLogo) {

            mobileLogo.src =
                data.logo_url;

        }

    }


    /* COMPANY NAME */

    document
        .querySelectorAll(
            "#nav-company-name, #mob-company-name"
        )
        .forEach(
            (
                element
            ) => {

                if (
                    data.company_name
                ) {

                    element.textContent =
                        data.company_name;

                }

            }
        );


    /* TAGLINE */

    document
        .querySelectorAll(
            "#nav-company-tagline, #mob-company-tagline"
        )
        .forEach(
            (
                element
            ) => {

                if (
                    data.tagline
                ) {

                    element.textContent =
                        data.tagline;

                }

            }
        );


    /* WHATSAPP */

    if (
        data.contact_wa
    ) {

        const phone =
            normalizeWhatsApp(
                data.contact_wa
            );


        const waUrl =
            `https://wa.me/${phone}`;


        document
            .querySelectorAll(
                [
                    "#nav-contact-wa",
                    "#mob-contact-wa",
                    "#home-btn-wa",
                    "#home-btn-wa-1"
                ].join(", ")
            )
            .forEach(
                (
                    element
                ) => {

                    element.href =
                        waUrl;

                    element.target =
                        "_blank";

                    element.rel =
                        "noopener noreferrer";

                }
            );


        setText(
            "footer-contact-wa",
            formatWhatsApp(
                data.contact_wa
            )
        );

    }


    /* FOOTER LOGO */

    if (
        data.logo_footer_url
    ) {

        const footerLogo =
            document.getElementById(
                "footer-logo-img"
            );


        if (footerLogo) {

            footerLogo.src =
                data.logo_footer_url;

        }

    }


    /* FOOTER */

    if (
        data.company_desc
    ) {

        setText(
            "footer-company-desc",
            data.company_desc
        );

    }


    if (
        data.footer_motto
    ) {

        setHTML(
            "footer-motto-text",
            data.footer_motto,
            true
        );

    }


    if (
        data.contact_address
    ) {

        setHTML(
            "footer-contact-address",
            data.contact_address,
            true
        );

    }


    if (
        data.contact_email
    ) {

        setText(
            "footer-contact-email",
            data.contact_email
        );

    }


    if (
        data.socmed_linkedin
    ) {

        const element =
            document.getElementById(
                "footer-socmed-linkedin"
            );


        if (element) {

            element.href =
                data.socmed_linkedin;

        }

    }


    if (
        data.socmed_ig
    ) {

        const element =
            document.getElementById(
                "footer-socmed-ig"
            );


        if (element) {

            element.href =
                data.socmed_ig;

        }

    }


    if (
        data.legal_nib
    ) {

        setText(
            "footer-legal-nib",
            data.legal_nib
        );

    }


    if (
        data.legal_npwp
    ) {

        setText(
            "footer-legal-npwp",
            data.legal_npwp
        );

    }


    if (
        data.legal_sbujk
    ) {

        setText(
            "footer-legal-sbujk",
            data.legal_sbujk
        );

    }

}



async function syncGlobalSettings() {

    try {

        if (!cachedSettings) {

            const snapshot =
                await getDoc(
                    doc(
                        db,
                        "settings",
                        "general"
                    )
                );


            cachedSettings =
                snapshot.exists()
                    ? snapshot.data()
                    : {};

        }


        applyGlobalSettings(
            cachedSettings
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal menyinkronkan pengaturan global:",
            error
        );

    }

}



/* =========================================================
   4. HERO SLIDER
   ========================================================= */

let heroSliderTimer =
    null;



function initHeroSlider() {

    const sliderContainer =
        document.getElementById(
            "bg-slider"
        );


    if (!sliderContainer) {

        return;

    }


    const slides =
        Array.from(
            sliderContainer.querySelectorAll(
                ".slide"
            )
        );


    const slideNumbers =
        document.getElementById(
            "slide-numbers"
        );


    const numberItems =
        slideNumbers
            ? Array.from(
                slideNumbers.querySelectorAll(
                    "li"
                )
            )
            : [];


    stopHeroSlider();


    if (
        !slides.length
    ) {

        return;

    }


    let currentIndex =
        0;


    sliderContainer.style.position =
        "absolute";

    sliderContainer.style.inset =
        "0";

    sliderContainer.style.width =
        "100%";

    sliderContainer.style.height =
        "100%";

    sliderContainer.style.overflow =
        "hidden";


    slides.forEach(
        (
            slide
        ) => {

            slide.style.position =
                "absolute";

            slide.style.inset =
                "0";

            slide.style.width =
                "100%";

            slide.style.height =
                "100%";

            slide.style.backgroundSize =
                "cover";

            slide.style.backgroundPosition =
                "center center";

            slide.style.backgroundRepeat =
                "no-repeat";

            slide.style.transition =
                "opacity 1.2s ease-in-out, transform 6s ease-out";

            slide.style.pointerEvents =
                "none";

        }
    );


    function showSlide(
        index
    ) {

        currentIndex =
            (
                index +
                slides.length
            ) %
            slides.length;


        slides.forEach(
            (
                slide,
                slideIndex
            ) => {

                const active =
                    slideIndex ===
                    currentIndex;


                slide.classList.toggle(
                    "active",
                    active
                );


                slide.style.opacity =
                    active
                        ? "1"
                        : "0";


                slide.style.transform =
                    active
                        ? "scale(1)"
                        : "scale(1.04)";


                slide.style.zIndex =
                    active
                        ? "1"
                        : "0";

            }
        );


        numberItems.forEach(
            (
                item,
                itemIndex
            ) => {

                item.classList.toggle(
                    "active",
                    itemIndex ===
                    currentIndex
                );

            }
        );

    }


    function startAutoPlay() {

        stopHeroSlider();


        if (
            slides.length <= 1
        ) {

            return;

        }


        heroSliderTimer =
            setInterval(
                () => {

                    showSlide(
                        currentIndex + 1
                    );

                },
                5000
            );

    }


    numberItems.forEach(
        (
            item,
            index
        ) => {

            item.onclick =
                (
                    event
                ) => {

                    event.preventDefault();

                    showSlide(
                        index
                    );

                    startAutoPlay();

                };

        }
    );


    showSlide(0);

    startAutoPlay();

}



function stopHeroSlider() {

    if (
        heroSliderTimer
    ) {

        clearInterval(
            heroSliderTimer
        );

        heroSliderTimer =
            null;

    }

}



/* =========================================================
   5. HOME
   ========================================================= */

async function syncHomeContent() {

    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "pages",
                    "home"
                )
            );


        if (
            !snapshot.exists()
        ) {

            return;

        }


        const data =
            snapshot.data();


        const val =
            (
                key,
                fallback = ""
            ) => {

                return data[
                    key
                ] ??
                fallback;

            };


        const textWithBreak =
            (
                value
            ) => {

                return escapeHTML(
                    value
                ).replace(
                    /\n/g,
                    "<br>"
                );

            };



        /* HERO */

        setText(
            "home-subtitle",
            val(
                "hero_badge",
                "SOLUSI TEPAT KEBUTUHAN ANDA"
            )
        );


        setHTML(
            "home-title-main",
            textWithBreak(
                val(
                    "hero_title_main",
                    "Membangun\nHari Ini untuk"
                )
            )
        );


        setHTML(
            "home-title-highlight",
            textWithBreak(
                val(
                    "hero_title_highlight",
                    "Masa Depan\nyang Lebih Baik"
                )
            )
        );


        setText(
            "home-desc",
            val(
                "hero_desc"
            )
        );


        const heroPrimary =
            document.getElementById(
                "home-btn-wa-1"
            );


        if (heroPrimary) {

            const label =
                val(
                    "hero_button_primary_text",
                    "Hubungi Kami"
                );


            const labelElement =
                document.getElementById(
                    "home-btn-wa-1-text"
                );


            if (labelElement) {

                labelElement.textContent =
                    label;

            }


            heroPrimary.href =
                val(
                    "hero_button_primary_url",
                    "https://wa.me/6281234567890"
                );

            heroPrimary.target =
                "_blank";

            heroPrimary.rel =
                "noopener noreferrer";

        }


        const heroSecondary =
            document.getElementById(
                "home-btn-secondary"
            );


        if (heroSecondary) {

            const label =
                val(
                    "hero_button_secondary_text",
                    "Lihat Layanan"
                );


            const labelElement =
                document.getElementById(
                    "home-btn-secondary-text"
                );


            if (labelElement) {

                labelElement.textContent =
                    label;

            }


            const target =
                val(
                    "hero_button_secondary_url",
                    "#layanan"
                );


            heroSecondary.href =
                target;

        }



        /* HERO SLIDER */

        const slider =
            document.getElementById(
                "bg-slider"
            );


        const slideNumbers =
            document.getElementById(
                "slide-numbers"
            );


        if (slider) {

            const backgrounds =
                Array.isArray(
                    data.hero_bgs
                )
                    ? data.hero_bgs.filter(
                        (
                            value
                        ) => {

                            return (
                                typeof value ===
                                "string" &&
                                value.trim() !==
                                ""
                            );

                        }
                    )
                    : [];


            slider.innerHTML =
                "";


            if (
                backgrounds.length
            ) {

                backgrounds.forEach(
                    (
                        url,
                        index
                    ) => {

                        const slide =
                            document.createElement(
                                "div"
                            );


                        slide.className =
                            "slide";


                        slide.style.backgroundImage =
                            `url("${url}")`;


                        if (
                            index ===
                            0
                        ) {

                            slide.classList.add(
                                "active"
                            );

                        }


                        slider.appendChild(
                            slide
                        );

                    }
                );

            } else {

                const slide =
                    document.createElement(
                        "div"
                    );


                slide.className =
                    "slide active";


                slide.style.backgroundImage =
                    "url('assets/images/bg/bg-1.png')";


                slider.appendChild(
                    slide
                );

            }


            const overlay =
                document.createElement(
                    "div"
                );


            overlay.className =
                "overlay";


            slider.appendChild(
                overlay
            );


            if (
                slideNumbers
            ) {

                slideNumbers.innerHTML =
                    "";


                backgrounds.forEach(
                    (
                        url,
                        index
                    ) => {

                        const item =
                            document.createElement(
                                "li"
                            );


                        item.textContent =
                            String(
                                index + 1
                            ).padStart(
                                2,
                                "0"
                            );


                        if (
                            index ===
                            0
                        ) {

                            item.classList.add(
                                "active"
                            );

                        }


                        slideNumbers.appendChild(
                            item
                        );

                    }
                );

            }


            initHeroSlider();

        }



        /* =================================================
        ABOUT SUMMARY
        ================================================= */


        /* ---------------------------------------------
        BADGE
        --------------------------------------------- */

        setText(
            "home-about-badge",
            val(
                "about_badge",
                "TENTANG KAMI"
            )
        );



        /* ---------------------------------------------
        TITLE MAIN
        --------------------------------------------- */

        const homeAboutTitleMain =
            document.getElementById(
                "home-about-title-main"
            );


        if (
            homeAboutTitleMain
        ) {

            homeAboutTitleMain.innerHTML =
                textWithBreak(
                    val(
                        "about_title_main",
                        "Tentang PT Diratama"
                    )
                );

        }



        /* ---------------------------------------------
        TITLE HIGHLIGHT
        --------------------------------------------- */

        const homeAboutTitleHighlight =
            document.getElementById(
                "home-about-title-highlight"
            );


        if (
            homeAboutTitleHighlight
        ) {

            homeAboutTitleHighlight.innerHTML =
                textWithBreak(
                    val(
                        "about_title_highlight",
                        "Mapan Sejahtera"
                    )
                );

        }



        /* ---------------------------------------------
        DESCRIPTION
        --------------------------------------------- */

        setText(
            "home-about-desc",
            val(
                "about_desc",
                "PT Diratama Mapan Sejahtera merupakan perusahaan yang bergerak di bidang jasa penyedia tenaga kerja, kontraktor, dan pengadaan barang."
            )
        );



        /* =================================================
        ABOUT FEATURES
        ================================================= */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {


            /* ---------------------------------------------
            FEATURE TITLE
            --------------------------------------------- */

            setText(
                `home-about-feature-${i}-title`,
                val(
                    `about_feature_${i}_title`,
                    ""
                )
            );


            /* ---------------------------------------------
            FEATURE DESCRIPTION
            --------------------------------------------- */

            setText(
                `home-about-feature-${i}-desc`,
                val(
                    `about_feature_${i}_desc`,
                    ""
                )
            );

        }



        /* ---------------------------------------------
        FEATURE ICONS
        --------------------------------------------- */

        const aboutFeatureRows =
            document.querySelectorAll(
                ".about-section .about-features .feature-row"
            );


        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            const featureRow =
                aboutFeatureRows[
                    i - 1
                ];


            if (
                !featureRow
            ) {

                continue;

            }


            const icon =
                data[
                    `about_feature_${i}_icon`
                ];


            if (
                icon
            ) {

                const iconElement =
                    featureRow.querySelector(
                        ".material-symbols-outlined"
                    );


                if (
                    iconElement
                ) {

                    iconElement.textContent =
                        icon;

                }

            }

        }



        /* =================================================
        ABOUT MAIN IMAGE
        ================================================= */

        const homeAboutMainImage =
            document.getElementById(
                "home-about-main-image"
            );


        if (
            homeAboutMainImage &&
            data.about_image_main_url
        ) {

            homeAboutMainImage.src =
                data.about_image_main_url;

        }



        /* =================================================
        ABOUT SECONDARY IMAGE
        ================================================= */

        const homeAboutSecondaryImage =
            document.getElementById(
                "home-about-secondary-image"
            );


        if (
            homeAboutSecondaryImage &&
            data.about_image_secondary_url
        ) {

            homeAboutSecondaryImage.src =
                data.about_image_secondary_url;

        }



        /* =================================================
        ABOUT FLOATING TEXT
        ================================================= */

        const homeAboutFloatingText =
            document.getElementById(
                "home-about-floating-text"
            );


        if (
            homeAboutFloatingText
        ) {

            homeAboutFloatingText.innerHTML =
                textWithBreak(
                    val(
                        "about_floating_text",
                        "BERSAMA\nMEMBANGUN\nMASA DEPAN"
                    )
                );

        }



        /* =================================================
        ABOUT STATISTICS
        ================================================= */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            setText(
                `home-about-stat-${i}-num`,
                val(
                    `about_stat_${i}_num`,
                    ""
                )
            );


            const statLabel =
                document.getElementById(
                    `home-about-stat-${i}-label`
                );


            if (
                statLabel
            ) {

                statLabel.innerHTML =
                    textWithBreak(
                        val(
                            `about_stat_${i}_label`,
                            ""
                        )
                    );

            }

        }



        /* =================================================
        ABOUT OVERLAY TEXT
        ================================================= */

        const homeAboutOverlayText =
            document.getElementById(
                "home-about-overlay-text"
            );


        if (
            homeAboutOverlayText
        ) {

            homeAboutOverlayText.innerHTML =
                textWithBreak(
                    val(
                        "about_overlay_text",
                        "KUALITAS\nKEAMANAN\nKEBERLANJUTAN"
                    )
                );

        }



        /* =================================================
        ABOUT BUTTON
        ================================================= */

        const homeAboutButton =
            document.getElementById(
                "home-about-button"
            );


        if (
            homeAboutButton
        ) {

            const buttonText =
                document.getElementById(
                    "home-about-button-text"
                );


            if (
                buttonText
            ) {

                buttonText.textContent =
                    val(
                        "about_button_text",
                        "Pelajari Lebih Lanjut"
                    );

            }


            const target =
                String(
                    val(
                        "about_button_target",
                        "about"
                    )
                )
                    .trim()
                    .toLowerCase();


            homeAboutButton.href =
                "#";


            homeAboutButton.onclick =
                (
                    event
                ) => {

                    event.preventDefault();


                    if (
                        target ===
                        "about"
                    ) {

                        loadPage(
                            "about"
                        );

                        return;

                    }


                    if (
                        target ===
                        "home"
                    ) {

                        loadPage(
                            "home"
                        );

                        return;

                    }


                    if (
                        target ===
                        "services" ||
                        target ===
                        "layanan"
                    ) {

                        loadPage(
                            "services"
                        );

                        return;

                    }


                    if (
                        target ===
                        "work"
                    ) {

                        loadPage(
                            "work"
                        );

                        return;

                    }


                    if (
                        target ===
                        "clients"
                    ) {

                        loadPage(
                            "clients"
                        );

                        return;

                    }


                    if (
                        target.startsWith(
                            "http"
                        )
                    ) {

                        window.open(
                            target,
                            "_blank"
                        );

                    }

                };

        }



        /* =================================================
        ABOUT MOTTO
        ================================================= */

        const homeAboutMotto =
            document.getElementById(
                "home-about-motto"
            );


        if (
            homeAboutMotto
        ) {

            homeAboutMotto.innerHTML =
                textWithBreak(
                    val(
                        "about_motto",
                        "SOLUSI KONSTRUKSI\nUNTUK NEGERI"
                    )
                );

        }



        /* VALUES */

        setHTML(
            "home-val-title",
            `
                ${textWithBreak(
                    val(
                        "values_title_main"
                    )
                )}
                ${
                    val(
                        "values_title_highlight"
                    )
                        ? `
                            <br>
                            <span class="highlight">
                                ${textWithBreak(
                                    val(
                                        "values_title_highlight"
                                    )
                                )}
                            </span>
                          `
                        : ""
                }
            `
        );


        setText(
            "home-val-desc",
            val(
                "values_desc"
            )
        );


        const valueCards =
            getAll(
                ".values-grid .value-card"
            );


        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            const card =
                valueCards[
                    i - 1
                ];


            if (!card) {

                continue;

            }


            const title =
                data[
                    `value_${i}_title`
                ];


            const desc =
                data[
                    `value_${i}_desc`
                ];


            const icon =
                data[
                    `value_${i}_icon`
                ];


            const titleEl =
                card.querySelector(
                    "h4"
                );


            const descEl =
                card.querySelector(
                    "p"
                );


            const iconEl =
                card.querySelector(
                    ".value-icon-box .material-symbols-outlined"
                );


            if (
                titleEl &&
                title !== undefined
            ) {

                titleEl.textContent =
                    title;

            }


            if (
                descEl &&
                desc !== undefined
            ) {

                descEl.textContent =
                    desc;

            }


            if (
                iconEl &&
                icon
            ) {

                iconEl.textContent =
                    icon;

            }

        }



        /* SERVICES */

        setHTML(
            "home-srv-title",
            `
                ${textWithBreak(
                    val(
                        "services_title_main"
                    )
                )}
                ${
                    val(
                        "services_title_highlight"
                    )
                        ? `
                            <br>
                            <span class="highlight">
                                ${textWithBreak(
                                    val(
                                        "services_title_highlight"
                                    )
                                )}
                            </span>
                          `
                        : ""
                }
            `
        );


        setText(
            "home-srv-desc",
            val(
                "services_desc"
            )
        );


        const serviceCards =
            getAll(
                ".services-grid .service-card"
            );


        const serviceMap = [

            {
                newIndex:
                    1
            },

            {
                newIndex:
                    2
            },

            {
                newIndex:
                    3
            }

        ];


        serviceMap.forEach(
            (
                item,
                cardIndex
            ) => {

                const card =
                    serviceCards[
                        cardIndex
                    ];


                if (!card) {

                    return;

                }


                const index =
                    item.newIndex;


                const title =
                    data[
                        `service_${index}_title`
                    ] ??
                    "";


                const desc =
                    data[
                        `service_${index}_desc`
                    ] ??
                    "";


                const icon =
                    data[
                        `service_${index}_icon`
                    ] ??
                    "";


                const overlay =
                    data[
                        `service_${index}_overlay`
                    ] ??
                    "";


                const image =
                    data[
                        `service_${index}_image_url`
                    ] ??
                    "";


                const titleElement =
                    card.querySelector(
                        ".title-desc h3"
                    );


                const descElement =
                    card.querySelector(
                        ".title-desc p"
                    );


                const iconElement =
                    card.querySelector(
                        ".icon-box-small .material-symbols-outlined"
                    );


                const overlayElement =
                    card.querySelector(
                        ".num-text"
                    );


                const imageElement =
                    card.querySelector(
                        ".card-img-wrapper img"
                    );


                if (
                    titleElement
                ) {

                    titleElement.textContent =
                        title;

                }


                if (
                    descElement
                ) {

                    descElement.textContent =
                        desc;

                }


                if (
                    iconElement
                ) {

                    iconElement.textContent =
                        icon;

                }


                if (
                    overlayElement
                ) {

                    overlayElement.innerHTML =
                        textWithBreak(
                            overlay
                        );

                }


                if (
                    imageElement &&
                    image
                ) {

                    imageElement.src =
                        image;

                }


                const featureList =
                    card.querySelectorAll(
                        ".card-list li"
                    );


                for (
                    let f = 1;
                    f <= 5;
                    f++
                ) {

                    const featureValue =
                        data[
                            `service_${index}_feat_${f}`
                        ];


                    if (
                        featureList[
                            f - 1
                        ] &&
                        featureValue !==
                        undefined
                    ) {

                        const feature =
                            featureList[
                                f - 1
                            ];


                        const oldIcon =
                            feature.querySelector(
                                ".check-icon"
                            );


                        feature.innerHTML =
                            "";


                        if (
                            oldIcon
                        ) {

                            feature.appendChild(
                                oldIcon
                            );

                        }


                        feature.appendChild(
                            document.createTextNode(
                                " " +
                                featureValue
                            )
                        );

                    }

                }

            }
        );



        /* WORK */

        setHTML(
            "home-work-title",
            `
                ${textWithBreak(
                    val(
                        "work_title_main"
                    )
                )}
                ${
                    val(
                        "work_title_highlight"
                    )
                        ? `
                            <br>
                            <span class="highlight">
                                ${textWithBreak(
                                    val(
                                        "work_title_highlight"
                                    )
                                )}
                            </span>
                          `
                        : ""
                }
            `
        );


        const workButton =
            document.getElementById(
                "home-work-button"
            );


        if (
            workButton
        ) {

            const textElement =
                document.getElementById(
                    "home-work-button-text"
                );


            if (
                textElement
            ) {

                textElement.textContent =
                    val(
                        "work_button_text",
                        "Lihat Semua Work Experience"
                    );

            }


            workButton.href =
                "#";

            workButton.onclick =
                (
                    event
                ) => {

                    event.preventDefault();

                    loadPage(
                        "work"
                    );

                };

        }



        /* FINAL CTA */

        setHTML(
            "home-cta-title",
            textWithBreak(
                val(
                    "cta_title"
                )
            )
        );


        setText(
            "home-cta-desc",
            val(
                "cta_desc"
            )
        );


        const ctaButton =
            document.getElementById(
                "home-cta-button"
            );


        if (
            ctaButton
        ) {

            const ctaText =
                document.getElementById(
                    "home-cta-button-text"
                );


            if (
                ctaText
            ) {

                ctaText.textContent =
                    val(
                        "cta_button_text",
                        "Hubungi Tim Kami Sekarang"
                    );

            }


            ctaButton.href =
                val(
                    "cta_button_url",
                    "https://wa.me/6281234567890"
                );

            ctaButton.target =
                "_blank";

            ctaButton.rel =
                "noopener noreferrer";

        }


        const ctaBackground =
            val(
                "cta_bg_url"
            );


        if (
            ctaBackground
        ) {

            const element =
                getEl(
                    "#home-cta-bg",
                    ".final-cta-section .final-cta-bg-img"
                );


            if (
                element
            ) {

                element.style.backgroundImage =
                    `url("${ctaBackground}")`;

            }

        }


        /* HIDDEN OLD ELEMENTS */

        const hideSelectors = [

            ".hero .trust-bar",

            ".values-section .center-badge",

            ".values-section .values-banner",

            ".services-section .section-badge",

            ".services-grid .card-btn",

            ".work-section .section-badge",

            ".final-cta-section .final-cta-badge",

            ".final-cta-section .cta-features",

            ".final-cta-section .action-divider",

            ".final-cta-section .shape-navy-right"

        ];


        hideSelectors.forEach(
            (
                selector
            ) => {

                getAll(
                    selector
                ).forEach(
                    (
                        element
                    ) => {

                        element.style.display =
                            "none";

                    }
                );

            }
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal menyinkronkan Home:",
            error
        );

    }

}



/* =========================================================
   6. HOME PORTFOLIO
   ========================================================= */

async function syncHomePortfolio() {

    try {

        const grid =
            document.getElementById(
                "home-portfolio-grid"
            );


        if (!grid) {

            return;

        }


        const snapshot =
            await getDocs(
                query(
                    collection(
                        db,
                        "work_experience"
                    ),
                    orderBy(
                        "created_at",
                        "desc"
                    ),
                    limit(
                        6
                    )
                )
            );


        if (
            snapshot.empty
        ) {

            grid.innerHTML = `
                <p
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        color:#fff;
                        padding:40px;
                    "
                >
                    Belum ada proyek.
                </p>
            `;

            return;

        }


        let html =
            "";


        let index =
            1;


        snapshot.forEach(
            (
                projectDoc
            ) => {

                const project =
                    projectDoc.data();


                const title =
                    escapeHTML(
                        project.title ||
                        "Work Experience"
                    );


                const client =
                    escapeHTML(
                        project.client_name ||
                        project.client ||
                        ""
                    );


                const image =
                    escapeHTML(
                        project.thumbnail_url ||
                        project.imageUrl ||
                        "assets/images/portfolio-1.png"
                    );


                const category =
                    String(
                        project.category ||
                        ""
                    ).toLowerCase();


                let icon =
                    "domain";


                if (
                    category ===
                    "konstruksi"
                ) {

                    icon =
                        "construction";

                }


                if (
                    category ===
                    "manpower"
                ) {

                    icon =
                        "groups";

                }


                if (
                    category ===
                    "pengadaan"
                ) {

                    icon =
                        "inventory_2";

                }


                html += `
                    <div
                        class="
                            port-card
                            pos-${index}
                            reveal-item
                        "
                        data-project-id="${escapeHTML(
                            projectDoc.id
                        )}"
                    >

                        <img
                            src="${image}"
                            alt="${title}"
                        >

                        <div
                            class="port-overlay"
                        >

                            <div class="port-info">

                                <span
                                    class="
                                        material-symbols-outlined
                                        port-icon
                                    "
                                >
                                    ${icon}
                                </span>

                                <h4>
                                    ${title}
                                </h4>

                            </div>

                            ${
                                client
                                    ? `
                                        <div class="port-loc">

                                            <span
                                                class="
                                                    material-symbols-outlined
                                                    loc-icon
                                                "
                                            >
                                                business
                                            </span>

                                            <p>
                                                ${client}
                                            </p>

                                        </div>
                                      `
                                    : ""
                            }

                        </div>

                    </div>
                `;


                index++;

            }
        );


        grid.innerHTML =
            html;


        window
            .refreshPageAnimations?.(
                document.getElementById(
                    "app-content"
                )
            );


    } catch (
        error
    ) {

        console.error(
            "Gagal memuat Work Experience Home:",
            error
        );

    }

}



/* =========================================================
   WORK EXPERIENCE PAGE
   ========================================================= */

async function syncWorkExperiencePage() {

    try {

        const grid =
            document.getElementById(
                "portfolio-grid"
            );


        if (!grid) {

            return;

        }


        const loading =
            document.getElementById(
                "work-loading-state"
            );


        const pagination =
            document.getElementById(
                "work-pagination"
            );


        const paginationInfo =
            document.getElementById(
                "work-pagination-info"
            );


        const filterGroup =
            document.getElementById(
                "work-filter-group"
            );


        /* ---------------------------------------------
           HERO / CTA STATIC CMS
           --------------------------------------------- */

        const pageSnapshot =
            await getDoc(
                doc(
                    db,
                    "pages",
                    "work"
                )
            );


        const pageData =
            pageSnapshot.exists()
                ? pageSnapshot.data()
                : {};


        const heroTitle =
            document.getElementById(
                "pub_work_hero_title"
            );


        if (
            heroTitle &&
            pageData.hero_title
        ) {

            heroTitle.innerHTML =
                pageData.hero_title;

        }


        const heroDesc =
            document.getElementById(
                "pub_work_hero_desc"
            );


        if (
            heroDesc &&
            pageData.hero_desc
        ) {

            heroDesc.textContent =
                pageData.hero_desc;

        }


        const heroBg =
            document.getElementById(
                "we-hero-bg"
            );


        if (
            heroBg &&
            pageData.hero_bg_url
        ) {

            heroBg.style.backgroundImage =
                `url("${pageData.hero_bg_url}")`;

        }


        const ctaTitle =
            document.getElementById(
                "pub_work_cta_title"
            );


        if (
            ctaTitle &&
            pageData.cta_title
        ) {

            ctaTitle.innerHTML =
                pageData.cta_title;

        }


        const ctaDesc =
            document.getElementById(
                "pub_work_cta_desc"
            );


        if (
            ctaDesc &&
            pageData.cta_desc
        ) {

            ctaDesc.textContent =
                pageData.cta_desc;

        }


        const ctaButton =
            document.getElementById(
                "work-cta-button"
            );


        const ctaButtonText =
            document.getElementById(
                "work-cta-button-text"
            );


        if (
            ctaButton
        ) {

            if (
                ctaButtonText &&
                pageData.cta_button_text
            ) {

                ctaButtonText.textContent =
                    pageData.cta_button_text;

            }


            ctaButton.href =
                pageData.cta_button_url ||
                "https://wa.me/6281234567890";

        }


        const ctaBg =
            document.getElementById(
                "work-final-cta-bg"
            );


        if (
            ctaBg &&
            pageData.cta_bg_url
        ) {

            ctaBg.style.backgroundImage =
                `url("${pageData.cta_bg_url}")`;

        }



        /* ---------------------------------------------
           FIRESTORE PROJECT DATA
           --------------------------------------------- */

        const projectsSnapshot =
            await getDocs(
                query(
                    collection(
                        db,
                        "work_experience"
                    ),
                    orderBy(
                        "created_at",
                        "desc"
                    )
                )
            );


        const projects = [];


        projectsSnapshot.forEach(
            (
                projectDoc
            ) => {

                projects.push({

                    id:
                        projectDoc.id,

                    ...projectDoc.data()

                });

            }
        );



        /* ---------------------------------------------
           STATS
           --------------------------------------------- */

        const totalProjects =
            projects.length;


        const clients =
            new Set(
                projects
                    .map(
                        (
                            project
                        ) =>
                            String(
                                project.client ||
                                ""
                            )
                                .trim()
                                .toLowerCase()
                    )
                    .filter(
                        Boolean
                    )
            );


        const currentYear =
            new Date()
                .getFullYear();


        const projectYears =
            projects
                .map(
                    (
                        project
                    ) =>
                        parseInt(
                            project.year,
                            10
                        )
                )
                .filter(
                    Number.isFinite
                );


        const earliestYear =
            projectYears.length
                ? Math.min(
                    ...projectYears
                )
                : currentYear;


        const experienceYears =
            projectYears.length
                ? Math.max(
                    1,
                    currentYear -
                    earliestYear
                )
                : 0;


        const categories =
            new Set(
                projects
                    .map(
                        (
                            project
                        ) =>
                            String(
                                project.category ||
                                ""
                            )
                                .trim()
                                .toLowerCase()
                    )
                    .filter(
                        Boolean
                    )
            );


        setText(
            "pub_work_stat_1_num",
            `${totalProjects}+`
        );


        setText(
            "pub_work_stat_2_num",
            `${clients.size}+`
        );


        setText(
            "pub_work_stat_3_num",
            `${categories.size || 3}`
        );


        setText(
            "pub_work_stat_4_num",
            `${experienceYears}+`
        );



        /* ---------------------------------------------
           FILTER + PAGINATION STATE
           --------------------------------------------- */

        let activeFilter =
            "all";


        let currentPage =
            1;


        const itemsPerPage =
            6;



        function getFilteredProjects() {

            if (
                activeFilter ===
                "all"
            ) {

                return projects;

            }


            return projects.filter(
                (
                    project
                ) => {

                    return String(
                        project.category ||
                        ""
                    )
                        .trim()
                        .toLowerCase()
                        ===
                        activeFilter;

                }
            );

        }



        /* ---------------------------------------------
           ICON
           --------------------------------------------- */

        function getProjectIcon(
            category
        ) {

            switch (
                String(
                    category ||
                    ""
                )
                    .trim()
                    .toLowerCase()
            ) {

                case "konstruksi":

                    return "construction";


                case "pengadaan":

                    return "inventory_2";


                case "manpower":

                    return "groups";


                default:

                    return "domain";

            }

        }



        /* ---------------------------------------------
           CATEGORY LABEL
           --------------------------------------------- */

        function getCategoryLabel(
            category
        ) {

            switch (
                String(
                    category ||
                    ""
                )
                    .trim()
                    .toLowerCase()
            ) {

                case "konstruksi":

                    return "Jasa Konstruksi";


                case "pengadaan":

                    return "Pengadaan Barang";


                case "manpower":

                    return "Penyedia Tenaga Kerja";


                default:

                    return "Proyek";

            }

        }



        /* ---------------------------------------------
           RENDER PROJECT
           --------------------------------------------- */

        function renderProjects() {

            const filtered =
                getFilteredProjects();


            const totalPages =
                Math.max(
                    1,
                    Math.ceil(
                        filtered.length /
                        itemsPerPage
                    )
                );


            if (
                currentPage >
                totalPages
            ) {

                currentPage =
                    totalPages;

            }


            const startIndex =
                (
                    currentPage -
                    1
                ) *
                itemsPerPage;


            const visibleProjects =
                filtered.slice(
                    startIndex,
                    startIndex +
                    itemsPerPage
                );


            if (
                loading
            ) {

                loading.style.display =
                    "none";

            }


            if (
                visibleProjects.length ===
                0
            ) {

                grid.innerHTML = `

                    <div
                        class="work-empty-state"
                    >

                        <span
                            class="
                                material-symbols-outlined
                            "
                        >
                            folder_off
                        </span>

                        <span>
                            Belum ada proyek
                            pada kategori ini.
                        </span>

                    </div>

                `;


            } else {

                let html =
                    "";


                visibleProjects.forEach(
                    (
                        project
                    ) => {

                        const title =
                            escapeHTML(
                                project.title ||
                                "Work Experience"
                            );


                        const client =
                            escapeHTML(
                                project.client ||
                                "Mitra / Klien"
                            );


                        const year =
                            escapeHTML(
                                project.year ||
                                "-"
                            );


                        const image =
                            escapeHTML(
                                project.imageUrl ||
                                project.thumbnail_url ||
                                "assets/images/portfolio-1.png"
                            );


                        const category =
                            String(
                                project.category ||
                                ""
                            )
                                .trim()
                                .toLowerCase();


                        const icon =
                            getProjectIcon(
                                category
                            );


                        const categoryLabel =
                            getCategoryLabel(
                                category
                            );


                        html += `

                            <article
                                class="
                                    port-card-v2
                                    reveal-item
                                "
                                data-category="${escapeHTML(
                                    category
                                )}"
                                data-project-id="${escapeHTML(
                                    project.id
                                )}"
                            >

                                <div
                                    class="
                                        port-img-wrap-v2
                                    "
                                >

                                    <img
                                        src="${image}"
                                        alt="${title}"
                                    >


                                    <div
                                        class="
                                            port-badge-v2
                                        "
                                    >

                                        <span
                                            class="
                                                material-symbols-outlined
                                            "
                                        >
                                            ${icon}
                                        </span>

                                        ${categoryLabel}

                                    </div>

                                </div>


                                <div
                                    class="
                                        port-content-v2
                                    "
                                >

                                    <h3>
                                        ${title}
                                    </h3>


                                    <p
                                        class="
                                            port-client-v2
                                        "
                                    >
                                        Klien:
                                        ${client}
                                    </p>


                                    <div
                                        class="
                                            port-footer-v2
                                        "
                                    >

                                        <div
                                            class="
                                                port-year-v2
                                            "
                                        >

                                            <span
                                                class="
                                                    material-symbols-outlined
                                                "
                                            >
                                                calendar_today
                                            </span>

                                            ${year}

                                        </div>


                                        <a
                                            href="#"
                                            class="
                                                port-btn-v2
                                                project-detail-btn
                                            "
                                            data-project-id="${escapeHTML(
                                                project.id
                                            )}"
                                            aria-label="Lihat ${title}"
                                        >

                                            <span
                                                class="
                                                    material-symbols-outlined
                                                "
                                            >
                                                arrow_forward
                                            </span>

                                        </a>

                                    </div>

                                </div>

                            </article>

                        `;

                    }
                );


                grid.innerHTML =
                    html;

            }



            /* -----------------------------------------
               PAGINATION
               ----------------------------------------- */

            if (
                pagination
            ) {

                pagination.innerHTML =
                    "";


                if (
                    totalPages >
                    1
                ) {

                    const previous =
                        document.createElement(
                            "button"
                        );


                    previous.className =
                        "page-btn";


                    previous.type =
                        "button";


                    previous.innerHTML = `

                        <span
                            class="
                                material-symbols-outlined
                            "
                        >
                            chevron_left
                        </span>

                    `;


                    previous.disabled =
                        currentPage === 1;


                    previous.addEventListener(
                        "click",
                        () => {

                            if (
                                currentPage >
                                1
                            ) {

                                currentPage--;

                                renderProjects();

                            }

                        }
                    );


                    pagination.appendChild(
                        previous
                    );


                    for (
                        let page = 1;
                        page <= totalPages;
                        page++
                    ) {

                        const pageButton =
                            document.createElement(
                                "button"
                            );


                        pageButton.className =
                            "page-btn";


                        pageButton.type =
                            "button";


                        pageButton.textContent =
                            page;


                        if (
                            page ===
                            currentPage
                        ) {

                            pageButton.classList.add(
                                "active"
                            );

                        }


                        pageButton.addEventListener(
                            "click",
                            () => {

                                currentPage =
                                    page;

                                renderProjects();

                            }
                        );


                        pagination.appendChild(
                            pageButton
                        );

                    }


                    const next =
                        document.createElement(
                            "button"
                        );


                    next.className =
                        "page-btn";


                    next.type =
                        "button";


                    next.innerHTML = `

                        <span
                            class="
                                material-symbols-outlined
                            "
                        >
                            chevron_right
                        </span>

                    `;


                    next.disabled =
                        currentPage >=
                        totalPages;


                    next.addEventListener(
                        "click",
                        () => {

                            if (
                                currentPage <
                                totalPages
                            ) {

                                currentPage++;

                                renderProjects();

                            }

                        }
                    );


                    pagination.appendChild(
                        next
                    );

                }

            }



            /* -----------------------------------------
               INFO
               ----------------------------------------- */

            if (
                paginationInfo
            ) {

                if (
                    filtered.length ===
                    0
                ) {

                    paginationInfo.textContent =
                        "Tidak ada proyek";

                } else {

                    const first =
                        startIndex +
                        1;


                    const last =
                        Math.min(
                            startIndex +
                            itemsPerPage,
                            filtered.length
                        );


                    paginationInfo.textContent =
                        `Menampilkan ${first}–${last} dari ${filtered.length} proyek`;

                }

            }



            /* -----------------------------------------
               REFRESH ANIMATION
               ----------------------------------------- */

            requestAnimationFrame(
                () => {

                    window
                        .refreshPageAnimations?.(
                            document.getElementById(
                                "app-content"
                            )
                        );

                }
            );

        }



        /* ---------------------------------------------
           FILTER BUTTON
           --------------------------------------------- */

        if (
            filterGroup
        ) {

            filterGroup
                .querySelectorAll(
                    ".filter-btn"
                )
                .forEach(
                    (
                        button
                    ) => {

                        button.onclick =
                            () => {

                                activeFilter =
                                    button.dataset.filter ||
                                    "all";


                                currentPage =
                                    1;


                                filterGroup
                                    .querySelectorAll(
                                        ".filter-btn"
                                    )
                                    .forEach(
                                        (
                                            item
                                        ) => {

                                            item.classList.remove(
                                                "active"
                                            );

                                        }
                                    );


                                button.classList.add(
                                    "active"
                                );


                                renderProjects();

                            };

                    }
                );

        }



        /* ---------------------------------------------
           PROJECT DETAIL BUTTON
           --------------------------------------------- */

        grid.onclick =
            (
                event
            ) => {

                const button =
                    event.target.closest(
                        ".project-detail-btn"
                    );


                if (!button) {

                    return;

                }


                event.preventDefault();


                const projectId =
                    button.dataset.projectId;


                const project =
                    projects.find(
                        (
                            item
                        ) =>
                            item.id ===
                            projectId
                    );


                if (!project) {

                    return;

                }


                /*
                 * Untuk sekarang detail button
                 * diarahkan ke halaman/detail
                 * setelah modul detail kita aktifkan.
                 *
                 * Sementara tampilkan detail
                 * proyek secara sederhana.
                 */

                window.dispatchEvent(
                    new CustomEvent(
                        "work:project:selected",
                        {
                            detail:
                                {
                                    project
                                }
                        }
                    )
                );

            };



        renderProjects();


    } catch (
        error
    ) {

        console.error(
            "Gagal memuat Work Experience:",
            error
        );


        const grid =
            document.getElementById(
                "portfolio-grid"
            );


        if (
            grid
        ) {

            grid.innerHTML = `

                <div
                    class="work-empty-state"
                >

                    <span
                        class="
                            material-symbols-outlined
                        "
                    >
                        error
                    </span>

                    <span>
                        Gagal memuat data proyek.
                    </span>

                </div>

            `;

        }

    }

}



/* =========================================================
   7. ABOUT
   ========================================================= */

async function syncAboutContent() {

    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "pages",
                    "about"
                )
            );


        if (
            !snapshot.exists()
        ) {

            return;

        }


        const data =
            snapshot.data();


        const setAboutText =
            (
                id,
                key
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    data[key] !==
                    undefined &&
                    data[key] !==
                    null
                ) {

                    element.textContent =
                        data[key];

                }

            };


        const setAboutHTML =
            (
                id,
                key
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    data[key] !==
                    undefined &&
                    data[key] !==
                    null
                ) {

                    element.innerHTML =
                        data[key];

                }

            };


        const setAboutIcon =
            (
                id,
                key
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    data[key]
                ) {

                    element.textContent =
                        data[key];

                }

            };


        const setAboutImage =
            (
                id,
                key
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    data[key]
                ) {

                    element.src =
                        data[key];

                }

            };


        const setAboutBackground =
            (
                id,
                key
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    data[key]
                ) {

                    element.style.backgroundImage =
                        `url("${data[key]}")`;

                }

            };



        /* HERO */

        setAboutText(
            "pub_abt_hero_badge",
            "hero_badge"
        );


        setAboutHTML(
            "pub_abt_hero_title",
            "hero_title"
        );


        setAboutText(
            "pub_abt_hero_desc",
            "hero_desc"
        );


        setAboutBackground(
            "about-hero-bg",
            "hero_bg_url"
        );



        /* WHO WE ARE */

        setAboutHTML(
            "pub_abt_who_title",
            "who_title"
        );


        setAboutText(
            "pub_abt_who_desc",
            "who_desc"
        );


        setAboutImage(
            "pub_abt_who_image",
            "who_image_url"
        );


        setAboutHTML(
            "pub_abt_who_image_text",
            "who_image_text"
        );


        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            setAboutIcon(
                `pub_abt_who_feature_${i}_icon`,
                `who_feature_${i}_icon`
            );


            setAboutHTML(
                `pub_abt_who_feature_${i}_text`,
                `who_feature_${i}_text`
            );

        }



        /* VISI MISI */

        setAboutHTML(
            "pub_abt_vm_title",
            "vm_title"
        );


        setAboutText(
            "pub_abt_vm_header_desc",
            "vm_header_desc"
        );


        setAboutBackground(
            "pub_abt_vm_bg",
            "vm_bg_url"
        );


        setAboutIcon(
            "pub_abt_vision_icon",
            "vision_icon"
        );


        setAboutIcon(
            "pub_abt_mission_icon",
            "mission_icon"
        );


        setAboutText(
            "pub_abt_visi_desc",
            "visi_desc"
        );


        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            setAboutText(
                `pub_abt_misi_${i}`,
                `misi_${i}`
            );

        }



        /* LEGALITAS */

        setAboutHTML(
            "pub_abt_legal_title",
            "legal_title"
        );


        setAboutText(
            "pub_abt_legal_desc",
            "legal_desc"
        );


        setAboutText(
            "pub_abt_legal_trust_desc",
            "legal_trust_desc"
        );


        for (
            let i = 1;
            i <= 8;
            i++
        ) {

            setAboutText(
                `pub_abt_leg_${i}_title`,
                `leg_${i}_title`
            );


            setAboutText(
                `pub_abt_leg_${i}`,
                `leg_${i}`
            );


            setAboutIcon(
                `pub_abt_leg_${i}_icon`,
                `leg_${i}_icon`
            );

        }



        /* CULTURE */

        setAboutHTML(
            "pub_abt_cul_title",
            "cul_title"
        );


        setAboutText(
            "pub_abt_cul_desc",
            "cul_desc"
        );


        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            setAboutText(
                `pub_abt_cul_${i}_title`,
                `cul_${i}_title`
            );


            setAboutText(
                `pub_abt_cul_${i}_desc`,
                `cul_${i}_desc`
            );


            setAboutIcon(
                `pub_abt_cul_${i}_icon`,
                `cul_${i}_icon`
            );

        }



        /* EXCELLENCE */

        setAboutHTML(
            "pub_abt_exc_title",
            "exc_title"
        );


        setAboutText(
            "pub_abt_exc_desc",
            "exc_desc"
        );


        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            setAboutText(
                `pub_abt_exc_${i}_title`,
                `exc_${i}_title`
            );


            setAboutText(
                `pub_abt_exc_${i}_desc`,
                `exc_${i}_desc`
            );


            setAboutIcon(
                `pub_abt_exc_${i}_icon`,
                `exc_${i}_icon`
            );


            setAboutBackground(
                `pub_abt_exc_${i}_image`,
                `exc_${i}_image_url`
            );

        }



        /* CTA */

        setAboutHTML(
            "pub_abt_cta_title",
            "cta_title"
        );


        setAboutText(
            "pub_abt_cta_desc",
            "cta_desc"
        );


        setAboutBackground(
            "pub_abt_cta_bg",
            "cta_bg_url"
        );


        const ctaButton =
            document.getElementById(
                "about-cta-button"
            );


        if (
            ctaButton
        ) {

            const ctaText =
                document.getElementById(
                    "about-cta-button-text"
                );


            if (
                ctaText &&
                data.cta_button_text
            ) {

                ctaText.textContent =
                    data.cta_button_text;

            }


            ctaButton.href =
                data.cta_button_url ||
                "https://wa.me/6281234567890";


            ctaButton.target =
                "_blank";


            ctaButton.rel =
                "noopener noreferrer";

        }


        window
            .refreshPageAnimations?.(
                document.getElementById(
                    "app-content"
                )
            );


    } catch (
        error
    ) {

        console.error(
            "Gagal menyinkronkan About:",
            error
        );

    }

}



/* =========================================================
   8. CLIENTS
   ========================================================= */

async function syncClientsData() {

    try {

        const grid =
            document.getElementById(
                "public-clients-grid"
            );


        if (!grid) {

            return;

        }


        const snapshot =
            await getDocs(
                query(
                    collection(
                        db,
                        "clients"
                    ),
                    orderBy(
                        "created_at",
                        "desc"
                    )
                )
            );


        if (
            snapshot.empty
        ) {

            grid.innerHTML = `
                <p
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        color:#666;
                    "
                >
                    Belum ada logo klien.
                </p>
            `;

            return;

        }


        let html =
            "";


        snapshot.forEach(
            (
                clientDoc
            ) => {

                const client =
                    clientDoc.data();


                const name =
                    escapeHTML(
                        client.name ||
                        "Client"
                    );


                const logo =
                    escapeHTML(
                        client.logoUrl ||
                        ""
                    );


                if (!logo) {

                    return;

                }


                html += `
                    <div
                        class="
                            client-logo-card
                            reveal-item
                        "
                        title="${name}"
                    >

                        <img
                            src="${logo}"
                            alt="Logo ${name}"
                        >

                    </div>
                `;

            }
        );


        grid.innerHTML =
            html;


        window
            .refreshPageAnimations?.(
                document.getElementById(
                    "app-content"
                )
            );


    } catch (
        error
    ) {

        console.error(
            "Gagal memuat Clients:",
            error
        );

    }

}



/* =========================================================
   SERVICES DETAIL
   ========================================================= */

async function syncServicesContent() {

    try {

        const docRef =
            doc(
                db,
                "pages",
                "layanan"
            );


        const docSnap =
            await getDoc(
                docRef
            );


        if (
            !docSnap.exists()
        ) {

            console.warn(
                "Data Layanan belum tersedia di Firestore: pages/layanan"
            );

            return;

        }


        const data =
            docSnap.data();


        /* =================================================
           HELPER
           ================================================= */

        const setText =
            (
                id,
                value
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    value !== undefined &&
                    value !== null
                ) {

                    element.textContent =
                        value;

                }

            };


        const setHTML =
            (
                id,
                value
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    value !== undefined &&
                    value !== null
                ) {

                    element.innerHTML =
                        value;

                }

            };


        const setImage =
            (
                id,
                url
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    url
                ) {

                    element.src =
                        url;

                }

            };


        const setBackground =
            (
                id,
                url
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    url
                ) {

                    element.style.backgroundImage =
                        `url("${url}")`;

                }

            };



        /* =================================================
           HERO
           ================================================= */

        setHTML(
            "pub_srv_hero_title",
            data.hero_title ??
            "Layanan <span class=\"highlight\">Terpadu Kami</span>"
        );


        setText(
            "pub_srv_hero_desc",
            data.hero_desc ??
            "Solusi end-to-end untuk kebutuhan tenaga kerja, konstruksi, dan pengadaan proyek Anda."
        );


        setBackground(
            "services-hero-bg",
            data.hero_bg_url
        );



        /* =================================================
           SERVICES
           ================================================= */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {


            /* ---------------------------------------------
               BADGE
               --------------------------------------------- */

            setText(
                `pub_srv_${i}_badge`,
                data[
                    `srv_${i}_badge`
                ] ??
                ""
            );


            /* ---------------------------------------------
               TITLE
               --------------------------------------------- */

            setHTML(
                `pub_srv_${i}_title`,
                data[
                    `srv_${i}_title`
                ] ??
                ""
            );


            /* ---------------------------------------------
               DESCRIPTION
               --------------------------------------------- */

            setText(
                `pub_srv_${i}_desc`,
                data[
                    `srv_${i}_desc`
                ] ??
                ""
            );


            /* ---------------------------------------------
               IMAGE
               --------------------------------------------- */

            setImage(
                `pub_srv_${i}_image`,
                data[
                    `srv_${i}_image_url`
                ]
            );


            /* ---------------------------------------------
               ICON
               --------------------------------------------- */

            setText(
                `pub_srv_${i}_icon`,
                data[
                    `srv_${i}_icon`
                ] ??
                ""
            );


            /* ---------------------------------------------
               IMAGE OVERLAY
               --------------------------------------------- */

            setText(
                `pub_srv_${i}_overlay_title`,
                data[
                    `srv_${i}_overlay_title`
                ] ??
                ""
            );


            setText(
                `pub_srv_${i}_overlay_desc`,
                data[
                    `srv_${i}_overlay_desc`
                ] ??
                ""
            );


            /* ---------------------------------------------
               5 FEATURES
               --------------------------------------------- */

            for (
                let j = 1;
                j <= 5;
                j++
            ) {

                setText(
                    `pub_srv_${i}_feat_${j}`,
                    data[
                        `srv_${i}_feat_${j}`
                    ] ??
                    ""
                );

            }


            /* ---------------------------------------------
               BUTTON
               --------------------------------------------- */

            const button =
                document.getElementById(
                    `pub_srv_${i}_button`
                );


            const buttonText =
                document.getElementById(
                    `pub_srv_${i}_button_text`
                );


            if (
                button
            ) {

                if (
                    buttonText &&
                    data[
                        `srv_${i}_button_text`
                    ]
                ) {

                    buttonText.textContent =
                        data[
                            `srv_${i}_button_text`
                        ];

                }


                const target =
                    data[
                        `srv_${i}_button_url`
                    ] ||
                    "#";


                button.href =
                    target;


                if (
                    target.startsWith(
                        "http"
                    )
                ) {

                    button.target =
                        "_blank";

                    button.rel =
                        "noopener noreferrer";

                }

            }

        }



        /* =================================================
           CTA
           ================================================= */

        setHTML(
            "pub_srv_cta_title",
            data.cta_title ??
            "Butuh Solusi Khusus untuk Proyek Anda?"
        );


        setText(
            "pub_srv_cta_desc",
            data.cta_desc ??
            "Tim kami siap mendiskusikan kebutuhan Anda dan merumuskan solusi terbaik."
        );


        setBackground(
            "srv-cta-bg",
            data.cta_bg_url
        );


        const ctaButton =
            document.getElementById(
                "srv-cta-button"
            );


        const ctaButtonText =
            document.getElementById(
                "srv-cta-button-text"
            );


        if (
            ctaButton
        ) {

            if (
                ctaButtonText &&
                data.cta_button_text
            ) {

                ctaButtonText.textContent =
                    data.cta_button_text;

            }


            ctaButton.href =
                data.cta_button_url ||
                "https://wa.me/6281234567890";


            ctaButton.target =
                "_blank";


            ctaButton.rel =
                "noopener noreferrer";

        }


        /* =================================================
           ANIMATION REFRESH
           ================================================= */

        window.refreshPageAnimations?.(
            document.getElementById(
                "app-content"
            )
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal menyinkronkan Layanan:",
            error
        );

    }

}



/* =========================================================
   10. PAGE LOADED
   ========================================================= */

window.addEventListener(
    "page:loaded",
    async (
        event
    ) => {

        const page =
            event.detail?.page;


        if (!page) {

            return;

        }


        await syncGlobalSettings();


        switch (
            page
        ) {

            case "home":

                await syncHomeContent();

                await syncHomePortfolio();

                break;


            case "about":

                stopHeroSlider();

                await syncAboutContent();

                break;


            case "services":

                stopHeroSlider();

                await syncServicesContent();

                break;


            case "clients":

                stopHeroSlider();

                await syncClientsData();

                break;


            case "work":

                stopHeroSlider();

                await syncWorkExperiencePage();

                break;

        }


        requestAnimationFrame(
            () => {

                window
                    .refreshPageAnimations?.(
                        document.getElementById(
                            "app-content"
                        )
                    );

            }
        );

    }
);



/* =========================================================
   11. NAVBAR
   ========================================================= */

function initNavbarScroll() {

    const navbar =
        document.getElementById(
            "navbar"
        );


    if (!navbar) {

        return;

    }


    function updateNavbar() {

        if (
            window.scrollY >
            50
        ) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive:
                true
        }
    );

}



/* =========================================================
   12. MOBILE MENU
   ========================================================= */

function initMobileMenu() {

    const hamburger =
        document.getElementById(
            "hamburger-btn"
        );


    const closeButton =
        document.getElementById(
            "close-btn"
        );


    const mobileMenu =
        document.getElementById(
            "mobile-menu"
        );


    if (
        !hamburger ||
        !closeButton ||
        !mobileMenu
    ) {

        return;

    }


    hamburger.addEventListener(
        "click",
        () => {

            mobileMenu.classList.add(
                "open"
            );

            document.body.style.overflow =
                "hidden";

        }
    );


    closeButton.addEventListener(
        "click",
        () => {

            mobileMenu.classList.remove(
                "open"
            );

            document.body.style.overflow =
                "";

        }
    );

}



/* =========================================================
   13. INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await syncGlobalSettings();

        initNavbarScroll();

        initMobileMenu();

    }
);