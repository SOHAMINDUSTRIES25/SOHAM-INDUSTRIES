/* =========================================================
   SOHAM INDUSTRIES — SCRIPT.JS
   Supabase + Login + Signup + Dashboard + Requests
========================================================= */

const SUPABASE_URL =
    "https://zqxnumdpefndysbkrrcy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_NY-WNgp08StgIBuTj8xoCA_x2tIL-ex";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   GLOBAL
========================================================= */

let currentSession = null;
let currentProfile = null;
let selectedPackage = "";


/* =========================================================
   ELEMENTS
========================================================= */

const loginButton =
    document.getElementById("open-login");

const loginModal =
    document.getElementById("login-modal");

const closeLogin =
    document.getElementById("close-login");

const loginForm =
    document.getElementById("login-form");

const signupForm =
    document.getElementById("signup-form");

const dashboardModal =
    document.getElementById("dashboard-modal");

const adminModal =
    document.getElementById("admin-modal");

const closeDashboard =
    document.getElementById("close-dashboard");

const closeAdmin =
    document.getElementById("close-admin");

const logoutButton =
    document.getElementById("logout-button");

const adminLogout =
    document.getElementById("admin-logout");

const projectForm =
    document.getElementById("project-form");

const requestList =
    document.getElementById("request-list");

const adminRequestList =
    document.getElementById("admin-request-list");


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastText =
        document.getElementById("toast-text");

    if (!toast || !toastText) return;

    toastText.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


/* =========================================================
   MODALS
========================================================= */

function openModal(modal) {

    if (!modal) return;

    modal.classList.add("active");

    document.body.classList.add("modal-open");
}


function closeModal(modal) {

    if (!modal) return;

    modal.classList.remove("active");

    if (
        !document.querySelector(".modal.active")
    ) {
        document.body.classList.remove(
            "modal-open"
        );
    }
}


/* =========================================================
   LOGIN OPEN
========================================================= */

if (loginButton) {

    loginButton.addEventListener(
        "click",
        function () {

            openModal(loginModal);

        }
    );

}


/* =========================================================
   CLOSE LOGIN
========================================================= */

if (closeLogin) {

    closeLogin.addEventListener(
        "click",
        function () {

            closeModal(loginModal);

        }
    );

}


/* =========================================================
   CLOSE DASHBOARD
========================================================= */

if (closeDashboard) {

    closeDashboard.addEventListener(
        "click",
        function () {

            closeModal(dashboardModal);

        }
    );

}


/* =========================================================
   CLOSE ADMIN
========================================================= */

if (closeAdmin) {

    closeAdmin.addEventListener(
        "click",
        function () {

            closeModal(adminModal);

        }
    );

}


/* =========================================================
   BACKDROP CLOSE
========================================================= */

document.querySelectorAll(
    ".modal-backdrop"
).forEach(backdrop => {

    backdrop.addEventListener(
        "click",
        function () {

            const modal =
                backdrop.parentElement;

            closeModal(modal);

        }
    );

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeModal(loginModal);
            closeModal(dashboardModal);
            closeModal(adminModal);

        }

    }
);


/* =========================================================
   AUTH TABS
========================================================= */

const authTabs =
    document.querySelectorAll(
        ".auth-tab"
    );


authTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        function () {

            const type =
                tab.dataset.auth;

            authTabs.forEach(t => {
                t.classList.remove(
                    "active"
                );
            });

            tab.classList.add("active");


            if (type === "login") {

                loginForm.classList.remove(
                    "hidden"
                );

                signupForm.classList.add(
                    "hidden"
                );

            }


            if (type === "signup") {

                signupForm.classList.remove(
                    "hidden"
                );

                loginForm.classList.add(
                    "hidden"
                );

            }

        }
    );

});


/* =========================================================
   SIGN UP
========================================================= */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "signup-name"
                ).value.trim();

            const email =
                document.getElementById(
                    "signup-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "signup-password"
                ).value;


            if (!name || !email || !password) {

                showToast(
                    "Please fill all fields."
                );

                return;

            }


            if (password.length < 6) {

                showToast(
                    "Password must be at least 6 characters."
                );

                return;

            }


            showToast(
                "Creating your account..."
            );


            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {
                            full_name: name
                        }

                    }

                });


            if (error) {

                console.error(
                    "SIGNUP ERROR:",
                    error
                );

                showToast(
                    error.message
                );

                return;

            }


            signupForm.reset();


            if (
                data.user &&
                !data.session
            ) {

                showToast(
                    "Account created! Check your email and confirm it."
                );

                return;

            }


            if (data.session) {

                currentSession =
                    data.session;

                await loadProfile();

                closeModal(loginModal);

                showDashboard();

                showToast(
                    "Account created successfully!"
                );

            }

        }
    );

}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "login-password"
                ).value;


            if (!email || !password) {

                showToast(
                    "Enter email and password."
                );

                return;

            }


            showToast(
                "Signing in..."
            );


            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email: email,

                        password: password

                    });


            if (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );

                showToast(
                    error.message
                );

                return;

            }


            currentSession =
                data.session;


            await loadProfile();


            loginForm.reset();

            closeModal(loginModal);


            if (
                currentProfile &&
                currentProfile.role ===
                    "admin"
            ) {

                showAdmin();

                showToast(
                    "Welcome, Admin."
                );

            } else {

                showDashboard();

                showToast(
                    "Login successful."
                );

            }

        }
    );

}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    if (!currentSession) {

        currentProfile = null;

        return;

    }


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
            .maybeSingle();


    if (error) {

        console.error(
            "PROFILE ERROR:",
            error
        );

        return;

    }


    currentProfile = data;

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

