/**
 * ============================================================================
 * PT DIRATAMA MAPAN SEJAHTERA
 * ADMIN DASHBOARD
 *
 * HOME CMS + ABOUT CMS
 * FIREBASE + CLOUDINARY
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
    setDoc,
    serverTimestamp,
    collection,
    getDocs,
    addDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";



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


const auth =
    getAuth(
        app
    );



/* =========================================================
   2. CLOUDINARY
   ========================================================= */

const CLOUDINARY_CLOUD_NAME =
    "disvbvng1";


const CLOUDINARY_UPLOAD_PRESET =
    "ptdiratamamapansejahtera";



/* =========================================================
   3. STATE
   ========================================================= */

let utamaFormData = {};


let homeFormData =
    {};


let aboutFormData =
    {};


let layananFormData = 
    {};

/* =========================================================
   4. DOM
   ========================================================= */

function getElement(
    id
) {

    return document.getElementById(
        id
    );

}


function getValue(
    id
) {

    const element =
        getElement(
            id
        );


    if (!element) {

        return "";

    }


    return element.value.trim();

}


function setValue(
    id,
    value
) {

    const element =
        getElement(
            id
        );


    if (!element) {

        return;

    }


    element.value =
        value ?? "";

}



function setPreview(
    id,
    url
) {

    const preview =
        getElement(
            id
        );


    if (!preview) {

        return;

    }


    if (!url) {

        preview.style.display =
            "none";

        preview.removeAttribute(
            "src"
        );

        return;

    }


    preview.src =
        url;

    preview.style.display =
        "block";

}



function setButtonLoading(
    button,
    loading,
    defaultText
) {

    if (!button) {

        return;

    }


    if (loading) {

        button.disabled =
            true;

        button.dataset.defaultText =
            button.innerHTML;

        button.innerHTML = `
            <span
                class="material-icons"
                style="
                    animation:
                        adminSpin
                        1s linear infinite;
                    vertical-align:middle;
                "
            >
                sync
            </span>
            Menyimpan...
        `;

        return;

    }


    button.disabled =
        false;

    button.innerHTML =
        defaultText ||
        button.dataset.defaultText ||
        "Simpan";

}



/* =========================================================
   5. CLOUDINARY
   ========================================================= */

async function uploadToCloudinary(
    file
) {

    if (!file) {

        return "";

    }


    const endpoint =
        `https://api.cloudinary.com/v1_1/` +
        `${CLOUDINARY_CLOUD_NAME}/image/upload`;


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );


    const response =
        await fetch(
            endpoint,
            {
                method:
                    "POST",

                body:
                    formData
            }
        );


    const data =
        await response.json();


    if (
        !response.ok ||
        !data.secure_url
    ) {

        throw new Error(
            data?.error?.message ||
            "Upload gambar ke Cloudinary gagal."
        );

    }


    return data.secure_url;

}



/* =========================================================
   6. IMAGE PREVIEW
   ========================================================= */

