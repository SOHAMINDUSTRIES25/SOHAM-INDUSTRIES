"use strict";

/* =========================================================
SOHAM INDUSTRIES
CINEMATIC EXPERIENCE ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   ELEMENT HELPERS
===================================================== */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =====================================================
   PAGE LOCK
===================================================== */

document.documentElement.style.scrollBehavior = "auto";
document.body.style.overflow = "hidden";


/* =====================================================
   CINEMATIC PRELOADER
===================================================== */

const preloader = $("#preloader");
const progressBar = $(".progress-bar");
const progressNumber = $(".progress-number");

let progress = 0;

const updateProgress = (value) => {

    progress = Math.min(100, Math.max(0, value));

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    if (progressNumber) {
        progressNumber.textContent =
            `${Math.round(progress).toString().padStart(2, "0")}%`;
    }
};

const runLoader = () => {

    if (!preloader) {
        document.body.style.overflow = "";
        initializeExperience();
        return;
    }

    let startTime = performance.now();
    const minimumTime = 1900;

    const animateLoader = (time) => {

        const elapsed = time - startTime;

        /*
         * Fast at the beginning,
         * slower near the end.
         */
        const percentage =
            100 *
            (1 -
                Math.pow(
                    Math.max(0, 1 - elapsed / minimumTime),
                    2.8
                ));

        updateProgress(Math.min(percentage, 100));

        if (elapsed < minimumTime) {

            requestAnimationFrame(animateLoader);

        } else {

            updateProgress(100);

            setTimeout(() => {

                preloader.classList.add("hide");

                document.body.style.overflow = "";

                setTimeout(() => {

                    preloader.style.display = "none";

                    initializeExperience();

                }, 1000);

            }, 300);

        }
    };

    requestAnimationFrame(animateLoader);
};




let cursorDot = $(".cursor-dot");
let cursorRing = $(".cursor-ring");
let cursorLabel = $(".cursor-label");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let ringX = mouseX;
let ringY = mouseY;

const cursorSupported =
    window.matchMedia("(pointer: fine)").matches;

if (!cursorSupported) {

    if (cursorDot) cursorDot.style.display = "none";
    if (cursorRing) cursorRing.style.display = "none";

} else {

    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        if (cursorDot) {

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    const animateCursor = () => {

        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        if (cursorRing) {

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }

        requestAnimationFrame(animateCursor);
    };

    requestAnimationFrame(animateCursor);

    /*
     * Interactive cursor targets
     */

    const cursorTargets = $$(
        "a, button, .tech-card, .project, [data-cursor]"
    );

    cursorTargets.forEach((element) => {

        element.addEventListener("mouseenter", () => {

            if (!cursorRing) return;

            cursorRing.classList.add("active");

            const customLabel =
                element.getAttribute("data-cursor");

            if (cursorLabel) {

                cursorLabel.textContent =
                    customLabel || "VIEW";
            }
        });

        element.addEventListener("mouseleave", () => {

            if (!cursorRing) return;

            cursorRing.classList.remove("active");
        });
    });
}


/* =====================================================
   CURSOR CLICK RIPPLE
===================================================== */

if (cursorSupported) {

    document.addEventListener("mousedown", () => {

        if (!cursorRing) return;

        cursorRing.style.transform =
            "translate(-50%, -50%) scale(0.78)";
    });

    document.addEventListener("mouseup", () => {

        if (!cursorRing) return;

        cursorRing.style.transform =
            "translate(-50%, -50%) scale(1)";
    });
}


/* =====================================================
   SCROLL REVEAL ENGINE
===================================================== */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );

    revealElements.forEach((element) => {

        revealObserver.observe(element);
    });

} else {

    revealElements.forEach((element) => {

        element.classList.add("visible");
    });
}


/* =====================================================
   STAGGERED CARD REVEAL
===================================================== */

const animatedGroups = [
    ".technology-grid",
    ".project-list",
    ".intro-stat-grid"
];

animatedGroups.forEach((selector) => {

    const group = $(selector);

    if (!group) return;

    const children =
        [...group.children];

    children.forEach((child, index) => {

        child.style.transitionDelay =
            `${index * 100}ms`;
    });
});


/* =====================================================
   MAGNETIC BUTTONS
===================================================== */

const magneticElements = $$(
    ".primary-button, .secondary-button, .contact-button"
);

if (cursorSupported) {

    magneticElements.forEach((element) => {

        element.addEventListener("mousemove", (event) => {

            const rect =
                element.getBoundingClientRect();

            const x =
                event.clientX -
                (rect.left + rect.width / 2);

            const y =
                event.clientY -
                (rect.top + rect.height / 2);

            const strength = 0.18;

            element.style.transform =
                `translate(${x * strength}px, ${y * strength}px)`;
        });

        element.addEventListener("mouseleave", () => {

            element.style.transform = "";
        });
    });
}


/* =====================================================
   3D TILT CARDS
===================================================== */

const tiltCards = $$(".tech-card, .project-visual");

if (cursorSupported) {

    tiltCards.forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -3;

            const rotateY =
                ((x - centerX) / centerX) * 3;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateZ(0)`;
        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";
        });
    });
}


/* =====================================================
   HERO MOUSE PARALLAX
===================================================== */

const hero =
    $(".hero");

const heroElements = [
    {
        element: $(".hero-content"),
        strength: 0.012
    },
    {
        element: $(".hero-orbit"),
        strength: 0.025
    },
    {
        element: $(".hero-grid"),
        strength: 0.008
    }
];

if (hero && cursorSupported) {

    hero.addEventListener("mousemove", (event) => {

        const x =
            event.clientX / window.innerWidth - 0.5;

        const y =
            event.clientY / window.innerHeight - 0.5;

        heroElements.forEach((item) => {

            if (!item.element) return;

            const moveX =
                x *
                window.innerWidth *
                item.strength;

            const moveY =
                y *
                window.innerHeight *
                item.strength;

            item.element.style.transform =
                `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });

    hero.addEventListener("mouseleave", () => {

        heroElements.forEach((item) => {

            if (!item.element) return;

            item.element.style.transform = "";
        });
    });
}


