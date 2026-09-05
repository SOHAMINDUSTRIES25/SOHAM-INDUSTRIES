/* =========================================================
   SOHAM INDUSTRIES
   MASTER JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   INTRO
========================================================= */

const INTRO_DURATION = 7000;

const intro = document.getElementById("cinematic-intro");
const mainSite = document.getElementById("main-site");
const introPercent = document.getElementById("intro-percent");

let introStart = performance.now();

function updateIntroProgress(now) {

    const elapsed = now - introStart;

    const progress = Math.min(
        elapsed / INTRO_DURATION,
        1
    );

    if (introPercent) {
        introPercent.textContent =
            Math.round(progress * 100) + "%";
    }

    if (progress < 1) {
        requestAnimationFrame(updateIntroProgress);
    }
}

requestAnimationFrame(updateIntroProgress);


/*
    Keep the intro exactly 7 seconds.
*/

setTimeout(() => {

    if (!intro) return;

    intro.style.pointerEvents = "none";

    setTimeout(() => {

        intro.style.display = "none";

    }, 800);

}, INTRO_DURATION);


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    document.querySelectorAll(selector);


/* =========================================================
   NAVBAR
========================================================= */

const navbar = $("#navbar");

window.addEventListener(
    "scroll",
    () => {

        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    },
    { passive: true }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenu = $("#mobile-menu");
const navLinks = $(".nav-links");

if (mobileMenu && navLinks) {

    mobileMenu.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle("open");

        }
    );

}


$$(".nav-link").forEach(link => {

    link.addEventListener(
        "click",
        () => {

            navLinks?.classList.remove("open");

        }
    );

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = $$("section[id]");

const navObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id =
                    entry.target.id;

                $$(".nav-link").forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                        `#${id}`
                    );

                });

            });

        },
        {
            threshold: .35
        }
    );

sections.forEach(section => {

    navObserver.observe(section);

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: .12,
            rootMargin: "0px 0px -50px 0px"
        }
    );


$$(".reveal").forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(modal) {

    if (!modal) return;

    modal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );

}


function closeModal(modal) {

    if (!modal) return;

    modal.classList.remove("active");

    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   LOGIN MODAL
========================================================= */

const loginModal =
    $("#login-modal");

const openLogin =
    $("#open-login");

const closeLogin =
    $("#close-login");


openLogin?.addEventListener(
    "click",
    () => {

        openModal(loginModal);

    }
);


closeLogin?.addEventListener(
    "click",
    () => {

        closeModal(loginModal);

    }
);


/* =========================================================
   AUTH TABS
========================================================= */

const authTabs =
    $$(".auth-tab");

const loginForm =
    $("#login-form");

const signupForm =
    $("#signup-form");


authTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            authTabs.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );

            tab.classList.add("active");

            const mode =
                tab.dataset.auth;

            if (mode === "login") {

                loginForm?.classList.remove(
                    "hidden"
                );

                signupForm?.classList.add(
                    "hidden"
                );

            } else {

                loginForm?.classList.add(
                    "hidden"
                );

                signupForm?.classList.remove(
                    "hidden"
                );

            }

        }
    );

});


/* =========================================================
   LOCAL ACCOUNT DEMO
========================================================= */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "soham_users"
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveUsers(users) {

    localStorage.setItem(
        "soham_users",
        JSON.stringify(users)
    );

}


function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "soham_current_user"
            )
        );

    } catch {

        return null;

    }

}


function setCurrentUser(user) {

    localStorage.setItem(
        "soham_current_user",
        JSON.stringify(user)
    );

}


function clearCurrentUser() {

    localStorage.removeItem(
        "soham_current_user"
    );

}


/* =========================================================
   SIGNUP
========================================================= */

signupForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            $("#signup-name").value.trim();

        const email =
            $("#signup-email").value
                .trim()
                .toLowerCase();

        const password =
            $("#signup-password").value;

        const message =
            $("#signup-message");

        if (
            !name ||
            !email ||
            !password
        ) {

            message.textContent =
                "Please complete all fields.";

            return;

        }

        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            return;

        }

        const users =
            getUsers();

        const existing =
            users.find(
                user =>
                    user.email === email
            );

        if (existing) {

            message.textContent =
                "An account with this email already exists.";

            return;

        }

        const user = {

            id:
                "USER-" +
                Date.now(),

            name,
            email,
            password

        };

        users.push(user);

        saveUsers(users);

        setCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email
        });

        message.textContent =
            "Account created successfully.";

        showToast(
            "ACCOUNT CREATED"
        );

        setTimeout(() => {

            closeModal(loginModal);

            openDashboard();

        }, 600);

    }
);


