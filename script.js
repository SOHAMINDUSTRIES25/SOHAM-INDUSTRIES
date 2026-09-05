/* =========================================================
   SOHAM INDUSTRIES
   MASTER JAVASCRIPT
   SUPABASE BACKEND VERSION
========================================================= */

"use strict";


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://zqxnumdpefndysbkrrcy.supabase.co";

/*
   Paste your Supabase PUBLISHABLE KEY below.

   IMPORTANT:
   Use the publishable key only.
   NEVER put a secret/service_role key here.
*/

const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_PUBLISHABLE_KEY_HERE";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   GLOBAL AUTH STATE
========================================================= */

let currentSession = null;
let currentProfile = null;


/* =========================================================
   INTRO
========================================================= */

const INTRO_DURATION = 7000;

const intro =
    document.getElementById("cinematic-intro");

const mainSite =
    document.getElementById("main-site");

const introPercent =
    document.getElementById("intro-percent");

let introStart =
    performance.now();


function updateIntroProgress(now) {

    const elapsed =
        now - introStart;

    const progress =
        Math.min(
            elapsed / INTRO_DURATION,
            1
        );

    if (introPercent) {

        introPercent.textContent =
            Math.round(progress * 100) + "%";

    }

    if (progress < 1) {

        requestAnimationFrame(
            updateIntroProgress
        );

    }

}


requestAnimationFrame(
    updateIntroProgress
);


/*
    Keep the intro exactly 7 seconds.
*/

setTimeout(() => {

    if (!intro) return;

    intro.style.pointerEvents =
        "none";

    setTimeout(() => {

        intro.style.display =
            "none";

    }, 800);

}, INTRO_DURATION);


/* =========================================================
   DOM HELPERS
========================================================= */

const $ =
    selector =>
        document.querySelector(selector);


const $$ =
    selector =>
        document.querySelectorAll(selector);


/* =========================================================
   NAVBAR
========================================================= */

const navbar =
    $("#navbar");


window.addEventListener(
    "scroll",
    () => {

        if (!navbar) return;

        if (window.scrollY > 50) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenu =
    $("#mobile-menu");

const navLinks =
    $(".nav-links");


if (
    mobileMenu &&
    navLinks
) {

    mobileMenu.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "open"
            );

        }
    );

}


$$(".nav-link").forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navLinks?.classList.remove(
                    "open"
                );

            }
        );

    }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    $$("section[id]");


if ("IntersectionObserver" in window) {

    const navObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const id =
                            entry.target.id;

                        $$(".nav-link")
                            .forEach(
                                link => {

                                    link.classList.toggle(
                                        "active",
                                        link.getAttribute(
                                            "href"
                                        ) ===
                                        `#${id}`
                                    );

                                }
                            );

                    }
                );

            },
            {
                threshold: .35
            }
        );


    sections.forEach(
        section => {

            navObserver.observe(
                section
            );

        }
    );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

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

                    }
                );

            },
            {
                threshold: .12,
                rootMargin:
                    "0px 0px -50px 0px"
            }
        );


    $$(".reveal").forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

}


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(modal) {

    if (!modal) return;

    modal.classList.add(
        "active"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeModal(modal) {

    if (!modal) return;

    modal.classList.remove(
        "active"
    );

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

        openModal(
            loginModal
        );

    }
);


closeLogin?.addEventListener(
    "click",
    () => {

        closeModal(
            loginModal
        );

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


authTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                authTabs.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                tab.classList.add(
                    "active"
                );

                const mode =
                    tab.dataset.auth;


                if (
                    mode === "login"
                ) {

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

    }
);


/* =========================================================
   AUTH MESSAGE HELPER
========================================================= */

function setMessage(
    selector,
    message
) {

    const element =
        $(selector);

    if (element) {

        element.textContent =
            message;

    }

}


/* =========================================================
   SIGNUP — SUPABASE AUTH
========================================================= */

signupForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            $("#signup-name")
                ?.value
                .trim();


        const email =
            $("#signup-email")
                ?.value
                .trim()
                .toLowerCase();


        const password =
            $("#signup-password")
                ?.value;


        const message =
            $("#signup-message");


        if (
            !name ||
            !email ||
            !password
        ) {

            setMessage(
                "#signup-message",
                "Please complete all fields."
            );

            return;

        }


        if (
            password.length < 6
        ) {

            setMessage(
                "#signup-message",
                "Password must contain at least 6 characters."
            );

            return;

        }


        setMessage(
            "#signup-message",
            "Creating your account..."
        );


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email,
                    password,

                    options: {

                        data: {

                            full_name:
                                name

                        }

                    }

                });


            if (error) {

                console.error(
                    "Signup error:",
                    error
                );

                setMessage(
                    "#signup-message",
                    error.message
                );

                return;

            }


            /*
                Supabase may require email confirmation.
            */

            if (
                data.user &&
                !data.session
            ) {

                setMessage(
                    "#signup-message",
                    "Account created. Please check your email to confirm your account."
                );

                showToast(
                    "CHECK YOUR EMAIL"
                );

                return;

            }


            setMessage(
                "#signup-message",
                "Account created successfully."
            );


            showToast(
                "ACCOUNT CREATED"
            );


            await refreshAuth();


            setTimeout(
                () => {

                    closeModal(
                        loginModal
                    );

                    openDashboard();

                },
                600
            );


        } catch (error) {

            console.error(
                "Unexpected signup error:",
                error
            );

            setMessage(
                "#signup-message",
                "Something went wrong. Please try again."
            );

        }

    }
);