function bindImagePreview(
    inputId,
    previewId
) {

    const input =
        getElement(
            inputId
        );


    const preview =
        getElement(
            previewId
        );


    if (
        !input ||
        !preview
    ) {

        return;

    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files?.[0];


            if (!file) {

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                (
                    event
                ) => {

                    preview.src =
                        event.target.result;

                    preview.style.display =
                        "block";

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}



/* =========================================================
   7. IMAGE STATE
   ========================================================= */

function setExistingImage(
    key,
    value
) {

    homeFormData[key] =
        value || "";

}


function getExistingImage(
    key
) {

    return homeFormData[
        key
    ] || "";

}



async function processImageField(
    inputId,
    removeId,
    stateKey
) {

    const input =
        getElement(
            inputId
        );


    const removeCheckbox =
        removeId
            ? getElement(
                removeId
            )
            : null;


    if (
        removeCheckbox?.checked
    ) {

        setExistingImage(
            stateKey,
            ""
        );

        return "";

    }


    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {

        return getExistingImage(
            stateKey
        );

    }


    const url =
        await uploadToCloudinary(
            input.files[0]
        );


    setExistingImage(
        stateKey,
        url
    );


    return url;

}



/* =========================================================
   8. SIDEBAR NAVIGATION
   ========================================================= */

function initSidebarNavigation() {

    const navItems =
        document.querySelectorAll(
            ".sidebar-nav .nav-item"
        );


    const sections =
        document.querySelectorAll(
            ".admin-section"
        );


    const pageTitle =
        getElement(
            "page-title"
        );


    navItems.forEach(
        (
            item
        ) => {

            if (
                item.classList.contains(
                    "logout-btn"
                )
            ) {

                return;

            }


            item.addEventListener(
                "click",
                async (
                    event
                ) => {

                    event.preventDefault();


                    /* -----------------------------------------
                       RESET ACTIVE
                       ----------------------------------------- */

                    navItems.forEach(
                        (
                            nav
                        ) => {

                            nav.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* -----------------------------------------
                       HIDE ALL SECTION
                       ----------------------------------------- */

                    sections.forEach(
                        (
                            section
                        ) => {

                            section.style.display =
                                "none";

                            section.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* -----------------------------------------
                       ACTIVE MENU
                       ----------------------------------------- */

                    item.classList.add(
                        "active"
                    );


                    const targetId =
                        item.dataset.target;


                    const targetSection =
                        getElement(
                            targetId
                        );


                    if (
                        targetSection
                    ) {

                        targetSection.style.display =
                            "block";

                        targetSection.classList.add(
                            "active"
                        );

                    }


                    /* -----------------------------------------
                       TITLE
                       ----------------------------------------- */

                    if (
                        pageTitle
                    ) {

                        pageTitle.innerText =
                            item.innerText
                                .trim()
                                .replace(
                                    /\s+/g,
                                    " "
                                );

                    }


                    /* -----------------------------------------
                       LOAD DATA PER MODUL
                       ----------------------------------------- */

                    try {

                        if (
                            targetId ===
                            "utama"
                        ) {

                            loadUtamaData();

                        }
                        
                        if (
                            targetId ===
                            "home-settings"
                        ) {

                            await loadHomeData();

                        }


                        else if (
                            targetId ===
                            "about"
                        ) {

                            if (
                                typeof loadAboutData ===
                                "function"
                            ) {

                                await loadAboutData();

                            }

                        }


                        else if (
                            targetId ===
                            "layanan"
                        ) {

                            if (
                                typeof loadLayananData ===
                                "function"
                            ) {

                                await loadLayananData();

                            }

                        }


                        else if (
                            targetId ===
                            "work-exp"
                        ) {

                            await loadWorkExperienceData();

                        }


                        else if (
                            targetId ===
                            "clients"
                        ) {

                            await loadClientsData();

                        }

                    } catch (
                        error
                    ) {

                        console.error(
                            "Gagal memuat modul Admin:",
                            error
                        );

                    }

                }
            );

        }
    );


    /* -----------------------------------------
       DEFAULT
       ----------------------------------------- */

    const activeItem =
        document.querySelector(
            '.sidebar-nav .nav-item[data-target="home-settings"]'
        );


    if (
        activeItem
    ) {

        activeItem.click();

    }

}


/* =========================================================
   9. HOME DEFAULT DATA
   ========================================================= */

const DEFAULT_HOME_DATA = {

    hero_bgs:
        [],

    hero_badge:
        "SOLUSI TEPAT KEBUTUHAN ANDA",

    hero_title_main:
        "Membangun\nHari Ini untuk",

    hero_title_highlight:
        "Masa Depan\nyang Lebih Baik",

    hero_desc:
        "PT Diratama Mapan Sejahtera hadir memberikan pelayanan terbaik di bidang Jasa Konstruksi, Penyedia Tenaga Kerja, dan Pengadaan Barang.",

    hero_button_primary_text:
        "Hubungi Kami",

    hero_button_primary_url:
        "",

    hero_button_secondary_text:
        "Lihat Layanan",

    hero_button_secondary_url:
        "#layanan",


    about_title_main:
        "Tentang PT Diratama",

    about_title_highlight:
        "Mapan Sejahtera",

    about_desc:
        "PT Diratama Mapan Sejahtera merupakan perusahaan yang bergerak di bidang jasa penyedia tenaga kerja, kontraktor, dan pengadaan barang.",


    values_title_main:
        "Prinsip Kami untuk",

    values_title_highlight:
        "Hasil yang Lebih Baik",

    values_desc:
        "Nilai-nilai ini menjadi landasan bagi setiap langkah kami dalam memberikan layanan yang profesional, terpercaya, dan berkelanjutan bagi seluruh mitra.",


    services_title_main:
        "Solusi Terintegrasi",

    services_title_highlight:
        "untuk Pertumbuhan Anda",

    services_desc:
        "Kami menyediakan layanan di bidang penyedia tenaga kerja, kontraktor, dan pengadaan barang dengan standar kualitas tinggi, didukung oleh tim profesional dan berpengalaman yang terpercaya.",


    service_1_number:
        "01",

    service_1_title:
        "Jasa Konstruksi",

    service_1_icon:
        "construction",

    service_1_overlay:
        "KONSTRUKSI\nBERKUALITAS",

    service_1_desc:
        "Melaksanakan pekerjaan konstruksi dengan standar kualitas, keamanan, dan ketepatan waktu yang tinggi.",

    service_1_feat_1:
        "Kualitas pengerjaan sesuai standar",

    service_1_feat_2:
        "Tim ahli dan berpengalaman",

    service_1_feat_3:
        "Manajemen proyek profesional",

    service_1_feat_4:
        "Kepatuhan terhadap standar keselamatan kerja",

    service_1_feat_5:
        "Penyelesaian proyek sesuai target waktu",


    service_2_number:
        "02",

    service_2_title:
        "Penyedia Tenaga Kerja",

    service_2_icon:
        "groups",

    service_2_overlay:
        "TENAGA\nPROFESIONAL",

    service_2_desc:
        "Menyediakan tenaga kerja profesional dan kompeten untuk berbagai sektor industri sesuai kebutuhan perusahaan Anda.",

    service_2_feat_1:
        "Proses rekrutmen ketat dan terstandar",

    service_2_feat_2:
        "Tenaga kerja terlatih dan berpengalaman",

    service_2_feat_3:
        "Penempatan sesuai kebutuhan",

    service_2_feat_4:
        "Seleksi sesuai kualifikasi dan kebutuhan",

    service_2_feat_5:
        "Administrasi tenaga kerja terkelola dengan baik",


    service_3_number:
        "03",

    service_3_title:
        "Pengadaan Barang",

    service_3_icon:
        "inventory_2",

    service_3_overlay:
        "PENGADAAN\nTEPAT",

    service_3_desc:
        "Menyediakan berbagai kebutuhan barang dan material dengan kualitas terjamin dari supplier terpercaya.",

    service_3_feat_1:
        "Produk berkualitas sesuai spesifikasi",

    service_3_feat_2:
        "Pengadaan dari supplier terpercaya",

    service_3_feat_3:
        "Pengiriman tepat waktu dan aman",

    service_3_feat_4:
        "Harga kompetitif dan transparan",

    service_3_feat_5:
        "Dokumentasi pengadaan yang lengkap",


    work_title_main:
        "Work Experience",

    work_title_highlight:
        "Proyek Unggulan",

    work_button_text:
        "Lihat Semua Work Experience",

    work_button_target:
        "work",


    cta_title:
        "Siap Memulai Proyek Anda\nBersama Kami?",

    cta_desc:
        "Kami siap menjadi mitra terpercaya untuk mewujudkan proyek Anda dengan kualitas terbaik, tepat waktu, dan solusi yang efisien.",

    cta_button_text:
        "Hubungi Tim Kami Sekarang",

    cta_button_url:
        "",

    cta_bg_url:
        ""

};



/* =========================================================
   10. HOME LOAD
   ========================================================= */

async function loadHomeData() {

    const form =
        getElement(
            "form-home"
        );


    if (!form) {

        return;

    }


    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "pages",
                    "home"
                )
            );


        const firebaseData =
            snapshot.exists()
                ? snapshot.data()
                : {};


        homeFormData =
            {
                ...DEFAULT_HOME_DATA,
                ...firebaseData
            };


        /* HERO */

        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            const url =
                homeFormData.hero_bgs?.[
                    i - 1
                ] ||
                "";


            setExistingImage(
                `hero_bg_${i}`,
                url
            );


            setPreview(
                `preview-home-hero-${i}`,
                url
            );

        }


        setValue(
            "home_hero_badge",
            homeFormData.hero_badge
        );


        setValue(
            "home_hero_title_main",
            homeFormData.hero_title_main
        );


        setValue(
            "home_hero_title_highlight",
            homeFormData.hero_title_highlight
        );


        setValue(
            "home_hero_desc",
            homeFormData.hero_desc
        );


        setValue(
            "home_hero_btn_primary_text",
            homeFormData.hero_button_primary_text
        );


        setValue(
            "home_hero_btn_primary_url",
            homeFormData.hero_button_primary_url
        );


        setValue(
            "home_hero_btn_secondary_text",
            homeFormData.hero_button_secondary_text
        );


        setValue(
            "home_hero_btn_secondary_url",
            homeFormData.hero_button_secondary_url
        );



        /* ABOUT */

        setValue(
            "home_about_title_main",
            homeFormData.about_title_main
        );


        setValue(
            "home_about_title_highlight",
            homeFormData.about_title_highlight
        );


        setValue(
            "home_about_desc",
            homeFormData.about_desc
        );



        /* VALUES */

        setValue(
            "home_values_title_main",
            homeFormData.values_title_main
        );


        setValue(
            "home_values_title_highlight",
            homeFormData.values_title_highlight
        );


        setValue(
            "home_values_desc",
            homeFormData.values_desc
        );


        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            setValue(
                `home_value_${i}_title`,
                homeFormData[
                    `value_${i}_title`
                ]
            );


            setValue(
                `home_value_${i}_desc`,
                homeFormData[
                    `value_${i}_desc`
                ]
            );


            setValue(
                `home_value_${i}_icon`,
                homeFormData[
                    `value_${i}_icon`
                ]
            );

        }



        /* SERVICES */

        setValue(
            "home_services_title_main",
            homeFormData.services_title_main
        );


        setValue(
            "home_services_title_highlight",
            homeFormData.services_title_highlight
        );


        setValue(
            "home_services_desc",
            homeFormData.services_desc
        );


        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            setValue(
                `home_service_${i}_number`,
                homeFormData[
                    `service_${i}_number`
                ]
            );


            setValue(
                `home_service_${i}_title`,
                homeFormData[
                    `service_${i}_title`
                ]
            );


            setValue(
                `home_service_${i}_icon`,
                homeFormData[
                    `service_${i}_icon`
                ]
            );


            setValue(
                `home_service_${i}_overlay`,
                homeFormData[
                    `service_${i}_overlay`
                ]
            );


            setValue(
                `home_service_${i}_desc`,
                homeFormData[
                    `service_${i}_desc`
                ]
            );


            for (
                let j = 1;
                j <= 5;
                j++
            ) {

                setValue(
                    `home_service_${i}_feat_${j}`,
                    homeFormData[
                        `service_${i}_feat_${j}`
                    ]
                );

            }


            setExistingImage(
                `service_${i}`,
                homeFormData[
                    `service_${i}_image_url`
                ]
            );


            setPreview(
                `preview-home-service-${i}`,
                homeFormData[
                    `service_${i}_image_url`
                ]
            );

        }



        /* WORK */

        setValue(
            "home_work_title_main",
            homeFormData.work_title_main
        );


        setValue(
            "home_work_title_highlight",
            homeFormData.work_title_highlight
        );


        setValue(
            "home_work_button_text",
            homeFormData.work_button_text
        );


        setValue(
            "home_work_button_target",
            homeFormData.work_button_target
        );



        /* CTA */

        setValue(
            "home_cta_title",
            homeFormData.cta_title
        );


        setValue(
            "home_cta_desc",
            homeFormData.cta_desc
        );


        setValue(
            "home_cta_button_text",
            homeFormData.cta_button_text
        );


        setValue(
            "home_cta_button_url",
            homeFormData.cta_button_url
        );


        setExistingImage(
            "cta_bg",
            homeFormData.cta_bg_url
        );


        setPreview(
            "preview-home-cta",
            homeFormData.cta_bg_url
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal memuat Home:",
            error
        );

    }

}



/* =========================================================
   11. HOME SAVE
   ========================================================= */

async function saveHomeData(
    event
) {

    event.preventDefault();


    const button =
        getElement(
            "btn-save-home"
        );


    setButtonLoading(
        button,
        true,
        "Simpan Seluruh Konten Beranda"
    );


    try {

        const heroBackgrounds =
            [];


        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            const url =
                await processImageField(
                    `home_hero_bg_${i}`,
                    `remove_home_hero_bg_${i}`,
                    `hero_bg_${i}`
                );


            if (url) {

                heroBackgrounds.push(
                    url
                );

            }

        }


        if (
            !heroBackgrounds.length
        ) {

            throw new Error(
                "Minimal satu gambar Hero harus tersedia."
            );

        }


        const serviceImages =
            {};


        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            serviceImages[i] =
                await processImageField(
                    `home_service_${i}_image`,
                    `remove_home_service_${i}_image`,
                    `service_${i}`
                );

        }


        const ctaBackground =
            await processImageField(
                "home_cta_bg",
                "remove_home_cta_bg",
                "cta_bg"
            );


        const data = {

            hero_bgs:
                heroBackgrounds,

            hero_badge:
                getValue(
                    "home_hero_badge"
                ),

            hero_title_main:
                getValue(
                    "home_hero_title_main"
                ),

            hero_title_highlight:
                getValue(
                    "home_hero_title_highlight"
                ),

            hero_desc:
                getValue(
                    "home_hero_desc"
                ),

            hero_button_primary_text:
                getValue(
                    "home_hero_btn_primary_text"
                ),

            hero_button_primary_url:
                getValue(
                    "home_hero_btn_primary_url"
                ),

            hero_button_secondary_text:
                getValue(
                    "home_hero_btn_secondary_text"
                ),

            hero_button_secondary_url:
                getValue(
                    "home_hero_btn_secondary_url"
                ),


            about_title_main:
                getValue(
                    "home_about_title_main"
                ),

            about_title_highlight:
                getValue(
                    "home_about_title_highlight"
                ),

            about_desc:
                getValue(
                    "home_about_desc"
                ),


            values_title_main:
                getValue(
                    "home_values_title_main"
                ),

            values_title_highlight:
                getValue(
                    "home_values_title_highlight"
                ),

            values_desc:
                getValue(
                    "home_values_desc"
                ),


            services_title_main:
                getValue(
                    "home_services_title_main"
                ),

            services_title_highlight:
                getValue(
                    "home_services_title_highlight"
                ),

            services_desc:
                getValue(
                    "home_services_desc"
                ),


            work_title_main:
                getValue(
                    "home_work_title_main"
                ),

            work_title_highlight:
                getValue(
                    "home_work_title_highlight"
                ),

            work_button_text:
                getValue(
                    "home_work_button_text"
                ),

            work_button_target:
                getValue(
                    "home_work_button_target"
                ),


            cta_title:
                getValue(
                    "home_cta_title"
                ),

            cta_desc:
                getValue(
                    "home_cta_desc"
                ),

            cta_button_text:
                getValue(
                    "home_cta_button_text"
                ),

            cta_button_url:
                getValue(
                    "home_cta_button_url"
                ),

            cta_bg_url:
                ctaBackground,

            updated_at:
                serverTimestamp()

        };


        /* VALUES */

        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            data[
                `value_${i}_title`
            ] =
                getValue(
                    `home_value_${i}_title`
                );


            data[
                `value_${i}_desc`
            ] =
                getValue(
                    `home_value_${i}_desc`
                );


            data[
                `value_${i}_icon`
            ] =
                getValue(
                    `home_value_${i}_icon`
                );

        }



        /* SERVICES */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            data[
                `service_${i}_number`
            ] =
                getValue(
                    `home_service_${i}_number`
                );


            data[
                `service_${i}_title`
            ] =
                getValue(
                    `home_service_${i}_title`
                );


            data[
                `service_${i}_icon`
            ] =
                getValue(
                    `home_service_${i}_icon`
                );


            data[
                `service_${i}_overlay`
            ] =
                getValue(
                    `home_service_${i}_overlay`
                );


            data[
                `service_${i}_desc`
            ] =
                getValue(
                    `home_service_${i}_desc`
                );


            data[
                `service_${i}_image_url`
            ] =
                serviceImages[i];


            for (
                let j = 1;
                j <= 5;
                j++
            ) {

                data[
                    `service_${i}_feat_${j}`
                ] =
                    getValue(
                        `home_service_${i}_feat_${j}`
                    );

            }

        }


        await setDoc(
            doc(
                db,
                "pages",
                "home"
            ),
            data,
            {
                merge:
                    true
            }
        );


        homeFormData =
            {
                ...homeFormData,
                ...data
            };


        alert(
            "Seluruh konten Home berhasil disimpan ke Firebase."
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal menyimpan Home:",
            error
        );


        alert(
            error?.message ||
            "Terjadi kesalahan saat menyimpan Home."
        );

    } finally {

        setButtonLoading(
            button,
            false,
            "Simpan Seluruh Konten Beranda"
        );

    }

}



/* =========================================================
   12. HOME FORM
   ========================================================= */

function initHomeForm() {

    const form =
        getElement(
            "form-home"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        saveHomeData
    );


    for (
        let i = 1;
        i <= 6;
        i++
    ) {

        bindImagePreview(
            `home_hero_bg_${i}`,
            `preview-home-hero-${i}`
        );

    }


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        bindImagePreview(
            `home_service_${i}_image`,
            `preview-home-service-${i}`
        );

    }


    bindImagePreview(
        "home_cta_bg",
        "preview-home-cta"
    );

}