/* =========================================================
   LOGIN
========================================================= */

loginForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const email =
            $("#login-email").value
                .trim()
                .toLowerCase();

        const password =
            $("#login-password").value;

        const message =
            $("#login-message");

        const users =
            getUsers();

        const user =
            users.find(
                item =>
                    item.email === email &&
                    item.password === password
            );

        /*
            DEMO ADMIN

            admin@soham.local
            password: sohamadmin
        */

        if (
            email === "admin@soham.local" &&
            password === "sohamadmin"
        ) {

            closeModal(loginModal);

            openAdmin();

            return;

        }


        if (!user) {

            message.textContent =
                "Incorrect email or password.";

            return;

        }

        setCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email
        });

        message.textContent =
            "Login successful.";

        showToast(
            "WELCOME BACK"
        );

        setTimeout(() => {

            closeModal(loginModal);

            openDashboard();

        }, 500);

    }
);


/* =========================================================
   DASHBOARD
========================================================= */

const dashboardModal =
    $("#dashboard-modal");

const closeDashboard =
    $("#close-dashboard");

const logoutButton =
    $("#logout-button");


function openDashboard() {

    const user =
        getCurrentUser();

    if (!user) {

        openModal(loginModal);

        return;

    }

    $("#dashboard-name").textContent =
        user.name.toUpperCase();

    $("#dashboard-email").textContent =
        user.email;

    loadUserRequests();

    openModal(
        dashboardModal
    );

}


closeDashboard?.addEventListener(
    "click",
    () => {

        closeModal(
            dashboardModal
        );

    }
);


logoutButton?.addEventListener(
    "click",
    () => {

        clearCurrentUser();

        closeModal(
            dashboardModal
        );

        showToast(
            "LOGGED OUT"
        );

    }
);


/* =========================================================
   REQUEST STORAGE
========================================================= */

function getRequests() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "soham_requests"
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveRequests(requests) {

    localStorage.setItem(
        "soham_requests",
        JSON.stringify(requests)
    );

}


/* =========================================================
   PROJECT FORM
========================================================= */

const projectForm =
    $("#project-form");


projectForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const user =
            getCurrentUser();

        /*
            Require login before final submission.
        */

        if (!user) {

            showToast(
                "LOGIN REQUIRED TO SUBMIT"
            );

            openModal(
                loginModal
            );

            return;

        }


        const request = {

            id:
                "REQ-" +
                Date.now(),

            userId:
                user.id,

            name:
                $("#name").value.trim(),

            email:
                $("#email").value.trim(),

            websiteType:
                $("#website-type").value,

            package:
                $("#package").value,

            requirements:
                $("#requirements").value.trim(),

            status:
                "NEW",

            createdAt:
                new Date().toISOString()

        };


        const requests =
            getRequests();

        requests.unshift(
            request
        );

        saveRequests(
            requests
        );


        $("#form-message").textContent =
            "Project request submitted successfully.";

        projectForm.reset();

        showToast(
            "PROJECT REQUEST SENT"
        );

    }
);


/* =========================================================
   PACKAGE BUTTONS
========================================================= */

$$(".package-button").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const selectedPackage =
                    button.dataset.package;

                const packageSelect =
                    $("#package");

                if (packageSelect) {

                    packageSelect.value =
                        selectedPackage;

                }

                document
                    .querySelector("#contact")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

                showToast(
                    `${selectedPackage} PACKAGE SELECTED`
                );

            }
        );

    }
);


/* =========================================================
   PROJECT TYPE BUTTONS
========================================================= */

$$(".project-select").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.type;

                const websiteType =
                    $("#website-type");

                if (websiteType) {

                    websiteType.value =
                        type;

                }

                document
                    .querySelector("#contact")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

                showToast(
                    `${type.toUpperCase()} SELECTED`
                );

            }
        );

    }
);


/* =========================================================
   LOAD CLIENT REQUESTS
========================================================= */