/* =========================================================
   LOGIN — SUPABASE AUTH
========================================================= */

loginForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            $("#login-email")
                ?.value
                .trim()
                .toLowerCase();


        const password =
            $("#login-password")
                ?.value;


        if (
            !email ||
            !password
        ) {

            setMessage(
                "#login-message",
                "Please enter your email and password."
            );

            return;

        }


        setMessage(
            "#login-message",
            "Signing in..."
        );


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email,
                        password

                    });


            if (error) {

                console.error(
                    "Login error:",
                    error
                );

                setMessage(
                    "#login-message",
                    "Incorrect email or password."
                );

                return;

            }


            currentSession =
                data.session;


            await loadProfile();


            setMessage(
                "#login-message",
                "Login successful."
            );


            showToast(
                "WELCOME BACK"
            );


            setTimeout(
                () => {

                    closeModal(
                        loginModal
                    );


                    if (
                        currentProfile?.role ===
                        "admin"
                    ) {

                        openAdmin();

                    } else {

                        openDashboard();

                    }

                },
                500
            );


        } catch (error) {

            console.error(
                "Unexpected login error:",
                error
            );

            setMessage(
                "#login-message",
                "Something went wrong. Please try again."
            );

        }

    }
);


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    if (
        !currentSession?.user
    ) {

        currentProfile =
            null;

        return null;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "id, full_name, email, role, created_at"
                )
                .eq(
                    "id",
                    currentSession.user.id
                )
                .single();


        if (error) {

            console.error(
                "Profile error:",
                error
            );

            currentProfile =
                null;

            return null;

        }


        currentProfile =
            data;


        return data;


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        currentProfile =
            null;

        return null;

    }

}


/* =========================================================
   REFRESH AUTH
========================================================= */

async function refreshAuth() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }


        currentSession =
            data.session;


        if (
            currentSession
        ) {

            await loadProfile();

        } else {

            currentProfile =
                null;

        }


    } catch (error) {

        console.error(
            "Auth refresh error:",
            error
        );

    }

}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

