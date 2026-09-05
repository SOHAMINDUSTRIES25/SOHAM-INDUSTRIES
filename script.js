"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       BASIC HELPERS
    ========================================================== */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const body = document.body;
    const preloader = $("#preloader");
    const loaderBar = $("#loaderBar");
    const loaderPercent = $("#loaderPercent");
    const navigation = $("#navigation");


    /* =========================================================
       REDUCED MOTION
    ========================================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =========================================================
       PRELOADER
       Lightweight — one animation loop only
    ========================================================== */

    body.classList.add("loading");

    const loaderDuration = reducedMotion ? 250 : 1000;

    const startTime = performance.now();

    function runLoader(now) {

        const elapsed = now - startTime;

        const progress = Math.min(
            elapsed / loaderDuration,
            1
        );

        const percentage = Math.round(progress * 100);

        if (loaderBar) {
            loaderBar.style.width = `${percentage}%`;
        }

        if (loaderPercent) {
            loaderPercent.textContent = `${percentage}%`;
        }

        if (progress < 1) {

            requestAnimationFrame(runLoader);

        } else {

            finishLoader();

        }
    }


    function finishLoader() {

        if (!preloader) {
            startExperience();
            return;
        }

        preloader.classList.add("loaded");

        setTimeout(() => {

            preloader.remove();

            body.classList.remove("loading");

            startExperience();

        }, reducedMotion ? 0 : 450);
    }


    requestAnimationFrame(runLoader);


    /* =========================================================
       EXPERIENCE START
    ========================================================== */

    function startExperience() {

        body.classList.add("experience-ready");

        setupRevealAnimations();
        setupNavigation();
        setupSmoothLinks();
        setupProjectHover();

    }


    /* =========================================================
       REVEAL ANIMATIONS
       IntersectionObserver is extremely lightweight.
    ========================================================== */

    function setupRevealAnimations() {

        const elements = $$(".reveal");

        if (!elements.length) return;


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

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


        elements.forEach((element) => {

            observer.observe(element);

        });

    }


    /* =========================================================
       NAVIGATION
       Uses a tiny passive scroll listener.
    ========================================================== */

    function setupNavigation() {

        if (!navigation) return;

        let ticking = false;


        function updateNavigation() {

            if (window.scrollY > 30) {

                navigation.classList.add("scrolled");

            } else {

                navigation.classList.remove("scrolled");

            }

            ticking = false;
        }


        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    requestAnimationFrame(
                        updateNavigation
                    );

                    ticking = true;

                }

            },
            {
                passive: true
            }
        );


        updateNavigation();

    }


    /* =========================================================
       SMOOTH ANCHOR NAVIGATION
    ========================================================== */

    function setupSmoothLinks() {

        const links = $$('a[href^="#"]');

        links.forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();


                const navigationHeight =
                    navigation
                        ? navigation.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    navigationHeight;


                if (reducedMotion) {

                    window.scrollTo(
                        0,
                        targetPosition
                    );

                } else {

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });

                }

            });

        });

    }


    /* =========================================================
       PROJECT HOVER
       No mouse coordinates.
       No requestAnimationFrame.
       No continuous animation.
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


    /* =========================================================
       PAGE VISIBILITY
       Prevents unnecessary work when tab is hidden.
    ========================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState === "hidden"
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


    /* =========================================================
       IMAGE LAZY LOADING
       Useful if you add images later.
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


    /* =========================================================
       SAFETY FALLBACK
       If something goes wrong with the loader,
       reveal the website after a short time.
    ========================================================== */

    setTimeout(() => {

        if (
            preloader &&
            document.body.classList.contains("loading")
        ) {

            preloader.classList.add("loaded");

            setTimeout(() => {

                if (preloader.isConnected) {
                    preloader.remove();
                }

                body.classList.remove("loading");

                startExperience();

            }, 400);

        }

    }, 2500);

});