/* =====================================================
   SCROLL PARALLAX
===================================================== */

const parallaxElements = $$(
    ".ambient, .stars, .manifesto-orbit"
);

let ticking = false;

const updateParallax = () => {

    const scrollY =
        window.scrollY;

    parallaxElements.forEach((element, index) => {

        const speed =
            0.04 + index * 0.015;

        element.style.transform =
            `translate3d(0, ${scrollY * speed}px, 0)`;
    });

    ticking = false;
};

window.addEventListener("scroll", () => {

    if (!ticking) {

        requestAnimationFrame(updateParallax);

        ticking = true;
    }
}, {
    passive: true
});


/* =====================================================
   NAVIGATION SCROLL EFFECT
===================================================== */

const navigation =
    $(".navigation");

const updateNavigation = () => {

    if (!navigation) return;

    if (window.scrollY > 50) {

        navigation.style.background =
            "rgba(2, 2, 4, 0.82)";

        navigation.style.backdropFilter =
            "blur(18px)";

    } else {

        navigation.style.background = "";

        navigation.style.backdropFilter = "";
    }
};

window.addEventListener(
    "scroll",
    updateNavigation,
    { passive: true }
);

updateNavigation();


/* =====================================================
   SMOOTH ANCHOR NAVIGATION
===================================================== */

$$("a[href^='#']").forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetID =
            link.getAttribute("href");

        if (
            !targetID ||
            targetID === "#"
        ) return;

        const target =
            document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


/* =====================================================
   PROJECT HOVER VISUAL EFFECT
===================================================== */

$$(".project").forEach((project) => {

    const visual =
        $(".project-visual", project);

    if (!visual) return;

    project.addEventListener(
        "mouseenter",
        () => {

            visual.style.transform =
                "scale(1.025)";
        }
    );

    project.addEventListener(
        "mouseleave",
        () => {

            visual.style.transform = "";
        }
    );
});


/* =====================================================
   RANDOM STAR FIELD
===================================================== */

const starContainer =
    $(".stars");

if (starContainer) {

    const fragment =
        document.createDocumentFragment();

    const starCount =
        window.innerWidth < 600
            ? 35
            : 75;

    for (let i = 0; i < starCount; i++) {

        const star =
            document.createElement("span");

        const size =
            Math.random() * 2 + 1;

        star.style.position = "absolute";

        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.borderRadius =
            "50%";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.opacity =
            `${Math.random() * 0.65 + 0.1}`;

        star.style.background =
            "rgba(255,255,255,0.8)";

        star.style.animation =
            `starTwinkle
             ${2 + Math.random() * 5}s
             ease-in-out
             ${Math.random() * 4}s
             infinite`;

        fragment.appendChild(star);
    }

    starContainer.appendChild(fragment);
}


/* =====================================================
   DYNAMIC STAR ANIMATION
===================================================== */

if (!document.querySelector("#soham-star-animation")) {

    const style =
        document.createElement("style");

    style.id =
        "soham-star-animation";

    style.textContent = `
        @keyframes starTwinkle {

            0%, 100% {
                opacity: 0.12;
                transform: scale(0.7);
            }

            50% {
                opacity: 0.9;
                transform: scale(1.35);
            }
        }
    `;

    document.head.appendChild(style);
}


/* =====================================================
   IMAGE / MEDIA LAZY LOAD
===================================================== */

$$("img").forEach((image) => {

    image.addEventListener("load", () => {

        image.classList.add("loaded");
    });
});


/* =====================================================
   KEYBOARD ACCESSIBILITY
===================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (cursorRing) {

            cursorRing.classList.remove("active");
        }
    }
});


/* =====================================================
   PAGE VISIBILITY
===================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            document.body.classList.add(
                "page-paused"
            );

        } else {

            document.body.classList.remove(
                "page-paused"
            );
        }
    }
);


/* =====================================================
   EXPERIENCE INITIALIZER
===================================================== */

function initializeExperience() {

    document.documentElement.style.scrollBehavior =
        "smooth";

    /*
     * Initial reveal.
     */

    requestAnimationFrame(() => {

        document.body.classList.add(
            "experience-ready"
        );
    });

    /*
     * Trigger hero animations.
     */

    const heroWords =
        $$(".hero-word");

    heroWords.forEach((word, index) => {

        word.style.animationDelay =
            `${0.2 + index * 0.15}s`;
    });

    /*
     * Start a tiny cinematic breathing
     * effect on the main hero.
     */

    const heroTitle =
        $(".hero-title");

    if (heroTitle) {

        let lastScroll =
            window.scrollY;

        window.addEventListener(
            "scroll",
            () => {

                const currentScroll =
                    window.scrollY;

                if (
                    Math.abs(
                        currentScroll -
                        lastScroll
                    ) < 1
                ) return;

                const offset =
                    Math.min(
                        currentScroll * 0.05,
                        35
                    );

                heroTitle.style.transform =
                    `translateY(${offset}px)`;

                lastScroll =
                    currentScroll;
            },
            { passive: true }
        );
    }
}


/* =====================================================
   START
===================================================== */

runLoader();

});