supabaseClient.auth.onAuthStateChange(
    async (
        event,
        session
    ) => {

        currentSession =
            session;


        if (session) {

            /*
                Delay profile query slightly so
                authentication state is settled.
            */

            setTimeout(
                async () => {

                    await loadProfile();

                },
                0
            );

        } else {

            currentProfile =
                null;

        }

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


async function openDashboard() {

    await refreshAuth();


    if (
        !currentSession?.user
    ) {

        openModal(
            loginModal
        );

        return;

    }


    if (
        currentProfile?.role ===
        "admin"
    ) {

        openAdmin();

        return;

    }


    const name =
        currentProfile?.full_name ||
        currentSession.user.user_metadata?.full_name ||
        "CLIENT";


    const email =
        currentProfile?.email ||
        currentSession.user.email ||
        "";


    if ($("#dashboard-name")) {

        $("#dashboard-name").textContent =
            name.toUpperCase();

    }


    if ($("#dashboard-email")) {

        $("#dashboard-email").textContent =
            email;

    }


    await loadUserRequests();


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


/* =========================================================
   LOGOUT
========================================================= */

logoutButton?.addEventListener(
    "click",
    async () => {

        try {

            const {
                error
            } =
                await supabaseClient.auth
                    .signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                return;

            }


            currentSession =
                null;

            currentProfile =
                null;


            closeModal(
                dashboardModal
            );


            closeModal(
                adminModal
            );


            showToast(
                "LOGGED OUT"
            );


        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);


/* =========================================================
   PROJECT FORM
========================================================= */

const projectForm =
    $("#project-form");


projectForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        await refreshAuth();


        /*
            Require Supabase login.
        */

        if (
            !currentSession?.user
        ) {

            showToast(
                "LOGIN REQUIRED TO SUBMIT"
            );

            openModal(
                loginModal
            );

            return;

        }


        const name =
            $("#name")
                ?.value
                .trim();


        const email =
            $("#email")
                ?.value
                .trim()
                .toLowerCase();


        const websiteType =
            $("#website-type")
                ?.value;


        const selectedPackage =
            $("#package")
                ?.value;


        const requirements =
            $("#requirements")
                ?.value
                .trim();


        if (
            !name ||
            !email ||
            !websiteType ||
            !selectedPackage
        ) {

            setMessage(
                "#form-message",
                "Please complete the required fields."
            );

            return;

        }


        setMessage(
            "#form-message",
            "Sending your project request..."
        );


        try {

            const {
                error
            } =
                await supabaseClient
                    .from("website_requests")
                    .insert({

                        user_id:
                            currentSession.user.id,

                        name,

                        email,

                        website_type:
                            websiteType,

                        package:
                            selectedPackage,

                        requirements:
                            requirements || null,

                        status:
                            "NEW"

                    });


            if (error) {

                console.error(
                    "Request error:",
                    error
                );

                setMessage(
                    "#form-message",
                    "Unable to submit your request. Please try again."
                );

                return;

            }


            setMessage(
                "#form-message",
                "Project request submitted successfully."
            );


            projectForm.reset();


            showToast(
                "PROJECT REQUEST SENT"
            );


        } catch (error) {

            console.error(
                "Unexpected request error:",
                error
            );

            setMessage(
                "#form-message",
                "Something went wrong. Please try again."
            );

        }

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


                if (
                    packageSelect
                ) {

                    packageSelect.value =
                        selectedPackage;

                }


                document
                    .querySelector(
                        "#contact"
                    )
                    ?.scrollIntoView({
                        behavior:
                            "smooth"
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


                if (
                    websiteType
                ) {

                    websiteType.value =
                        type;

                }


                document
                    .querySelector(
                        "#contact"
                    )
                    ?.scrollIntoView({
                        behavior:
                            "smooth"
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

async function loadUserRequests() {

    if (
        !currentSession?.user
    ) {
        return;
    }


    const list =
        $("#request-list");


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("website_requests")
                .select(
                    "id, name, email, website_type, package, requirements, status, created_at"
                )
                .eq(
                    "user_id",
                    currentSession.user.id
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            console.error(
                "Request loading error:",
                error
            );

            if (list) {

                list.innerHTML = `
                    <div class="empty-state">
                        Unable to load requests.
                    </div>
                `;

            }

            return;

        }


        const requests =
            data || [];


        if (
            $("#request-count")
        ) {

            $("#request-count").textContent =
                requests.length;

        }


        if (!list) return;


        if (
            !requests.length
        ) {

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
                                    request.website_type
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

                    <small>
                        ${formatDate(
                            request.created_at
                        )}
                    </small>

                </div>

            `
            ).join("");


    } catch (error) {

        console.error(
            "Unexpected request loading error:",
            error
        );

    }

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


async function openAdmin() {

    await refreshAuth();


    if (
        !currentSession?.user
    ) {

        openModal(
            loginModal
        );

        return;

    }


    if (
        currentProfile?.role !==
        "admin"
    ) {

        showToast(
            "ADMIN ACCESS REQUIRED"
        );

        return;

    }


    await loadAdminRequests();


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


/* =========================================================
   ADMIN LOGOUT
========================================================= */

adminLogout?.addEventListener(
    "click",
    async () => {

        try {

            const {
                error
            } =
                await supabaseClient.auth
                    .signOut();


            if (error) {

                console.error(
                    "Admin logout error:",
                    error
                );

                return;

            }


            currentSession =
                null;

            currentProfile =
                null;


            closeModal(
                adminModal
            );


            showToast(
                "LOGGED OUT"
            );


        } catch (error) {

            console.error(
                "Admin logout error:",
                error
            );

        }

    }
);


/* =========================================================
   ADMIN REQUEST LIST
========================================================= */

async function loadAdminRequests() {

    const list =
        $("#admin-request-list");


    if (
        !list
    ) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("website_requests")
                .select(
                    "id, name, email, website_type, package, requirements, status, created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            console.error(
                "Admin request error:",
                error
            );


            list.innerHTML = `
                <div class="empty-state">
                    Unable to load project requests.
                </div>
            `;


            return;

        }


        const requests =
            data || [];


        if (
            !requests.length
        ) {

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
                            request.website_type
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
                            request.created_at
                        )}
                    </small>

                </div>

            `
            ).join("");


    } catch (error) {

        console.error(
            "Unexpected admin request error:",
            error
        );

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   DATE
========================================================= */

function formatDate(date) {

    try {

        return new Date(
            date
        ).toLocaleString();

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


    if (
        !toast ||
        !text
    ) {
        return;
    }


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
   CLOSE MODALS — BACKDROP
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

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        $$(".modal.active")
            .forEach(
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
                    behavior:
                        "smooth"
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

        const background =
            getComputedStyle(
                image
            ).backgroundImage;


        if (
            background &&
            background.includes(
                "url"
            )
        ) {

            const testImage =
                new Image();


            const match =
                background.match(
                    /url\(["']?(.*?)["']?\)/
                );


            if (
                match?.[1]
            ) {

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
    async () => {

        console.log(
            "SOHAM INDUSTRIES SYSTEM ONLINE"
        );


        /*
            Restore existing Supabase session.
        */

        await refreshAuth();


        if (
            currentSession
        ) {

            console.log(
                "SUPABASE SESSION RESTORED"
            );

        } else {

            console.log(
                "NO ACTIVE USER SESSION"
            );

        }

    }
);