/* =========================================================
   13. ABOUT DEFAULT DATA
   ========================================================= */

const DEFAULT_ABOUT_DATA = {

    hero_bg_url:
        "assets/images/bg/bg-2.png",

    hero_badge:
        "PROFESIONAL | TERPERCAYA | BERKELANJUTAN",

    hero_title:
        "Tentang <span class=\"highlight\">Kami</span>",

    hero_desc:
        "Mengenal lebih dekat PT Diratama Mapan Sejahtera, mitra strategis Anda dalam penyediaan tenaga kerja, kontraktor, dan pengadaan barang.",


    who_title:
        "Integritas &<br>Profesionalisme<br><span class=\"highlight\">dalam Setiap Solusi</span>",

    who_desc:
        "PT Diratama Mapan Sejahtera merupakan perusahaan yang berkomitmen untuk memberikan pelayanan terbaik di bidang jasa penyedia tenaga kerja, kontraktor, dan pengadaan barang.",

    who_image_url:
        "assets/images/bg/bg-2.png",

    who_image_text:
        "BERSAMA<br>MEMBANGUN<br>MASA DEPAN<br>YANG LEBIH BAIK",


    who_feature_1_icon:
        "health_and_safety",

    who_feature_1_text:
        "Integritas<br>Sebagai Dasar",

    who_feature_2_icon:
        "groups",

    who_feature_2_text:
        "Profesional<br>dalam Layanan",

    who_feature_3_icon:
        "leaderboard",

    who_feature_3_text:
        "Solusi Inovatif<br>untuk Masa Depan",


    vm_title:
        "Fondasi Kami<br><span class=\"highlight\">untuk Masa Depan yang Lebih Baik</span>",

    vm_header_desc:
        "Dengan visi dan misi yang jelas, kami terus melangkah memberikan solusi terbaik bagi setiap mitra, serta berkontribusi pada pembangunan yang berkelanjutan.",

    vm_bg_url:
        "assets/images/bg/bg-2.png",

    vision_icon:
        "visibility",

    mission_icon:
        "track_changes",

    visi_desc:
        "Menjadi perusahaan penyedia tenaga kerja, kontraktor, dan pengadaan barang yang berkualitas tinggi. Berorientasi pada kepuasan pelanggan dengan pelayanan transparan, bertanggung jawab, dan terpercaya.",

    misi_1:
        "Memberikan pelayanan terbaik dan profesional di setiap pekerjaan.",

    misi_2:
        "Mengutamakan kepuasan pelanggan melalui solusi inovatif dan efektif.",

    misi_3:
        "Membangun hubungan jangka panjang dengan pelanggan berdasarkan kepercayaan dan integritas.",

    misi_4:
        "Meningkatkan kualitas sumber daya manusia untuk mendukung kebutuhan industri.",


    legal_title:
        "Legalitas & <span class=\"highlight\">Sertifikasi Resmi</span>",

    legal_desc:
        "Kami beroperasi secara legal dan memenuhi seluruh ketentuan yang berlaku di Indonesia.",

    legal_trust_desc:
        "Dengan legalitas dan sertifikasi yang lengkap, kami siap menjadi mitra terpercaya untuk mendukung kelancaran proyek dan pertumbuhan bisnis Anda.",


    cul_title:
        "Nilai-Nilai <span class=\"highlight\">Perusahaan</span>",

    cul_desc:
        "Nilai-nilai ini menjadi pedoman kami dalam bekerja, bertumbuh, dan memberikan solusi terbaik bagi setiap mitra.",


    cul_1_title:
        "Integritas",

    cul_1_icon:
        "verified_user",

    cul_1_desc:
        "Menjunjung tinggi kejujuran dan transparansi dalam setiap tindakan dan keputusan.",


    cul_2_title:
        "Komitmen",

    cul_2_icon:
        "handshake",

    cul_2_desc:
        "Berfokus pada pencapaian hasil optimal dengan penuh tanggung jawab dan dedikasi.",


    cul_3_title:
        "Profesionalisme",

    cul_3_icon:
        "engineering",

    cul_3_desc:
        "Memberikan pelayanan terbaik dengan standar kerja tinggi, didukung sumber daya kompeten.",


    cul_4_title:
        "Kolaborasi",

    cul_4_icon:
        "groups",

    cul_4_desc:
        "Membangun kerja sama yang baik dengan seluruh stakeholder untuk mencapai tujuan bersama.",


    cul_5_title:
        "Inovasi",

    cul_5_icon:
        "lightbulb",

    cul_5_desc:
        "Menciptakan solusi kreatif dan adaptif untuk menjawab kebutuhan pelanggan.",


    cul_6_title:
        "Berkelanjutan",

    cul_6_icon:
        "eco",

    cul_6_desc:
        "Mendukung praktik pekerjaan berkelanjutan demi manfaat jangka panjang.",


    exc_title:
        "Keunggulan <span class=\"highlight\">Kami</span>",

    exc_desc:
        "Kami menghadirkan solusi yang terintegrasi, profesional, dan berfokus pada kualitas untuk mendukung keberhasilan proyek dan bisnis Anda.",


    exc_1_icon:
        "groups",

    exc_1_title:
        "Menyediakan tenaga kerja terampil berbasis kompetensi",

    exc_1_desc:
        "Tenaga kerja yang profesional, terlatih, dan siap mendukung produktivitas bisnis Anda.",

    exc_1_image_url:
        "assets/images/bg/bg-5.png",


    exc_2_icon:
        "construction",

    exc_2_title:
        "Menyediakan layanan jasa konstruksi berkualitas tinggi",

    exc_2_desc:
        "Melaksanakan pekerjaan konstruksi dengan standar kualitas, keamanan, dan ketepatan waktu.",

    exc_2_image_url:
        "assets/images/bg/bg-2.png",


    exc_3_icon:
        "inventory_2",

    exc_3_title:
        "Pengadaan barang sesuai kebutuhan dan spesifikasi",

    exc_3_desc:
        "Menyediakan berbagai kebutuhan barang dan material dengan kualitas terjamin dari supplier terpercaya.",

    exc_3_image_url:
        "assets/images/bg/bg-6.png",


    cta_title:
        "Tertarik Menjadikan Kami<br><span class=\"highlight\">Mitra Proyek Anda?</span>",

    cta_desc:
        "Hubungi kami hari ini untuk mendiskusikan kebutuhan Anda.",

    cta_button_text:
        "Hubungi Kami",

    cta_button_url:
        "https://wa.me/6281234567890",

    cta_bg_url:
        "assets/images/bg/bg-2.png"

};



/* =========================================================
   14. ABOUT ADMIN UI
   ========================================================= */

