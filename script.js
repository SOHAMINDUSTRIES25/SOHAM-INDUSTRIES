/* ============================================================
   SOHAM INDUSTRIES
   PERFORMANCE-FIRST JAVASCRIPT
============================================================ */

"use strict";


/* ============================================================
   DOM
============================================================ */

const intro = document.getElementById("cinematicIntro");
const mainSite = document.getElementById("mainSite");
const navbar = document.querySelector(".navbar");

const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const projectItems = document.querySelectorAll(".project");


/* ============================================================
   EXACT 7 SECOND INTRO
============================================================ */

const INTRO_DURATION = 7000;

document.body.classList.add("intro-active");


function finishIntro() {

    if (!intro) {
        document.body.classList.remove("intro-active");
        return;
    }

    intro.classList.add("intro-finished");

    document.body.classList.remove("intro-active");

    if (mainSite) {
        mainSite.classList.add("site-ready");
    }

    /*
       Remove the intro from the page after the fade-out.
       This prevents the intro from consuming resources.
    */

    window.setTimeout(() => {

        intro.style.display = "none";

    }, 800);
}


/*
   The intro begins at page load.

   7000ms = exactly 7 seconds.

   CSS controls the cinematic animation while JS
   controls the final cleanup.
*/

window.setTimeout(finishIntro, INTRO_DURATION);


/* ============================================================
   FAILSAFE
============================================================ */

window.setTimeout(() => {

    if (intro && intro.style.display !== "none") {

        intro.style.opacity = "0";
        intro.style.visibility = "hidden";
        intro.style.pointerEvents = "none";

        document.body.classList.remove("intro-active");

    }

}, 8500);


/* ============================================================
   SCROLL REVEALS
============================================================ */

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        });

    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    }
);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* ============================================================
   NAVBAR SCROLL
============================================================ */

let scrollTicking = false;

function updateNavbar() {

    if (!navbar) {
        return;
    }

    if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    scrollTicking = false;
}


window.addEventListener(
    "scroll",
    () => {

        if (!scrollTicking) {

            window.requestAnimationFrame(updateNavbar);

            scrollTicking = true;

        }

    },
    {
        passive: true
    }
);


/* ============================================================
   SMOOTH NAVIGATION
============================================================ */

navLinks.forEach(link => {

    link.addEventListener("click", event => {

        const targetId = link.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        const navbarHeight = navbar
            ? navbar.offsetHeight
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });

    });

});


/* ============================================================
   PROJECT HOVER
   Lightweight interaction only.
============================================================ */

projectItems.forEach(project => {

    project.addEventListener(
        "mouseenter",
        () => {
            project.classList.add("active");
        },
        {
            passive: true
        }
    );

    project.addEventListener(
        "mouseleave",
        () => {
            project.classList.remove("active");
        },
        {
            passive: true
        }
    );

});


/* ============================================================
   IMAGE OPTIMIZATION
============================================================ */

document.querySelectorAll("img").forEach(image => {

    image.loading = "lazy";

    image.decoding = "async";

});


/* ============================================================
   PAGE VISIBILITY
============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            document.body.classList.add("page-hidden");

        } else {

            document.body.classList.remove("page-hidden");

        }

    }
);


/* ============================================================
   MOBILE MENU
============================================================ */

const menuButton = document.querySelector(".nav-menu");

if (menuButton) {

    menuButton.addEventListener("click", () => {

        document.body.classList.toggle("menu-open");

    });

}


/* ============================================================
   CONSOLE
============================================================ */

console.log(
    "%cSOHAM INDUSTRIES",
    "font-size:20px;font-weight:bold;"
);

console.log(
    "%cENGINEERING THE FUTURE.",
    "font-size:12px;"
);