async function showDashboard() {

    if (!currentSession) {

        openModal(loginModal);

        return;

    }


    const name =
        document.getElementById(
            "dashboard-name"
        );

    const email =
        document.getElementById(
            "dashboard-email"
        );


    if (name) {

        name.textContent =
            currentProfile?.full_name ||
            currentSession.user.email;

    }


    if (email) {

        email.textContent =
            currentSession.user.email;

    }


    openModal(dashboardModal);

    await loadCustomerRequests();

}


/* =========================================================
   SHOW ADMIN
========================================================= */

async function showAdmin() {

    if (
        !currentProfile ||
        currentProfile.role !== "admin"
    ) {

        showToast(
            "Admin access required."
        );

        return;

    }


    openModal(adminModal);

    await loadAdminRequests();

}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    const {
        error
    } =
        await supabaseClient.auth
            .signOut();


    if (error) {

        console.error(error);

        showToast(
            error.message
        );

        return;

    }


    currentSession = null;

    currentProfile = null;


    closeModal(loginModal);

    closeModal(dashboardModal);

    closeModal(adminModal);


    showToast(
        "Logged out successfully."
    );

}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


if (adminLogout) {

    adminLogout.addEventListener(
        "click",
        function () {

            closeModal(adminModal);

        }
    );

}


/* =========================================================
   CUSTOMER REQUESTS
========================================================= */

async function loadCustomerRequests() {

    if (!requestList) return;


    requestList.innerHTML =
        `<div class="empty-state">
            Loading requests...
        </div>`;


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
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "REQUEST ERROR:",
            error
        );

        requestList.innerHTML =
            `<div class="empty-state">
                Unable to load requests.
            </div>`;

        return;

    }


    const count =
        document.getElementById(
            "request-count"
        );


    if (count) {

        count.textContent =
            data.length;

    }


    if (!data.length) {

        requestList.innerHTML =
            `<div class="empty-state">
                No project requests yet.
            </div>`;

        return;

    }


    requestList.innerHTML =
        data.map(request => {

            return `
                <div class="request-item">

                    <strong>
                        ${escapeHTML(
                            request.website_type
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            request.status
                        )}
                    </span>

                    <p>
                        Package:
                        ${escapeHTML(
                            request.package ||
                            "Not selected"
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            request.requirements ||
                            ""
                        )}
                    </p>

                </div>
            `;

        }).join("");

}


/* =========================================================
   ADMIN REQUESTS
========================================================= */

async function loadAdminRequests() {

    if (!adminRequestList) return;


    adminRequestList.innerHTML =
        `<div class="empty-state">
            Loading requests...
        </div>`;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("website_requests")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "ADMIN REQUEST ERROR:",
            error
        );

        adminRequestList.innerHTML =
            `<div class="empty-state">
                Unable to load requests.
            </div>`;

        return;

    }


    if (!data.length) {

        adminRequestList.innerHTML =
            `<div class="empty-state">
                No requests available.
            </div>`;

        return;

    }


    adminRequestList.innerHTML =
        data.map(request => {

            return `
                <div class="admin-request-item">

                    <h3>
                        ${escapeHTML(
                            request.website_type
                        )}
                    </h3>

                    <p>
                        <strong>
                            Customer:
                        </strong>
                        ${escapeHTML(
                            request.name
                        )}
                    </p>

                    <p>
                        <strong>
                            Email:
                        </strong>
                        ${escapeHTML(
                            request.email
                        )}
                    </p>

                    <p>
                        <strong>
                            Package:
                        </strong>
                        ${escapeHTML(
                            request.package ||
                            "None"
                        )}
                    </p>

                    <p>
                        <strong>
                            Requirements:
                        </strong>
                        ${escapeHTML(
                            request.requirements ||
                            "None"
                        )}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>
                        ${escapeHTML(
                            request.status ||
                            "NEW"
                        )}
                    </p>

                </div>
            `;

        }).join("");

}