function loadUserRequests() {

    const user =
        getCurrentUser();

    if (!user) return;

    const requests =
        getRequests()
            .filter(
                request =>
                    request.userId === user.id
            );

    $("#request-count").textContent =
        requests.length;


    const list =
        $("#request-list");

    if (!requests.length) {

        list.innerHTML = `
            <div class="empty-state">
                No project requests yet.
            </div>
        `;

        return;

    }


    list.innerHTML =
        requests.map(
            request => `

            <div class="request-item">

                <div class="request-item-header">

                    <div>

                        <h4>
                            ${escapeHTML(
                                request.websiteType
                            )}
                        </h4>

                        <small>
                            ${escapeHTML(
                                request.package
                            )}
                        </small>

                    </div>

                    <span class="status">
                        ${escapeHTML(
                            request.status
                        )}
                    </span>

                </div>

                <p>
                    ${escapeHTML(
                        request.requirements
                    )}
                </p>

            </div>

        `
        ).join("");

}


/* =========================================================
   ADMIN
========================================================= */

const adminModal =
    $("#admin-modal");

const closeAdmin =
    $("#close-admin");

const adminLogout =
    $("#admin-logout");


function openAdmin() {

    loadAdminRequests();

    openModal(
        adminModal
    );

}


closeAdmin?.addEventListener(
    "click",
    () => {

        closeModal(
            adminModal
        );

    }
);


adminLogout?.addEventListener(
    "click",
    () => {

        closeModal(
            adminModal
        );

    }
);


/* =========================================================
   ADMIN REQUEST LIST
========================================================= */

function loadAdminRequests() {

    const requests =
        getRequests();

    const list =
        $("#admin-request-list");

    if (!requests.length) {

        list.innerHTML = `
            <div class="empty-state">
                No project requests available.
            </div>
        `;

        return;

    }


    list.innerHTML =
        requests.map(
            request => `

            <div class="admin-request">

                <div class="admin-request-header">

                    <div>

                        <h4>
                            ${escapeHTML(
                                request.name
                            )}
                        </h4>

                        <small>
                            ${escapeHTML(
                                request.email
                            )}
                        </small>

                    </div>

                    <span class="status">
                        ${escapeHTML(
                            request.status
                        )}
                    </span>

                </div>

                <p>
                    <strong>
                        Website:
                    </strong>

                    ${escapeHTML(
                        request.websiteType
                    )}
                </p>

                <p>
                    <strong>
                        Package:
                    </strong>

                    ${escapeHTML(
                        request.package
                    )}
                </p>

                <p>
                    ${escapeHTML(
                        request.requirements
                    )}
                </p>

                <small>
                    ${formatDate(
                        request.createdAt
                    )}
                </small>

            </div>

        `
        ).join("");

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   DATE
========================================================= */

function formatDate(date) {

    try {

        return new Date(date)
            .toLocaleString();

    } catch {

        return "";

    }

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {

    const toast =
        $("#toast");

    const text =
        $("#toast-text");

    if (!toast || !text) return;

    text.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING BACKDROP
========================================================= */

$$(".modal").forEach(
    modal => {

        modal
            .querySelector(
                ".modal-backdrop"
            )
            ?.addEventListener(
                "click",
                () => {

                    closeModal(
                        modal
                    );

                }
            );

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        $$(".modal.active").forEach(
            modal => {

                closeModal(
                    modal
                );

            }
        );

    }
);


/* =========================================================
   GLOBAL SMOOTH ANCHORS
========================================================= */

$$('a[href^="#"]').forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                const targetID =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !targetID ||
                    targetID === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetID
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    }
);


/* =========================================================
   IMAGE ERROR FALLBACK
========================================================= */

$$(".project-image").forEach(
    image => {

        /*
            If you haven't added the project images yet,
            the cards still keep their dark premium appearance.
        */

        const background =
            getComputedStyle(
                image
            ).backgroundImage;

        if (
            background &&
            background.includes("url")
        ) {

            const testImage =
                new Image();

            const match =
                background.match(
                    /url\(["']?(.*?)["']?\)/
                );

            if (match?.[1]) {

                testImage.src =
                    match[1];

                testImage.onerror =
                    () => {

                        image.style.backgroundImage =
                            "linear-gradient(135deg,#222,#080808)";

                    };

            }

        }

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
            If an existing client session exists,
            nothing is opened automatically.
        */

        console.log(
            "SOHAM INDUSTRIES SYSTEM ONLINE"
        );

    }
);