function buildAboutAdminUI() {

    const section =
        getElement(
            "about"
        );


    if (!section) {

        return;

    }


    section.innerHTML = `

        <div class="section-header-flex">

            <div class="section-text">

                <h3>
                    Manajemen Halaman About
                </h3>

                <p>
                    Kelola seluruh konten
                    halaman Tentang Kami.
                </p>

            </div>

        </div>


        <form id="form-about">


            <!-- HERO -->

            <div class="admin-card">

                <h4>
                    01. Hero About
                </h4>


                <div class="form-grid">

                    <div class="form-group">

                        <label>
                            Badge / Subtitle
                        </label>

                        <input
                            id="abt_hero_badge"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Judul Hero
                        </label>

                        <textarea
                            id="abt_hero_title"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Deskripsi Hero
                        </label>

                        <textarea
                            id="abt_hero_desc"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Background Hero
                        </label>

                        <input
                            type="file"
                            id="abt_hero_bg"
                            accept="image/*"
                        >

                        <img
                            id="preview-abt-hero-bg"
                            style="
                                display:none;
                                width:100%;
                                max-height:180px;
                                object-fit:cover;
                                margin-top:10px;
                                border-radius:6px;
                            "
                        >

                        <label>

                            <input
                                type="checkbox"
                                id="remove_abt_hero_bg"
                            >

                            Hapus background

                        </label>

                    </div>

                </div>

            </div>



            <!-- WHO -->

            <div class="admin-card">

                <h4>
                    02. Who We Are
                </h4>


                <div class="form-grid">

                    <div class="form-group full-width">

                        <label>
                            Judul
                        </label>

                        <textarea
                            id="abt_who_title"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            id="abt_who_desc"
                            rows="4"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Teks Ornamen Foto
                        </label>

                        <textarea
                            id="abt_who_image_text"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group">
                        <label>Feature 1 Icon</label>
                        <input id="abt_who_feature_1_icon">
                    </div>

                    <div class="form-group">
                        <label>Feature 1 Text</label>
                        <textarea
                            id="abt_who_feature_1_text"
                            rows="2"
                        ></textarea>
                    </div>


                    <div class="form-group">
                        <label>Feature 2 Icon</label>
                        <input id="abt_who_feature_2_icon">
                    </div>

                    <div class="form-group">
                        <label>Feature 2 Text</label>
                        <textarea
                            id="abt_who_feature_2_text"
                            rows="2"
                        ></textarea>
                    </div>


                    <div class="form-group">
                        <label>Feature 3 Icon</label>
                        <input id="abt_who_feature_3_icon">
                    </div>

                    <div class="form-group">
                        <label>Feature 3 Text</label>
                        <textarea
                            id="abt_who_feature_3_text"
                            rows="2"
                        ></textarea>
                    </div>


                    <div class="form-group full-width">

                        <label>
                            Foto Who We Are
                        </label>

                        <input
                            type="file"
                            id="abt_who_image"
                            accept="image/*"
                        >

                        <img
                            id="preview-abt-who-image"
                            style="
                                display:none;
                                width:100%;
                                max-height:180px;
                                object-fit:cover;
                                margin-top:10px;
                            "
                        >

                        <label>

                            <input
                                type="checkbox"
                                id="remove_abt_who_image"
                            >

                            Hapus gambar

                        </label>

                    </div>

                </div>

            </div>



            <!-- VISI MISI -->

            <div class="admin-card">

                <h4>
                    03. Visi & Misi
                </h4>


                <div class="form-grid">


                    <div class="form-group">

                        <label>
                            Judul Section
                        </label>

                        <textarea
                            id="abt_vm_title"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group">

                        <label>
                            Deskripsi Header
                        </label>

                        <textarea
                            id="abt_vm_header_desc"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group">

                        <label>
                            Ikon Visi
                        </label>

                        <input
                            id="abt_vision_icon"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Ikon Misi
                        </label>

                        <input
                            id="abt_mission_icon"
                        >

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Deskripsi Visi
                        </label>

                        <textarea
                            id="abt_visi_desc"
                            rows="4"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">
                        <label>Misi 1</label>
                        <textarea id="abt_misi_1" rows="2"></textarea>
                    </div>


                    <div class="form-group full-width">
                        <label>Misi 2</label>
                        <textarea id="abt_misi_2" rows="2"></textarea>
                    </div>


                    <div class="form-group full-width">
                        <label>Misi 3</label>
                        <textarea id="abt_misi_3" rows="2"></textarea>
                    </div>


                    <div class="form-group full-width">
                        <label>Misi 4</label>
                        <textarea id="abt_misi_4" rows="2"></textarea>
                    </div>


                    <div class="form-group full-width">

                        <label>
                            Background Visi Misi
                        </label>

                        <input
                            type="file"
                            id="abt_vm_bg"
                            accept="image/*"
                        >

                        <img
                            id="preview-abt-vm-bg"
                            style="
                                display:none;
                                width:100%;
                                max-height:180px;
                                object-fit:cover;
                                margin-top:10px;
                            "
                        >

                        <label>

                            <input
                                type="checkbox"
                                id="remove_abt_vm_bg"
                            >

                            Hapus background

                        </label>

                    </div>

                </div>

            </div>



            <!-- LEGALITAS -->

            <div class="admin-card">

                <h4>
                    04. Legalitas & Sertifikasi
                </h4>


                <div class="form-grid">


                    <div class="form-group full-width">
                        <label>Judul Section</label>

                        <textarea
                            id="abt_legal_title"
                            rows="2"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">
                        <label>Deskripsi</label>

                        <textarea
                            id="abt_legal_desc"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">
                        <label>Deskripsi Trust Banner</label>

                        <textarea
                            id="abt_legal_trust_desc"
                            rows="3"
                        ></textarea>

                    </div>


                    ${Array.from(
                        {
                            length:
                                8
                        },
                        (
                            _,
                            index
                        ) => {

                            const i =
                                index +
                                1;

                            return `

                                <div class="form-group">

                                    <label>
                                        Legal ${i}
                                        - Judul
                                    </label>

                                    <input
                                        id="abt_leg_${i}_title"
                                    >

                                </div>


                                <div class="form-group">

                                    <label>
                                        Legal ${i}
                                        - Icon
                                    </label>

                                    <input
                                        id="abt_leg_${i}_icon"
                                    >

                                </div>


                                <div class="form-group full-width">

                                    <label>
                                        Legal ${i}
                                        - Detail
                                    </label>

                                    <textarea
                                        id="abt_leg_${i}"
                                        rows="2"
                                    ></textarea>

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>



            <!-- CULTURE -->

            <div class="admin-card">

                <h4>
                    05. Our Culture
                </h4>


                <div class="form-grid">


                    <div class="form-group full-width">

                        <label>
                            Judul Section
                        </label>

                        <textarea
                            id="abt_cul_title"
                            rows="2"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            id="abt_cul_desc"
                            rows="3"
                        ></textarea>

                    </div>


                    ${Array.from(
                        {
                            length:
                                6
                        },
                        (
                            _,
                            index
                        ) => {

                            const i =
                                index +
                                1;

                            return `

                                <div class="form-group">

                                    <label>
                                        Culture ${i}
                                        - Judul
                                    </label>

                                    <input
                                        id="abt_cul_${i}_title"
                                    >

                                </div>


                                <div class="form-group">

                                    <label>
                                        Culture ${i}
                                        - Icon
                                    </label>

                                    <input
                                        id="abt_cul_${i}_icon"
                                    >

                                </div>


                                <div class="form-group full-width">

                                    <label>
                                        Culture ${i}
                                        - Deskripsi
                                    </label>

                                    <textarea
                                        id="abt_cul_${i}_desc"
                                        rows="2"
                                    ></textarea>

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>



            <!-- EXCELLENCE -->

            <div class="admin-card">

                <h4>
                    06. Keunggulan Kami
                </h4>


                <div class="form-grid">


                    <div class="form-group full-width">

                        <label>
                            Judul Section
                        </label>

                        <textarea
                            id="abt_exc_title"
                            rows="2"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            id="abt_exc_desc"
                            rows="3"
                        ></textarea>

                    </div>


                    ${Array.from(
                        {
                            length:
                                3
                        },
                        (
                            _,
                            index
                        ) => {

                            const i =
                                index +
                                1;

                            return `

                                <div class="form-group">

                                    <label>
                                        Keunggulan ${i}
                                        - Judul
                                    </label>

                                    <textarea
                                        id="abt_exc_${i}_title"
                                        rows="2"
                                    ></textarea>

                                </div>


                                <div class="form-group">

                                    <label>
                                        Keunggulan ${i}
                                        - Icon
                                    </label>

                                    <input
                                        id="abt_exc_${i}_icon"
                                    >

                                </div>


                                <div class="form-group full-width">

                                    <label>
                                        Keunggulan ${i}
                                        - Deskripsi
                                    </label>

                                    <textarea
                                        id="abt_exc_${i}_desc"
                                        rows="3"
                                    ></textarea>

                                </div>


                                <div class="form-group full-width">

                                    <label>
                                        Keunggulan ${i}
                                        - Gambar
                                    </label>

                                    <input
                                        type="file"
                                        id="abt_exc_${i}_image"
                                        accept="image/*"
                                    >

                                    <img
                                        id="preview-abt-exc-${i}"
                                        style="
                                            display:none;
                                            width:100%;
                                            max-height:180px;
                                            object-fit:cover;
                                            margin-top:10px;
                                        "
                                    >

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>



            <!-- CTA -->

            <div class="admin-card">

                <h4>
                    07. Final CTA
                </h4>


                <div class="form-grid">


                    <div class="form-group full-width">

                        <label>
                            Judul CTA
                        </label>

                        <textarea
                            id="abt_cta_title"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Deskripsi CTA
                        </label>

                        <textarea
                            id="abt_cta_desc"
                            rows="3"
                        ></textarea>

                    </div>


                    <div class="form-group">

                        <label>
                            Teks Tombol
                        </label>

                        <input
                            id="abt_cta_button_text"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            URL Tombol
                        </label>

                        <input
                            id="abt_cta_button_url"
                        >

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Background CTA
                        </label>

                        <input
                            type="file"
                            id="abt_cta_bg"
                            accept="image/*"
                        >

                        <img
                            id="preview-abt-cta"
                            style="
                                display:none;
                                width:100%;
                                max-height:180px;
                                object-fit:cover;
                                margin-top:10px;
                            "
                        >

                    </div>

                </div>


                <div class="form-actions">

                    <button
                        type="submit"
                        class="btn-primary-admin"
                        id="btn-save-about"
                    >
                        Simpan Halaman About
                    </button>

                </div>

            </div>


        </form>

    `;

}



/* =========================================================
   15. ABOUT IMAGE
   ========================================================= */

function setAboutExistingImage(
    key,
    value
) {

    aboutFormData[key] =
        value || "";

}


function getAboutExistingImage(
    key
) {

    return aboutFormData[
        key
    ] || "";

}



async function processAboutImageField(
    inputId,
    removeId,
    stateKey
) {

    const input =
        getElement(
            inputId
        );


    const removeCheckbox =
        removeId
            ? getElement(
                removeId
            )
            : null;


    if (
        removeCheckbox?.checked
    ) {

        setAboutExistingImage(
            stateKey,
            ""
        );

        return "";

    }


    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {

        return getAboutExistingImage(
            stateKey
        );

    }


    const url =
        await uploadToCloudinary(
            input.files[0]
        );


    setAboutExistingImage(
        stateKey,
        url
    );


    return url;

}



/* =========================================================
   16. ABOUT LOAD
   ========================================================= */

async function loadAboutData() {

    buildAboutAdminUI();


    const snapshot =
        await getDoc(
            doc(
                db,
                "pages",
                "about"
            )
        );


    const firebaseData =
        snapshot.exists()
            ? snapshot.data()
            : {};


    aboutFormData =
        {
            ...DEFAULT_ABOUT_DATA,
            ...firebaseData
        };


    const data =
        aboutFormData;


    /* HERO */

    setValue(
        "abt_hero_badge",
        data.hero_badge
    );


    setValue(
        "abt_hero_title",
        data.hero_title
    );


    setValue(
        "abt_hero_desc",
        data.hero_desc
    );


    setPreview(
        "preview-abt-hero-bg",
        data.hero_bg_url
    );


    setExistingAboutImageField(
        "hero_bg_url",
        data.hero_bg_url
    );



    /* WHO */

    setValue(
        "abt_who_title",
        data.who_title
    );


    setValue(
        "abt_who_desc",
        data.who_desc
    );


    setValue(
        "abt_who_image_text",
        data.who_image_text
    );


    setPreview(
        "preview-abt-who-image",
        data.who_image_url
    );


    setAboutExistingImage(
        "who_image_url",
        data.who_image_url
    );


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        setValue(
            `abt_who_feature_${i}_icon`,
            data[
                `who_feature_${i}_icon`
            ]
        );


        setValue(
            `abt_who_feature_${i}_text`,
            data[
                `who_feature_${i}_text`
            ]
        );

    }



    /* VISI MISI */

    setValue(
        "abt_vm_title",
        data.vm_title
    );


    setValue(
        "abt_vm_header_desc",
        data.vm_header_desc
    );


    setValue(
        "abt_vision_icon",
        data.vision_icon
    );


    setValue(
        "abt_mission_icon",
        data.mission_icon
    );


    setValue(
        "abt_visi_desc",
        data.visi_desc
    );


    setPreview(
        "preview-abt-vm-bg",
        data.vm_bg_url
    );


    setAboutExistingImage(
        "vm_bg_url",
        data.vm_bg_url
    );


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        setValue(
            `abt_misi_${i}`,
            data[
                `misi_${i}`
            ]
        );

    }



    /* LEGAL */

    setValue(
        "abt_legal_title",
        data.legal_title
    );


    setValue(
        "abt_legal_desc",
        data.legal_desc
    );


    setValue(
        "abt_legal_trust_desc",
        data.legal_trust_desc
    );


    for (
        let i = 1;
        i <= 8;
        i++
    ) {

        setValue(
            `abt_leg_${i}_title`,
            data[
                `leg_${i}_title`
            ]
        );


        setValue(
            `abt_leg_${i}_icon`,
            data[
                `leg_${i}_icon`
            ]
        );


        setValue(
            `abt_leg_${i}`,
            data[
                `leg_${i}`
            ]
        );

    }



    /* CULTURE */

    setValue(
        "abt_cul_title",
        data.cul_title
    );


    setValue(
        "abt_cul_desc",
        data.cul_desc
    );


    for (
        let i = 1;
        i <= 6;
        i++
    ) {

        setValue(
            `abt_cul_${i}_title`,
            data[
                `cul_${i}_title`
            ]
        );


        setValue(
            `abt_cul_${i}_icon`,
            data[
                `cul_${i}_icon`
            ]
        );


        setValue(
            `abt_cul_${i}_desc`,
            data[
                `cul_${i}_desc`
            ]
        );

    }



    /* EXCELLENCE */

    setValue(
        "abt_exc_title",
        data.exc_title
    );


    setValue(
        "abt_exc_desc",
        data.exc_desc
    );


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        setValue(
            `abt_exc_${i}_title`,
            data[
                `exc_${i}_title`
            ]
        );


        setValue(
            `abt_exc_${i}_icon`,
            data[
                `exc_${i}_icon`
            ]
        );


        setValue(
            `abt_exc_${i}_desc`,
            data[
                `exc_${i}_desc`
            ]
        );


        setPreview(
            `preview-abt-exc-${i}`,
            data[
                `exc_${i}_image_url`
            ]
        );


        setAboutExistingImage(
            `exc_${i}_image_url`,
            data[
                `exc_${i}_image_url`
            ]
        );

    }



    /* CTA */

    setValue(
        "abt_cta_title",
        data.cta_title
    );


    setValue(
        "abt_cta_desc",
        data.cta_desc
    );


    setValue(
        "abt_cta_button_text",
        data.cta_button_text
    );


    setValue(
        "abt_cta_button_url",
        data.cta_button_url
    );


    setPreview(
        "preview-abt-cta",
        data.cta_bg_url
    );


    setAboutExistingImage(
        "cta_bg_url",
        data.cta_bg_url
    );


    /* IMAGE PREVIEW */

    bindImagePreview(
        "abt_hero_bg",
        "preview-abt-hero-bg"
    );


    bindImagePreview(
        "abt_who_image",
        "preview-abt-who-image"
    );


    bindImagePreview(
        "abt_vm_bg",
        "preview-abt-vm-bg"
    );


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        bindImagePreview(
            `abt_exc_${i}_image`,
            `preview-abt-exc-${i}`
        );

    }


    bindImagePreview(
        "abt_cta_bg",
        "preview-abt-cta"
    );


    const form =
        getElement(
            "form-about"
        );


    if (
        form
    ) {

        form.addEventListener(
            "submit",
            saveAboutData
        );

    }

}



/* helper alias */

function setExistingAboutImageField(
    key,
    value
) {

    setAboutExistingImage(
        key,
        value
    );

}



/* =========================================================
   17. ABOUT SAVE
   ========================================================= */

async function saveAboutData(
    event
) {

    event.preventDefault();


    const button =
        getElement(
            "btn-save-about"
        );


    setButtonLoading(
        button,
        true,
        "Simpan Halaman About"
    );


    try {

        const heroBg =
            await processAboutImageField(
                "abt_hero_bg",
                "remove_abt_hero_bg",
                "hero_bg_url"
            );


        const whoImage =
            await processAboutImageField(
                "abt_who_image",
                "remove_abt_who_image",
                "who_image_url"
            );


        const vmBg =
            await processAboutImageField(
                "abt_vm_bg",
                "remove_abt_vm_bg",
                "vm_bg_url"
            );


        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            await processAboutImageField(
                `abt_exc_${i}_image`,
                null,
                `exc_${i}_image_url`
            );

        }


        const ctaBg =
            await processAboutImageField(
                "abt_cta_bg",
                null,
                "cta_bg_url"
            );


        const data = {

            hero_bg_url:
                heroBg,

            hero_badge:
                getValue(
                    "abt_hero_badge"
                ),

            hero_title:
                getValue(
                    "abt_hero_title"
                ),

            hero_desc:
                getValue(
                    "abt_hero_desc"
                ),


            who_title:
                getValue(
                    "abt_who_title"
                ),

            who_desc:
                getValue(
                    "abt_who_desc"
                ),

            who_image_url:
                whoImage,

            who_image_text:
                getValue(
                    "abt_who_image_text"
                ),


            vm_title:
                getValue(
                    "abt_vm_title"
                ),

            vm_header_desc:
                getValue(
                    "abt_vm_header_desc"
                ),

            vm_bg_url:
                vmBg,

            vision_icon:
                getValue(
                    "abt_vision_icon"
                ),

            mission_icon:
                getValue(
                    "abt_mission_icon"
                ),

            visi_desc:
                getValue(
                    "abt_visi_desc"
                ),


            legal_title:
                getValue(
                    "abt_legal_title"
                ),

            legal_desc:
                getValue(
                    "abt_legal_desc"
                ),

            legal_trust_desc:
                getValue(
                    "abt_legal_trust_desc"
                ),


            cul_title:
                getValue(
                    "abt_cul_title"
                ),

            cul_desc:
                getValue(
                    "abt_cul_desc"
                ),


            exc_title:
                getValue(
                    "abt_exc_title"
                ),

            exc_desc:
                getValue(
                    "abt_exc_desc"
                ),


            cta_title:
                getValue(
                    "abt_cta_title"
                ),

            cta_desc:
                getValue(
                    "abt_cta_desc"
                ),

            cta_button_text:
                getValue(
                    "abt_cta_button_text"
                ),

            cta_button_url:
                getValue(
                    "abt_cta_button_url"
                ),

            cta_bg_url:
                ctaBg,

            updated_at:
                serverTimestamp()

        };


        /* WHO */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            data[
                `who_feature_${i}_icon`
            ] =
                getValue(
                    `abt_who_feature_${i}_icon`
                );


            data[
                `who_feature_${i}_text`
            ] =
                getValue(
                    `abt_who_feature_${i}_text`
                );

        }



        /* MISI */

        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            data[
                `misi_${i}`
            ] =
                getValue(
                    `abt_misi_${i}`
                );

        }



        /* LEGAL */

        for (
            let i = 1;
            i <= 8;
            i++
        ) {

            data[
                `leg_${i}_title`
            ] =
                getValue(
                    `abt_leg_${i}_title`
                );


            data[
                `leg_${i}_icon`
            ] =
                getValue(
                    `abt_leg_${i}_icon`
                );


            data[
                `leg_${i}`
            ] =
                getValue(
                    `abt_leg_${i}`
                );

        }



        /* CULTURE */

        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            data[
                `cul_${i}_title`
            ] =
                getValue(
                    `abt_cul_${i}_title`
                );


            data[
                `cul_${i}_icon`
            ] =
                getValue(
                    `abt_cul_${i}_icon`
                );


            data[
                `cul_${i}_desc`
            ] =
                getValue(
                    `abt_cul_${i}_desc`
                );

        }



        /* EXCELLENCE */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            data[
                `exc_${i}_title`
            ] =
                getValue(
                    `abt_exc_${i}_title`
                );


            data[
                `exc_${i}_icon`
            ] =
                getValue(
                    `abt_exc_${i}_icon`
                );


            data[
                `exc_${i}_desc`
            ] =
                getValue(
                    `abt_exc_${i}_desc`
                );


            data[
                `exc_${i}_image_url`
            ] =
                aboutFormData[
                    `exc_${i}_image_url`
                ] || "";

        }


        await setDoc(
            doc(
                db,
                "pages",
                "about"
            ),
            data,
            {
                merge:
                    true
            }
        );


        aboutFormData =
            {
                ...aboutFormData,
                ...data
            };


        alert(
            "Halaman About berhasil disimpan ke Firebase."
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal menyimpan About:",
            error
        );


        alert(
            error?.message ||
            "Terjadi kesalahan saat menyimpan About."
        );


    } finally {

        setButtonLoading(
            button,
            false,
            "Simpan Halaman About"
        );

    }

}



/* =========================================================
   LAYANAN CMS
   URUTAN FINAL:

   1. JASA KONSTRUKSI
   2. PENYEDIA TENAGA KERJA
   3. PENGADAAN BARANG
   ========================================================= */



/* =========================================================
   DEFAULT DATA LAYANAN
   ========================================================= */

const DEFAULT_LAYANAN_DATA = {

    hero_title:
        "Layanan <span class=\"highlight\">Terpadu Kami</span>",

    hero_desc:
        "Solusi end-to-end untuk kebutuhan tenaga kerja, konstruksi, dan pengadaan proyek Anda.",

    hero_bg_url:
        "assets/images/bg/bg-2.png",



    /* =========================================
       01. JASA KONSTRUKSI
       ========================================= */

    srv_1_badge:
        "GENERAL CONTRACTOR",

    srv_1_title:
        "Jasa Konstruksi",

    srv_1_desc:
        "Kami menawarkan jasa kontraktor yang mencakup perencanaan, pelaksanaan, dan penyelesaian proyek konstruksi. Mulai dari pembangunan infrastruktur, renovasi, hingga pengembangan fasilitas industri.",

    srv_1_icon:
        "construction",

    srv_1_overlay_title:
        "KONSTRUKSI BERKUALITAS",

    srv_1_overlay_desc:
        "UNTUK KEMAJUAN BERSAMA",

    srv_1_image_url:
        "assets/images/bg/bg-2.png",

    srv_1_feat_1:
        "Perencanaan pembangunan matang dan detail.",

    srv_1_feat_2:
        "Kualitas pengerjaan tinggi.",

    srv_1_feat_3:
        "Manajemen proyek berpengalaman.",

    srv_1_feat_4:
        "Kepatuhan terhadap standar keselamatan kerja.",

    srv_1_feat_5:
        "Penyelesaian proyek sesuai target waktu.",

    srv_1_button_text:
        "Konsultasi Proyek Konstruksi",

    srv_1_button_url:
        "https://wa.me/6281234567890",



    /* =========================================
       02. PENYEDIA TENAGA KERJA
       ========================================= */

    srv_2_badge:
        "OUTSOURCING SERVICE",

    srv_2_title:
        "Penyedia Tenaga Kerja",

    srv_2_desc:
        "Kami menyediakan tenaga kerja terlatih, berkompeten, dan sesuai dengan kebutuhan Anda, baik untuk jangka pendek maupun panjang. Tim kami mencakup tenaga ahli di berbagai bidang, mulai dari teknisi, administrasi, hingga operator di berbagai industri.",

    srv_2_icon:
        "groups",

    srv_2_overlay_title:
        "TENAGA KERJA BERKUALITAS",

    srv_2_overlay_desc:
        "UNTUK HASIL MAKSIMAL",

    srv_2_image_url:
        "assets/images/bg/bg-5.png",

    srv_2_feat_1:
        "Proses rekrutmen ketat dan selektif.",

    srv_2_feat_2:
        "Tenaga kerja profesional dan berpengalaman.",

    srv_2_feat_3:
        "Penempatan sesuai kebutuhan perusahaan.",

    srv_2_feat_4:
        "Administrasi tenaga kerja terkelola dengan baik.",

    srv_2_feat_5:
        "Meningkatkan efisiensi dan produktivitas kerja.",

    srv_2_button_text:
        "Lihat Detail Manpower",

    srv_2_button_url:
        "https://wa.me/6281234567890",



    /* =========================================
       03. PENGADAAN BARANG
       ========================================= */

    srv_3_badge:
        "SUPPLIER",

    srv_3_title:
        "Pengadaan Barang",

    srv_3_desc:
        "Kami menyediakan berbagai kebutuhan barang dan material dengan kualitas terjamin dari supplier terpercaya, sesuai dengan spesifikasi dan kebutuhan proyek Anda.",

    srv_3_icon:
        "inventory_2",

    srv_3_overlay_title:
        "PENGADAAN TEPAT",

    srv_3_overlay_desc:
        "KUALITAS TERJAMIN",

    srv_3_image_url:
        "assets/images/bg/bg-6.png",

    srv_3_feat_1:
        "Produk berkualitas sesuai spesifikasi.",

    srv_3_feat_2:
        "Pengadaan dari supplier terpercaya.",

    srv_3_feat_3:
        "Harga kompetitif dan transparan.",

    srv_3_feat_4:
        "Pengiriman tepat waktu dan aman.",

    srv_3_feat_5:
        "Dokumentasi pengadaan yang lengkap.",

    srv_3_button_text:
        "Konsultasi Pengadaan",

    srv_3_button_url:
        "https://wa.me/6281234567890",



    /* =========================================
       FINAL CTA
       ========================================= */

    cta_title:
        "Butuh Solusi Khusus untuk Proyek Anda?",

    cta_desc:
        "Tim kami siap mendiskusikan kebutuhan Anda dan merumuskan solusi terbaik.",

    cta_button_text:
        "Konsultasi Sekarang",

    cta_button_url:
        "https://wa.me/6281234567890",

    cta_bg_url:
        "assets/images/bg/bg-2.png"

};



/* =========================================================
   IMAGE STATE
   ========================================================= */

function setLayananExistingImage(
    key,
    value
) {

    layananFormData[key] =
        value || "";

}


function getLayananExistingImage(
    key
) {

    return layananFormData[
        key
    ] || "";

}



/* =========================================================
   PROCESS IMAGE
   ========================================================= */

async function processLayananImageField(
    inputId,
    removeId,
    stateKey
) {

    const input =
        getElement(
            inputId
        );


    const removeCheckbox =
        removeId
            ? getElement(
                removeId
            )
            : null;


    if (
        removeCheckbox &&
        removeCheckbox.checked
    ) {

        setLayananExistingImage(
            stateKey,
            ""
        );

        return "";

    }


    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {

        return getLayananExistingImage(
            stateKey
        );

    }


    const url =
        await uploadToCloudinary(
            input.files[0]
        );


    setLayananExistingImage(
        stateKey,
        url
    );


    return url;

}



/* =========================================================
   LOAD LAYANAN
   ========================================================= */

async function loadLayananData() {

    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "pages",
                    "layanan"
                )
            );


        const firebaseData =
            snapshot.exists()
                ? snapshot.data()
                : {};


        layananFormData =
            {
                ...DEFAULT_LAYANAN_DATA,
                ...firebaseData
            };


        const data =
            layananFormData;



        /* =========================================
           HERO
           ========================================= */

        setValue(
            "srv_hero_title",
            data.hero_title
        );


        setValue(
            "srv_hero_desc",
            data.hero_desc
        );


        setLayananExistingImage(
            "hero_bg_url",
            data.hero_bg_url
        );


        setPreview(
            "preview-srv-hero-bg",
            data.hero_bg_url
        );



        /* =========================================
           SERVICES
           ========================================= */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            setValue(
                `srv_${i}_badge`,
                data[
                    `srv_${i}_badge`
                ]
            );


            setValue(
                `srv_${i}_title`,
                data[
                    `srv_${i}_title`
                ]
            );


            setValue(
                `srv_${i}_desc`,
                data[
                    `srv_${i}_desc`
                ]
            );


            setValue(
                `srv_${i}_icon`,
                data[
                    `srv_${i}_icon`
                ]
            );


            setValue(
                `srv_${i}_overlay_title`,
                data[
                    `srv_${i}_overlay_title`
                ]
            );


            setValue(
                `srv_${i}_overlay_desc`,
                data[
                    `srv_${i}_overlay_desc`
                ]
            );


            setLayananExistingImage(
                `srv_${i}_image`,
                data[
                    `srv_${i}_image_url`
                ]
            );


            setPreview(
                `preview-srv-${i}-image`,
                data[
                    `srv_${i}_image_url`
                ]
            );


            for (
                let j = 1;
                j <= 5;
                j++
            ) {

                setValue(
                    `srv_${i}_feat_${j}`,
                    data[
                        `srv_${i}_feat_${j}`
                    ]
                );

            }


            setValue(
                `srv_${i}_button_text`,
                data[
                    `srv_${i}_button_text`
                ]
            );


            setValue(
                `srv_${i}_button_url`,
                data[
                    `srv_${i}_button_url`
                ]
            );

        }



        /* =========================================
           CTA
           ========================================= */

        setValue(
            "srv_cta_title",
            data.cta_title
        );


        setValue(
            "srv_cta_desc",
            data.cta_desc
        );


        setValue(
            "srv_cta_button_text",
            data.cta_button_text
        );


        setValue(
            "srv_cta_button_url",
            data.cta_button_url
        );


        setLayananExistingImage(
            "cta_bg_url",
            data.cta_bg_url
        );


        setPreview(
            "preview-srv-cta-bg",
            data.cta_bg_url
        );


        console.log(
            "Layanan CMS loaded."
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal memuat Layanan CMS:",
            error
        );


        alert(
            "Gagal mengambil data Layanan dari Firebase."
        );

    }

}



/* =========================================================
   SAVE LAYANAN
   ========================================================= */

async function saveLayananData(
    event
) {

    event.preventDefault();


    const button =
        getElement(
            "btn-save-layanan"
        );


    setButtonLoading(
        button,
        true,
        "Simpan Halaman Layanan"
    );


    try {


        /* =========================================
           HERO IMAGE
           ========================================= */

        const heroBackground =
            await processLayananImageField(
                "srv_hero_bg",
                "remove_srv_hero_bg",
                "hero_bg_url"
            );



        /* =========================================
           SERVICE IMAGES
           ========================================= */

        const serviceImages =
            {};


        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            serviceImages[i] =
                await processLayananImageField(
                    `srv_${i}_image`,
                    `remove_srv_${i}_image`,
                    `srv_${i}_image`
                );

        }



        /* =========================================
           CTA IMAGE
           ========================================= */

        const ctaBackground =
            await processLayananImageField(
                "srv_cta_bg",
                "remove_srv_cta_bg",
                "cta_bg_url"
            );



        /* =========================================
           BASE DATA
           ========================================= */

        const data = {

            hero_title:
                getValue(
                    "srv_hero_title"
                ),

            hero_desc:
                getValue(
                    "srv_hero_desc"
                ),

            hero_bg_url:
                heroBackground,


            cta_title:
                getValue(
                    "srv_cta_title"
                ),

            cta_desc:
                getValue(
                    "srv_cta_desc"
                ),

            cta_button_text:
                getValue(
                    "srv_cta_button_text"
                ),

            cta_button_url:
                getValue(
                    "srv_cta_button_url"
                ),

            cta_bg_url:
                ctaBackground,


            updated_at:
                serverTimestamp()

        };



        /* =========================================
           SERVICE 1-3
           ========================================= */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {


            data[
                `srv_${i}_badge`
            ] =
                getValue(
                    `srv_${i}_badge`
                );


            data[
                `srv_${i}_title`
            ] =
                getValue(
                    `srv_${i}_title`
                );


            data[
                `srv_${i}_desc`
            ] =
                getValue(
                    `srv_${i}_desc`
                );


            data[
                `srv_${i}_icon`
            ] =
                getValue(
                    `srv_${i}_icon`
                );


            data[
                `srv_${i}_overlay_title`
            ] =
                getValue(
                    `srv_${i}_overlay_title`
                );


            data[
                `srv_${i}_overlay_desc`
            ] =
                getValue(
                    `srv_${i}_overlay_desc`
                );


            data[
                `srv_${i}_image_url`
            ] =
                serviceImages[i];


            for (
                let j = 1;
                j <= 5;
                j++
            ) {

                data[
                    `srv_${i}_feat_${j}`
                ] =
                    getValue(
                        `srv_${i}_feat_${j}`
                    );

            }


            data[
                `srv_${i}_button_text`
            ] =
                getValue(
                    `srv_${i}_button_text`
                );


            data[
                `srv_${i}_button_url`
            ] =
                getValue(
                    `srv_${i}_button_url`
                );

        }



        /* =========================================
           FIRESTORE
           ========================================= */

        await setDoc(
            doc(
                db,
                "pages",
                "layanan"
            ),
            data,
            {
                merge:
                    true
            }
        );


        layananFormData =
            {
                ...layananFormData,
                ...data
            };


        alert(
            "Halaman Layanan berhasil disimpan ke Firebase."
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal menyimpan Layanan:",
            error
        );


        alert(
            error?.message ||
            "Terjadi kesalahan saat menyimpan Layanan."
        );


    } finally {

        setButtonLoading(
            button,
            false,
            "Simpan Halaman Layanan"
        );

    }

}



/* =========================================================
   INIT LAYANAN FORM
   ========================================================= */

function initLayananForm() {

    const form =
        getElement(
            "form-layanan"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        saveLayananData
    );


    bindImagePreview(
        "srv_hero_bg",
        "preview-srv-hero-bg"
    );


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        bindImagePreview(
            `srv_${i}_image`,
            `preview-srv-${i}-image`
        );

    }


    bindImagePreview(
        "srv_cta_bg",
        "preview-srv-cta-bg"
    );

}


// ============================================================================
// 16. WORK EXPERIENCE & CLIENTS
// ============================================================================



/* =========================================================
   SAFE HTML
   ========================================================= */

function escapeAdminHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatAdminDate(
    value
) {

    try {

        let date;


        if (
            value?.toDate
        ) {

            date =
                value.toDate();

        } else if (
            value instanceof Date
        ) {

            date =
                value;

        } else if (
            value
        ) {

            date =
                new Date(
                    value
                );

        }


        if (
            !date ||
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";

        }


        return new Intl.DateTimeFormat(
            "id-ID",
            {
                day:
                    "2-digit",
                month:
                    "2-digit",
                year:
                    "numeric"
            }
        )
            .format(
                date
            );

    } catch (
        error
    ) {

        return "-";

    }

}



/* =========================================================
   WORK EXPERIENCE
   ========================================================= */

async function loadWorkExperienceData() {

    const tableBody =
        getElement(
            "project-table-body"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="text-center"
            >
                Memuat data...
            </td>

        </tr>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "work_experience"
                )
            );


        const projects = [];


        snapshot.forEach(
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


        projects.sort(
            (
                a,
                b
            ) => {

                const aTime =
                    a.created_at?.seconds ||
                    0;


                const bTime =
                    b.created_at?.seconds ||
                    0;


                if (
                    aTime !==
                    bTime
                ) {

                    return (
                        bTime -
                        aTime
                    );

                }


                const aYear =
                    Number(
                        a.year ||
                        0
                    );


                const bYear =
                    Number(
                        b.year ||
                        0
                    );


                return (
                    bYear -
                    aYear
                );

            }
        );


        if (
            projects.length ===
            0
        ) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="text-center"
                        style="
                            padding:30px;
                            color:#7B8794;
                        "
                    >
                        Belum ada proyek.
                    </td>

                </tr>

            `;

            return;

        }


        let html =
            "";


        projects.forEach(
            (
                project
            ) => {

                const imageUrl =
                    project.imageUrl ||
                    project.thumbnail_url ||
                    "";


                const title =
                    escapeAdminHTML(
                        project.title ||
                        "-"
                    );


                const client =
                    escapeAdminHTML(
                        project.client ||
                        project.client_name ||
                        "-"
                    );


                const category =
                    String(
                        project.category ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                let categoryLabel =
                    "Lainnya";


                if (
                    category ===
                    "konstruksi"
                ) {

                    categoryLabel =
                        "Konstruksi";

                } else if (
                    category ===
                    "manpower"
                ) {

                    categoryLabel =
                        "Penyedia Tenaga Kerja";

                } else if (
                    category ===
                    "pengadaan"
                ) {

                    categoryLabel =
                        "Pengadaan Barang";

                }


                const year =
                    escapeAdminHTML(
                        project.year ||
                        "-"
                    );


                const id =
                    escapeAdminHTML(
                        project.id
                    );


                html += `

                    <tr>

                        <td>

                            ${
                                imageUrl
                                    ? `

                                        <img
                                            src="${escapeAdminHTML(
                                                imageUrl
                                            )}"
                                            alt="${title}"
                                            style="
                                                width:65px;
                                                height:45px;
                                                object-fit:cover;
                                                border-radius:6px;
                                            "
                                        >

                                      `
                                    : `

                                        <div
                                            style="
                                                width:65px;
                                                height:45px;
                                                border-radius:6px;
                                                background:#EEF2F7;
                                                display:flex;
                                                align-items:center;
                                                justify-content:center;
                                            "
                                        >

                                            <span
                                                class="
                                                    material-icons
                                                "
                                                style="
                                                    color:#94A3B8;
                                                "
                                            >
                                                image
                                            </span>

                                        </div>

                                      `
                            }

                        </td>


                        <td>
                            ${title}
                        </td>


                        <td>
                            ${client}
                        </td>


                        <td>
                            ${escapeAdminHTML(
                                categoryLabel
                            )}
                        </td>


                        <td>
                            ${year}
                        </td>


                        <td>

                            <button
                                type="button"
                                class="btn-danger-admin btn-delete-project"
                                data-id="${id}"
                                style="
                                    border:none;
                                    background:#FEE2E2;
                                    color:#B91C1C;
                                    padding:8px 12px;
                                    border-radius:6px;
                                    cursor:pointer;
                                "
                            >

                                <span
                                    class="
                                        material-icons
                                    "
                                    style="
                                        font-size:18px;
                                        vertical-align:middle;
                                    "
                                >
                                    delete
                                </span>

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        tableBody.innerHTML =
            html;



        /* =================================================
           DELETE PROJECT
           ================================================= */

        tableBody
            .querySelectorAll(
                ".btn-delete-project"
            )
            .forEach(
                (
                    button
                ) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const projectId =
                                button.dataset.id;


                            if (
                                !projectId
                            ) {

                                return;

                            }


                            const confirmed =
                                window.confirm(
                                    "Hapus proyek ini?"
                                );


                            if (
                                !confirmed
                            ) {

                                return;

                            }


                            try {

                                button.disabled =
                                    true;


                                await deleteDoc(
                                    doc(
                                        db,
                                        "work_experience",
                                        projectId
                                    )
                                );


                                await loadWorkExperienceData();


                                alert(
                                    "Proyek berhasil dihapus."
                                );


                                if (
                                    window.refreshPageAnimations
                                ) {

                                    window.refreshPageAnimations(
                                        document.getElementById(
                                            "app-content"
                                        )
                                    );

                                }

                            } catch (
                                error
                            ) {

                                console.error(
                                    "Gagal menghapus proyek:",
                                    error
                                );


                                alert(
                                    error?.message ||
                                    "Proyek gagal dihapus."
                                );


                                button.disabled =
                                    false;

                            }

                        }
                    );

                }
            );


    } catch (
        error
    ) {

        console.error(
            "Gagal mengambil data Work Experience:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center"
                    style="
                        padding:30px;
                        color:#B91C1C;
                    "
                >

                    Gagal memuat data proyek.

                    <br>

                    <small>
                        ${escapeAdminHTML(
                            error?.message ||
                            "Unknown error"
                        )}
                    </small>

                </td>

            </tr>

        `;

    }

}



/* =========================================================
   ADD PROJECT
   ========================================================= */

function initWorkExperienceAdmin() {

    const addButton =
        getElement(
            "btn-add-project"
        );


    const cancelButton =
        getElement(
            "btn-cancel-project"
        );


    const formContainer =
        getElement(
            "form-add-project"
        );


    const form =
        getElement(
            "projectForm"
        );


    if (
        addButton &&
        formContainer
    ) {

        addButton.addEventListener(
            "click",
            () => {

                formContainer.style.display =
                    formContainer.style.display ===
                    "none"
                        ? "block"
                        : "none";

            }
        );

    }


    if (
        cancelButton
    ) {

        cancelButton.addEventListener(
            "click",
            () => {

                if (
                    form
                ) {

                    form.reset();

                }


                if (
                    formContainer
                ) {

                    formContainer.style.display =
                        "none";

                }

            }
        );

    }


    if (
        form
    ) {

        form.addEventListener(
            "submit",
            async (
                event
            ) => {

                event.preventDefault();


                const name =
                    getValue(
                        "projName"
                    );


                const client =
                    getValue(
                        "projClient"
                    );


                const category =
                    getValue(
                        "projCategory"
                    );


                const year =
                    getValue(
                        "projYear"
                    );


                const imageInput =
                    getElement(
                        "projImage"
                    );


                if (
                    !name ||
                    !client ||
                    !category ||
                    !year ||
                    !imageInput?.files?.[0]
                ) {

                    alert(
                        "Lengkapi semua data proyek dan pilih foto proyek."
                    );

                    return;

                }


                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                setButtonLoading(
                    submitButton,
                    true,
                    "Simpan Proyek"
                );


                try {

                    const imageUrl =
                        await uploadToCloudinary(
                            imageInput.files[0]
                        );


                    if (
                        !imageUrl
                    ) {

                        throw new Error(
                            "Gambar proyek gagal diupload."
                        );

                    }


                    await addDoc(
                        collection(
                            db,
                            "work_experience"
                        ),
                        {

                            title:
                                name,

                            client:
                                client,

                            client_name:
                                client,

                            category:
                                category,

                            year:
                                Number(
                                    year
                                ),

                            imageUrl:
                                imageUrl,

                            thumbnail_url:
                                imageUrl,

                            created_at:
                                serverTimestamp()

                        }
                    );


                    alert(
                        "Proyek berhasil ditambahkan."
                    );


                    form.reset();


                    if (
                        formContainer
                    ) {

                        formContainer.style.display =
                            "none";

                    }


                    await loadWorkExperienceData();


                } catch (
                    error
                ) {

                    console.error(
                        "Gagal menambah proyek:",
                        error
                    );


                    alert(
                        error?.message ||
                        "Proyek gagal ditambahkan."
                    );

                } finally {

                    setButtonLoading(
                        submitButton,
                        false,
                        "Simpan Proyek"
                    );

                }

            }
        );

    }


    bindImagePreview(
        "projImage",
        "preview-project-image"
    );


    loadWorkExperienceData();

}



/* =========================================================
   CLIENTS
   ========================================================= */

async function loadClientsData() {

    const tableBody =
        getElement(
            "client-table-body"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="4"
                class="text-center"
            >
                Memuat data...
            </td>

        </tr>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "clients"
                )
            );


        const clients =
            [];


        snapshot.forEach(
            (
                clientDoc
            ) => {

                clients.push({

                    id:
                        clientDoc.id,

                    ...clientDoc.data()

                });

            }
        );


        clients.sort(
            (
                a,
                b
            ) => {

                const aTime =
                    a.created_at?.seconds ||
                    0;


                const bTime =
                    b.created_at?.seconds ||
                    0;


                return (
                    bTime -
                    aTime
                );

            }
        );


        if (
            clients.length ===
            0
        ) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="text-center"
                        style="
                            padding:30px;
                            color:#7B8794;
                        "
                    >
                        Belum ada logo klien.
                    </td>

                </tr>

            `;

            return;

        }


        let html =
            "";


        clients.forEach(
            (
                client
            ) => {

                const id =
                    escapeAdminHTML(
                        client.id
                    );


                const name =
                    escapeAdminHTML(
                        client.name ||
                        "Client"
                    );


                const logo =
                    client.logoUrl ||
                    "";


                html += `

                    <tr>

                        <td>

                            ${
                                logo
                                    ? `

                                        <img
                                            src="${escapeAdminHTML(
                                                logo
                                            )}"
                                            alt="${name}"
                                            style="
                                                width:65px;
                                                height:45px;
                                                object-fit:contain;
                                                border-radius:6px;
                                                background:#F8FAFC;
                                                padding:4px;
                                            "
                                        >

                                      `
                                    : `
                                        -
                                      `
                            }

                        </td>


                        <td>
                            ${name}
                        </td>


                        <td>
                            ${formatAdminDate(
                                client.created_at
                            )}
                        </td>


                        <td>

                            <button
                                type="button"
                                class="btn-delete-client"
                                data-id="${id}"
                                style="
                                    border:none;
                                    background:#FEE2E2;
                                    color:#B91C1C;
                                    padding:8px 12px;
                                    border-radius:6px;
                                    cursor:pointer;
                                "
                            >

                                <span
                                    class="
                                        material-icons
                                    "
                                    style="
                                        font-size:18px;
                                        vertical-align:middle;
                                    "
                                >
                                    delete
                                </span>

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        tableBody.innerHTML =
            html;



        /* =================================================
           DELETE CLIENT
           ================================================= */

        tableBody
            .querySelectorAll(
                ".btn-delete-client"
            )
            .forEach(
                (
                    button
                ) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const clientId =
                                button.dataset.id;


                            if (
                                !clientId
                            ) {

                                return;

                            }


                            const confirmed =
                                window.confirm(
                                    "Hapus logo klien ini?"
                                );


                            if (
                                !confirmed
                            ) {

                                return;

                            }


                            try {

                                button.disabled =
                                    true;


                                await deleteDoc(
                                    doc(
                                        db,
                                        "clients",
                                        clientId
                                    )
                                );


                                await loadClientsData();


                                alert(
                                    "Logo klien berhasil dihapus."
                                );


                            } catch (
                                error
                            ) {

                                console.error(
                                    "Gagal menghapus klien:",
                                    error
                                );


                                alert(
                                    error?.message ||
                                    "Logo klien gagal dihapus."
                                );


                                button.disabled =
                                    false;

                            }

                        }
                    );

                }
            );


    } catch (
        error
    ) {

        console.error(
            "Gagal mengambil data klien:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="text-center"
                    style="
                        padding:30px;
                        color:#B91C1C;
                    "
                >

                    Gagal memuat data klien.

                    <br>

                    <small>
                        ${escapeAdminHTML(
                            error?.message ||
                            "Unknown error"
                        )}
                    </small>

                </td>

            </tr>

        `;

    }

}



/* =========================================================
   ADD CLIENT
   ========================================================= */

function initClientsAdmin() {

    const addButton =
        getElement(
            "btn-add-client"
        );


    const cancelButton =
        getElement(
            "btn-cancel-client"
        );


    const formContainer =
        getElement(
            "form-add-client"
        );


    const form =
        getElement(
            "clientForm"
        );


    if (
        addButton &&
        formContainer
    ) {

        addButton.addEventListener(
            "click",
            () => {

                formContainer.style.display =
                    formContainer.style.display ===
                    "none"
                        ? "block"
                        : "none";

            }
        );

    }


    if (
        cancelButton
    ) {

        cancelButton.addEventListener(
            "click",
            () => {

                if (
                    form
                ) {

                    form.reset();

                }


                if (
                    formContainer
                ) {

                    formContainer.style.display =
                        "none";

                }

            }
        );

    }


    if (
        form
    ) {

        form.addEventListener(
            "submit",
            async (
                event
            ) => {

                event.preventDefault();


                const name =
                    getValue(
                        "clientName"
                    );


                const logoInput =
                    getElement(
                        "clientLogo"
                    );


                if (
                    !name ||
                    !logoInput?.files?.[0]
                ) {

                    alert(
                        "Isi nama klien dan pilih logo terlebih dahulu."
                    );

                    return;

                }


                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                setButtonLoading(
                    submitButton,
                    true,
                    "Simpan Logo"
                );


                try {

                    const logoUrl =
                        await uploadToCloudinary(
                            logoInput.files[0]
                        );


                    if (
                        !logoUrl
                    ) {

                        throw new Error(
                            "Logo gagal diupload."
                        );

                    }


                    await addDoc(
                        collection(
                            db,
                            "clients"
                        ),
                        {

                            name:
                                name,

                            logoUrl:
                                logoUrl,

                            created_at:
                                serverTimestamp()

                        }
                    );


                    alert(
                        "Logo klien berhasil ditambahkan."
                    );


                    form.reset();


                    if (
                        formContainer
                    ) {

                        formContainer.style.display =
                            "none";

                    }


                    await loadClientsData();


                } catch (
                    error
                ) {

                    console.error(
                        "Gagal menambah klien:",
                        error
                    );


                    alert(
                        error?.message ||
                        "Logo klien gagal ditambahkan."
                    );

                } finally {

                    setButtonLoading(
                        submitButton,
                        false,
                        "Simpan Logo"
                    );

                }

            }
        );

    }

}




// ============================================================================
// 16. PENGATURAN UTAMA
// ============================================================================


/* =========================================================
   LOAD PENGATURAN UTAMA
   ========================================================= */

async function loadUtamaData() {

    try {

        const docRef =
            doc(
                db,
                "settings",
                "general"
            );


        const docSnap =
            await getDoc(
                docRef
            );


        if (
            docSnap.exists()
        ) {

            utamaFormData =
                docSnap.data();

        } else {

            utamaFormData =
                {};

        }


        /* =================================================
           LOGO / FILE

           File input tidak bisa diisi ulang dengan URL.
           Jadi kita hanya menyimpan URL existing di state.
           ================================================= */


        setValue(
            "company_name",
            utamaFormData.company_name
        );


        setValue(
            "tagline",
            utamaFormData.tagline
        );


        setValue(
            "company_desc",
            utamaFormData.company_desc
        );


        setValue(
            "footer_motto",
            utamaFormData.footer_motto
        );


        setValue(
            "contact_wa",
            utamaFormData.contact_wa
        );


        setValue(
            "contact_email",
            utamaFormData.contact_email
        );


        setValue(
            "contact_address",
            utamaFormData.contact_address
        );


        setValue(
            "socmed_linkedin",
            utamaFormData.socmed_linkedin
        );


        setValue(
            "socmed_ig",
            utamaFormData.socmed_ig
        );


        setValue(
            "legal_nib",
            utamaFormData.legal_nib
        );


        setValue(
            "legal_npwp",
            utamaFormData.legal_npwp
        );


        setValue(
            "legal_sbujk",
            utamaFormData.legal_sbujk
        );


        console.log(
            "Pengaturan Utama berhasil dimuat."
        );


    } catch (
        error
    ) {

        console.error(
            "Gagal memuat Pengaturan Utama:",
            error
        );


        alert(
            error?.message ||
            "Gagal mengambil Pengaturan Utama dari Firebase."
        );

    }

}



/* =========================================================
   SAVE PENGATURAN UTAMA
   ========================================================= */

async function saveUtamaData(
    event
) {

    /*
     * INI YANG MENCEGAH PAGE RELOAD
     */
    event.preventDefault();


    event.stopPropagation();


    const button =
        getElement(
            "btn-save-utama"
        );


    setButtonLoading(
        button,
        true,
        "Simpan Pengaturan Utama"
    );


    try {

        /* =================================================
           LOGO UTAMA
           ================================================= */

        let logoUrl =
            utamaFormData.logo_url ||
            "";


        const logoInput =
            getElement(
                "logo_url"
            );


        if (
            logoInput &&
            logoInput.files &&
            logoInput.files[0]
        ) {

            logoUrl =
                await uploadToCloudinary(
                    logoInput.files[0]
                );

        }



        /* =================================================
           LOGO FOOTER
           ================================================= */

        let logoFooterUrl =
            utamaFormData.logo_footer_url ||
            "";


        const logoFooterInput =
            getElement(
                "logo_footer_url"
            );


        if (
            logoFooterInput &&
            logoFooterInput.files &&
            logoFooterInput.files[0]
        ) {

            logoFooterUrl =
                await uploadToCloudinary(
                    logoFooterInput.files[0]
                );

        }



        /* =================================================
           DATA
           ================================================= */

        const data = {

            logo_url:
                logoUrl,

            logo_footer_url:
                logoFooterUrl,


            company_name:
                getValue(
                    "company_name"
                ),

            tagline:
                getValue(
                    "tagline"
                ),

            company_desc:
                getValue(
                    "company_desc"
                ),

            footer_motto:
                getValue(
                    "footer_motto"
                ),


            contact_wa:
                getValue(
                    "contact_wa"
                ),

            contact_email:
                getValue(
                    "contact_email"
                ),

            contact_address:
                getValue(
                    "contact_address"
                ),


            socmed_linkedin:
                getValue(
                    "socmed_linkedin"
                ),

            socmed_ig:
                getValue(
                    "socmed_ig"
                ),


            legal_nib:
                getValue(
                    "legal_nib"
                ),

            legal_npwp:
                getValue(
                    "legal_npwp"
                ),

            legal_sbujk:
                getValue(
                    "legal_sbujk"
                ),


            updated_at:
                serverTimestamp()

        };



        /* =================================================
           FIRESTORE
           ================================================= */

        await setDoc(
            doc(
                db,
                "settings",
                "general"
            ),
            data,
            {
                merge:
                    true
            }
        );


        /* =================================================
           UPDATE LOCAL STATE
           ================================================= */

        utamaFormData =
            {
                ...utamaFormData,
                ...data
            };


        alert(
            "Pengaturan Utama berhasil disimpan."
        );


        /*
         * TIDAK ADA:
         * window.location.reload()
         *
         * TIDAK ADA:
         * submit default form
         *
         * Jadi halaman tetap berada di Admin.
         */


    } catch (
        error
    ) {

        console.error(
            "Gagal menyimpan Pengaturan Utama:",
            error
        );


        alert(
            error?.message ||
            "Terjadi kesalahan saat menyimpan Pengaturan Utama."
        );


    } finally {

        setButtonLoading(
            button,
            false,
            "Simpan Pengaturan Utama"
        );

    }

}



/* =========================================================
   INIT FORM UTAMA
   ========================================================= */

function initUtamaForm() {

    const form =
        getElement(
            "form-utama"
        );


    if (!form) {

        console.warn(
            "Form Utama belum ditemukan."
        );

        return;

    }


    /*
     * PENTING:
     * Event listener submit dipasang di sini.
     */

    form.addEventListener(
        "submit",
        saveUtamaData
    );


    /*
     * Supaya klik tombol benar-benar
     * menggunakan handler di atas.
     */

    const button =
        getElement(
            "btn-save-utama"
        );


    if (button) {

        button.type =
            "submit";

    }


    console.log(
        "Form Pengaturan Utama aktif."
    );

}


/* =========================================================
   18. AUTH
   ========================================================= */

function initAuth() {

    const loader =
        getElement(
            "auth-loader"
        );


    const layout =
        getElement(
            "admin-layout"
        );


    onAuthStateChanged(
        auth,
        (
            user
        ) => {

            if (
                user
            ) {

                if (
                    loader
                ) {

                    loader.style.display =
                        "none";

                }


                if (
                    layout
                ) {

                    layout.style.display =
                        "flex";

                }

                initSidebarNavigation();

                initUtamaForm();

                initHomeForm();

                loadUtamaData();

                initWorkExperienceAdmin();

                initClientsAdmin();

                loadHomeData();

                initLayananForm();

                return;

            }


            if (
                loader
            ) {

                loader.innerHTML = `

                    <div
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >

                        <h2>
                            Akses Ditolak
                        </h2>

                        <p>
                            Silakan login sebagai administrator.
                        </p>

                        <a
                            href="login.html"
                            style="
                                display:inline-block;
                                margin-top:15px;
                                padding:12px 20px;
                                background:#0B2545;
                                color:white;
                                text-decoration:none;
                                border-radius:6px;
                            "
                        >
                            Login Administrator
                        </a>

                    </div>

                `;

            }


            if (
                layout
            ) {

                layout.style.display =
                    "none";

            }

        }
    );

}



/* =========================================================
   19. LOGOUT
   ========================================================= */

function initLogout() {

    const logoutButton =
        document.querySelector(
            ".logout-btn"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        async (
            event
        ) => {

            event.preventDefault();


            try {

                await signOut(
                    auth
                );


                window.location.href =
                    "login.html";


            } catch (
                error
            ) {

                console.error(
                    "Logout gagal:",
                    error
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}



/* =========================================================
   20. START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initAuth();

        initLogout();

    }
);



/* =========================================================
   21. SPINNER
   ========================================================= */

const spinStyle =
    document.createElement(
        "style"
    );


spinStyle.textContent = `

    @keyframes adminSpin {

        from {
            transform:
                rotate(0deg);
        }

        to {
            transform:
                rotate(360deg);
        }

    }

`;


document.head.appendChild(
    spinStyle
);