/* =========================================================
   PROJECT REQUEST FORM
========================================================= */

if (projectForm) {

    projectForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!currentSession) {

                showToast(
                    "Please login before submitting a request."
                );

                openModal(loginModal);

                return;

            }


            const name =
                document.getElementById(
                    "name"
                ).value.trim();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const websiteType =
                document.getElementById(
                    "website-type"
                ).value;

            const packageName =
                document.getElementById(
                    "package"
                ).value;

            const requirements =
                document.getElementById(
                    "requirements"
                ).value.trim();


            showToast(
                "Submitting project request..."
            );


            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "website_requests"
                    )
                    .insert({

                        user_id:
                            currentSession.user.id,

                        name: name,

                        email: email,

                        website_type:
                            websiteType,

                        package:
                            packageName,

                        requirements:
                            requirements,

                        status: "NEW"

                    })
                    .select()
                    .single();


            if (error) {

                console.error(
                    "SUBMIT ERROR:",
                    error
                );

                showToast(
                    error.message
                );

                return;

            }


            projectForm.reset();


            showToast(
                "Project request submitted!"
            );


            if (
                dashboardModal &&
                dashboardModal.classList.contains(
                    "active"
                )
            ) {

                await loadCustomerRequests();

            }

        }
    );

}


/* =========================================================
   PACKAGE BUTTONS
========================================================= */

document.querySelectorAll(
    ".package-button"
).forEach(button => {

    button.addEventListener(
        "click",
        function () {

            selectedPackage =
                button.dataset.package;

            const packageInput =
                document.getElementById(
                    "package"
                );


            if (packageInput) {

                packageInput.value =
                    selectedPackage;

            }


            document
                .getElementById("contact")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


/* =========================================================
   PROJECT SELECT BUTTONS
========================================================= */

document.querySelectorAll(
    ".project-select"
).forEach(button => {

    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            const type =
                button.dataset.type;

            const websiteInput =
                document.getElementById(
                    "website-type"
                );


            if (websiteInput) {

                websiteInput.value =
                    type;

            }


            document
                .getElementById("contact")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenu =
    document.getElementById(
        "mobile-menu"
    );

const navLinks =
    document.querySelector(
        ".nav-links"
    );


if (mobileMenu && navLinks) {

    mobileMenu.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle(
                "active"
            );

            mobileMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

document.querySelectorAll(
    ".nav-link"
).forEach(link => {

    link.addEventListener(
        "click",
        function () {

            navLinks?.classList.remove(
                "active"
            );

            mobileMenu?.classList.remove(
                "active"
            );

        }
    );

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


if (
    "IntersectionObserver"
    in window
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

document.querySelectorAll(
    "img"
).forEach(image => {

    image.addEventListener(
        "error",
        function () {

            this.style.display =
                "none";

        }
    );

});


/* =========================================================
   SUPABASE SESSION
========================================================= */

async function initializeAuth() {

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .getSession();


    if (error) {

        console.error(
            "SESSION ERROR:",
            error
        );

        return;

    }


    currentSession =
        data.session;


    if (currentSession) {

        await loadProfile();

    }

}


supabaseClient.auth
    .onAuthStateChange(
        async (
            event,
            session
        ) => {

            currentSession =
                session;

            if (session) {

                await loadProfile();

            } else {

                currentProfile = null;

            }

        }
    );


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
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
   INTRO
========================================================= */

const intro =
    document.getElementById(
        "cinematic-intro"
    );

const mainSite =
    document.getElementById(
        "main-site"
    );

const progressBar =
    document.getElementById(
        "intro-progress-bar"
    );

const percent =
    document.getElementById(
        "intro-percent"
    );


if (intro) {

    let progress = 0;


    const timer =
        setInterval(
            function () {

                progress += 1.5;


                if (
                    progress >= 100
                ) {

                    progress = 100;

                    clearInterval(
                        timer
                    );

                }


                if (progressBar) {

                    progressBar.style.width =
                        `${progress}%`;

                }


                if (percent) {

                    percent.textContent =
                        `${Math.floor(progress)}%`;

                }

            },
            100
        );


    setTimeout(
        function () {

            intro.classList.add(
                "hidden"
            );

            if (mainSite) {

                mainSite.classList.add(
                    "visible"
                );

            }

        },
        7000
    );

}


/* =========================================================
   START
========================================================= */

initializeAuth();

console.log(
    "SOHAM INDUSTRIES website loaded."
);

console.log(
    "Supabase:",
    supabaseClient
        ? "Connected"
        : "Not connected"
);
