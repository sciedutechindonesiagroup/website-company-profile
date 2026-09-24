/* =========================================================
   PT DIRATAMA MAPAN SEJAHTERA
   SCROLL ANIMATION ENGINE
   ========================================================= */

(() => {

    const motionQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    const state = {

        observer: null,

        parallaxItems: [],

        rafId: null

    };


    /* =====================================================
       ENABLE MOTION MODE
       ===================================================== */

    if (!motionQuery.matches) {

        document.documentElement.classList.add(
            "motion-ready"
        );

    }


    /* =====================================================
       GET ROOT CONTENT
       ===================================================== */

    function getRoot(root) {

        if (root instanceof Element) {
            return root;
        }

        return document;

    }


    /* =====================================================
       APPLY SECTION CLASSES
       ===================================================== */

    function prepareSections(root) {

        const scope = getRoot(root);


        const sections =
            scope.querySelectorAll(
                "#app-content section, .site-footer"
            );


        sections.forEach((section) => {

            section.classList.add(
                "reveal-section"
            );

        });


        return sections;

    }


    /* =====================================================
       APPLY STAGGERED ELEMENTS
       ===================================================== */

    function prepareStaggeredElements(root) {

        const scope = getRoot(root);


        const groups = [

            ".hero .text-content > *",

            ".hero .scroll-indicator",

            ".about-container > *",

            ".about-features > .feature-row",

            ".values-header > *",

            ".values-grid > .value-card",

            ".services-header > *",

            ".services-grid > .service-card",

            ".work-header > *",

            "#home-portfolio-grid > .port-card",

            ".final-cta-left > *"

        ];


        groups.forEach((selector) => {

            const elements =
                scope.querySelectorAll(selector);


            elements.forEach((element, index) => {

                element.classList.add(
                    "reveal-item"
                );


                element.style.setProperty(
                    "--reveal-delay",
                    index
                );

            });

        });

    }


    /* =====================================================
       PREPARE PARALLAX ITEMS
       ===================================================== */

    function prepareParallax(root) {

        const scope = getRoot(root);


        const parallaxMap = [

            {
                selector: ".hero .slide",
                speed: 0.045
            },

            {
                selector:
                    ".about-visuals .main-image-wrapper",
                speed: 0.035
            },

            {
                selector:
                    ".about-visuals .secondary-image-wrapper",
                speed: -0.06
            },

            {
                selector:
                    ".values-section .decor-right-text",
                speed: -0.08
            },

            {
                selector:
                    ".services-decor",
                speed: -0.06
            },

            {
                selector:
                    ".work-decor",
                speed: -0.08
            },

            {
                selector:
                    ".final-cta-bg-img",
                speed: 0.05
            }

        ];


        state.parallaxItems = [];


        if (
            motionQuery.matches ||
            window.innerWidth <= 768
        ) {

            return;

        }


        parallaxMap.forEach((config) => {

            const elements =
                scope.querySelectorAll(
                    config.selector
                );


            elements.forEach((element) => {

                state.parallaxItems.push({

                    element,

                    speed: config.speed

                });

            });

        });

    }


    /* =====================================================
       PARALLAX CALCULATION
       ===================================================== */

    function updateParallax() {

        state.rafId = null;


        if (
            motionQuery.matches ||
            window.innerWidth <= 768
        ) {

            return;

        }


        const viewportCenter =
            window.innerHeight / 2;


        state.parallaxItems.forEach((item) => {

            const rect =
                item.element.getBoundingClientRect();


            const elementCenter =
                rect.top +
                rect.height / 2;


            const distance =
                viewportCenter -
                elementCenter;


            const offset =
                distance *
                item.speed;


            item.element.style.setProperty(

                "--parallax-y",

                `${offset}px`

            );

        });

    }


    /* =====================================================
       REQUEST PARALLAX FRAME
       ===================================================== */

    function requestParallaxUpdate() {

        if (state.rafId !== null) {

            return;

        }


        state.rafId =
            window.requestAnimationFrame(
                updateParallax
            );

    }


    /* =====================================================
       OBSERVER
       ===================================================== */

    function setupObserver() {

        if (state.observer) {

            state.observer.disconnect();

        }


        if (
            motionQuery.matches
        ) {

            document
                .querySelectorAll(
                    ".reveal-section, .reveal-item"
                )
                .forEach((element) => {

                    element.classList.add(
                        "is-visible"
                    );

                });

            return;

        }


        state.observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach((entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                        } else {

                            entry.target.classList.remove(
                                "is-visible"
                            );

                        }

                    });

                },

                {

                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -10% 0px"

                }

            );


        document
            .querySelectorAll(
                ".reveal-section, .reveal-item"
            )
            .forEach((element) => {

                state.observer.observe(
                    element
                );

            });

    }


    /* =====================================================
       PUBLIC REFRESH FUNCTION
       ===================================================== */

    function refreshPageAnimations(root) {

        prepareSections(root);

        prepareStaggeredElements(root);

        prepareParallax(root);

        setupObserver();

        requestParallaxUpdate();

    }


    /* =====================================================
       SCROLL LISTENER
       ===================================================== */

    window.addEventListener(
        "scroll",
        requestParallaxUpdate,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        () => {

            prepareParallax(
                document
            );

            requestParallaxUpdate();

        }
    );


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.refreshPageAnimations =
        refreshPageAnimations;


    /* =====================================================
       INITIALIZE
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            refreshPageAnimations(
                document
            );

        }
    );

})();