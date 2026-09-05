"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const body = document.body;
    const intro = $("#cinematicIntro");
    const navigation = $("#navigation");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ==========================================================
       INITIAL STATE
    ========================================================== */

    body.classList.add("loading");



    /* ==========================================================
       CINEMATIC INTRO
       
       Timeline:
       
       0ms       Black screen
       250ms     Mathematics begins appearing
       700ms     SOHAM appears
       1200ms    INDUSTRIES appears
       1800ms    Title flash
       2200ms    Intro fades
       2700ms    Website begins
    ========================================================== */

    function startCinematicIntro() {

        if (!intro) {
            startWebsite();
            return;
        }


        const formulas = $$(".formula");


        if (reducedMotion) {

            formulas.forEach((formula) => {
                formula.classList.add("formula-visible");
            });

            intro.classList.add("title-visible");

            setTimeout(() => {
                finishIntro();
            }, 600);

            return;
        }


        /* ----------------------------------------------
           Phase 1 — Mathematics
        ---------------------------------------------- */

        setTimeout(() => {

            formulas.forEach((formula, index) => {

                setTimeout(() => {

                    formula.classList.add(
                        "formula-visible"
                    );

                }, index * 55);

            });

        }, 180);


        /* ----------------------------------------------
           Phase 2 — Main title
        ---------------------------------------------- */

        setTimeout(() => {

            intro.classList.add("title-visible");

        }, 700);


        /* ----------------------------------------------
           Phase 3 — Flash
        ---------------------------------------------- */

        setTimeout(() => {

            intro.classList.add("title-flash");

        }, 1550);


        /* ----------------------------------------------
           Phase 4 — Fade out
        ---------------------------------------------- */

        setTimeout(() => {

            finishIntro();

        }, 2250);

    }



    /* ==========================================================
       FINISH INTRO
    ========================================================== */

    function finishIntro() {

        if (!intro) {
            startWebsite();
            return;
        }

        intro.classList.add("intro-finished");

        setTimeout(() => {

            if (intro.isConnected) {
                intro.remove();
            }

            body.classList.remove("loading");

            startWebsite();

        }, reducedMotion ? 0 : 650);

    }



    /* ==========================================================
       START MAIN WEBSITE
    ========================================================== */

    function startWebsite() {

        body.classList.add(
            "experience-ready"
        );

        setupRevealAnimations();
        setupNavigation();
        setupSmoothLinks();
        setupProjectHover();

    }



    /* ==========================================================
       REVEAL ANIMATIONS
       
       IntersectionObserver is used instead of continuous
       scroll animation.
    ========================================================== */

    function setupRevealAnimations() {

        const elements = $$(".reveal");

        if (!elements.length) {
            return;
        }


        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach((element) => {
                element.classList.add("visible");
            });

            return;

        }


        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "visible"
                    );

                    observerInstance.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -45px 0px"
            }
        );


        elements.forEach((element) => {

            observer.observe(element);

        });

    }



    /* ==========================================================
       NAVIGATION
       
       One passive scroll listener.
       No heavy calculations.
       No parallax.
    ========================================================== */

    function setupNavigation() {

        if (!navigation) {
            return;
        }


        let ticking = false;


        function updateNavigation() {

            if (window.scrollY > 35) {

                navigation.classList.add(
                    "scrolled"
                );

            } else {

                navigation.classList.remove(
                    "scrolled"
                );

            }

            ticking = false;

        }


        window.addEventListener(
            "scroll",
            () => {

                if (ticking) {
                    return;
                }

                ticking = true;

                requestAnimationFrame(
                    updateNavigation
                );

            },
            {
                passive: true
            }
        );


        updateNavigation();

    }



    /* ==========================================================
       SMOOTH NAVIGATION LINKS
    ========================================================== */

    function setupSmoothLinks() {

        const links = $$(
            'a[href^="#"]'
        );


        links.forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const navHeight =
                        navigation
                            ? navigation.offsetHeight
                            : 0;


                    const position =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        navHeight;


                    if (reducedMotion) {

                        window.scrollTo(
                            0,
                            position
                        );

                    } else {

                        window.scrollTo({

                            top: position,

                            behavior: "smooth"

                        });

                    }

                }
            );

        });

    }



    /* ==========================================================
       PROJECT HOVER
       
       Simple class toggle.
       No mouse tracking.
       No animation loop.
    ========================================================== */

    function setupProjectHover() {

        const projects = $$(".project");


        projects.forEach((project) => {

            project.addEventListener(
                "mouseenter",
                () => {

                    project.classList.add(
                        "project-active"
                    );

                }
            );


            project.addEventListener(
                "mouseleave",
                () => {

                    project.classList.remove(
                        "project-active"
                    );

                }
            );

        });

    }



    /* ==========================================================
       IMAGE OPTIMIZATION
       
       Future images automatically get lazy loading.
    ========================================================== */

    $$("img").forEach((image) => {

        if (!image.hasAttribute("loading")) {

            image.setAttribute(
                "loading",
                "lazy"
            );

        }

        image.setAttribute(
            "decoding",
            "async"
        );

    });



    /* ==========================================================
       PAGE VISIBILITY
    ========================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                body.classList.add(
                    "page-hidden"
                );

            } else {

                body.classList.remove(
                    "page-hidden"
                );

            }

        }
    );



    /* ==========================================================
       START
    ========================================================== */

    startCinematicIntro();



    /* ==========================================================
       FAILSAFE
       
       The website will never remain stuck behind the intro.
    ========================================================== */

    setTimeout(() => {

        if (
            intro &&
            document.body.classList.contains(
                "loading"
            )
        ) {

            finishIntro();

        }

    }, 4500);

});
