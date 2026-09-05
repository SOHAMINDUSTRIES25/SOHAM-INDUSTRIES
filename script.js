/* =========================================================
   SOHAM INDUSTRIES
   MAIN JAVASCRIPT + SUPABASE BACKEND
   ========================================================= */

/* =========================================================
   1. SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL = "https://zqxnumdpefndysbkrrcy.supabase.co";

/*
   IMPORTANT:
   Replace ONLY the text below with your Supabase
   PUBLISHABLE KEY.

   Do NOT use the secret/service-role key.
*/
const SUPABASE_PUBLISHABLE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";


// Make sure Supabase CDN is loaded
if (!window.supabase) {
    console.error(
        "Supabase library not found. Make sure this is BEFORE script.js in index.html:"
    );

    console.error(
        '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'
    );
}

const supabaseClient = window.supabase
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    )
    : null;


/* =========================================================
   2. GLOBAL VARIABLES
   ========================================================= */

let currentSession = null;
let currentProfile = null;
let selectedPackage = "";

const body = document.body;


/* =========================================================
   3. HELPER FUNCTIONS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function showToast(message, type = "normal") {
    let toast = $("#toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";

        Object.assign(toast.style, {
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 22px",
            borderRadius: "10px",
            background: "#111",
            color: "#fff",
            zIndex: "99999",
            fontSize: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,.4)",
            transition: "opacity .3s ease"
        });

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    if (type === "error") {
        toast.style.border = "1px solid #ff4d4d";
    } else {
        toast.style.border = "1px solid rgba(255,255,255,.2)";
    }

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
    }, 3500);
}


function closeAllModals() {
    $$(".modal, .popup, .overlay").forEach(element => {
        element.classList.remove("active");
    });

    body.classList.remove("modal-open");
}


function openModal(element) {
    if (!element) return;

    element.classList.add("active");
    body.classList.add("modal-open");
}


function closeModal(element) {
    if (!element) return;

    element.classList.remove("active");

    if (!document.querySelector(".modal.active")) {
        body.classList.remove("modal-open");
    }
}


/* =========================================================
   4. CINEMATIC INTRO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const intro = $("#intro");
    const progress = $("#progress");

    if (intro) {

        let progressValue = 0;

        const progressTimer = setInterval(() => {

            progressValue += Math.random() * 4;

            if (progressValue >= 100) {
                progressValue = 100;
                clearInterval(progressTimer);
            }

            if (progress) {
                progress.style.width = `${progressValue}%`;
            }

        }, 100);

        setTimeout(() => {

            intro.classList.add("intro-hidden");

            setTimeout(() => {
                intro.style.display = "none";
            }, 1000);

        }, 7000);
    }

});


/* =========================================================
   5. NAVIGATION
   ========================================================= */

const menuButton =
    $("#menu-toggle") ||
    $(".menu-toggle") ||
    $(".hamburger");

const nav =
    $("#nav") ||
    $(".nav-links") ||
    $("nav ul");

if (menuButton && nav) {

    menuButton.addEventListener("click", () => {
        nav.classList.toggle("active");
        menuButton.classList.toggle("active");
    });

}


$$("a[href^='#']").forEach(link => {

    link.addEventListener("click", event => {

        const targetID = link.getAttribute("href");

        if (!targetID || targetID === "#") return;

        const target = document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        if (nav) {
            nav.classList.remove("active");
        }

    });

});


/* =========================================================
   6. ACTIVE NAVIGATION
   ========================================================= */

const sections = $$("section[id]");
const navLinks = $$("nav a[href^='#']");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const top = section.offsetTop - 150;
        const height = section.offsetHeight;

        if (
            window.scrollY >= top &&
            window.scrollY < top + height
        ) {
            currentSection = section.id;
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            currentSection &&
            link.getAttribute("href") === `#${currentSection}`
        ) {
            link.classList.add("active");
        }

    });

});


/* =========================================================
   7. SCROLL REVEAL
   ========================================================= */

const revealElements = $$(
    ".reveal, .service-card, .package-card, .project-card, .about-card"
);

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* =========================================================
   8. MODAL HELPERS
   ========================================================= */

const loginModal =
    $("#loginModal") ||
    $("#login-modal") ||
    $(".login-modal");

const dashboardModal =
    $("#dashboardModal") ||
    $("#dashboard-modal") ||
    $(".dashboard-modal");

const adminModal =
    $("#adminModal") ||
    $("#admin-modal") ||
    $(".admin-modal");


function openLogin() {
    openModal(loginModal);
}


function openDashboard() {
    openModal(dashboardModal);
    loadCustomerRequests();
}


function openAdminPanel() {
    openModal(adminModal);
    loadAdminRequests();
}


function logoutUser() {

    if (!supabaseClient) return;

    supabaseClient.auth.signOut()
        .then(({ error }) => {

            if (error) {
                console.error(error);
                showToast("Logout failed", "error");
                return;
            }

            currentSession = null;
            currentProfile = null;

            closeAllModals();

            showToast("Logged out successfully");

        });

}


/* =========================================================
   9. LOGIN BUTTONS
   ========================================================= */

$$(
    "#loginBtn, .login-btn, [data-action='login']"
).forEach(button => {

    button.addEventListener("click", event => {

        event.preventDefault();

        openLogin();

    });

});


$$(
    "#logoutBtn, .logout-btn, [data-action='logout']"
).forEach(button => {

    button.addEventListener("click", event => {

        event.preventDefault();

        logoutUser();

    });

});


/* =========================================================
   10. CLOSE BUTTONS
   ========================================================= */

$$(
    ".close-modal, .modal-close, [data-close]"
).forEach(button => {

    button.addEventListener("click", () => {

        const modal = button.closest(
            ".modal, .popup, .overlay"
        );

        if (modal) {
            closeModal(modal);
        } else {
            closeAllModals();
        }

    });

});


document.addEventListener("click", event => {

    if (
        event.target.classList.contains("modal") ||
        event.target.classList.contains("overlay")
    ) {
        closeModal(event.target);
    }

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeAllModals();
    }

});


/* =========================================================
   11. LOGIN / SIGNUP TABS
   ========================================================= */

const loginForm =
    $("#loginForm") ||
    $("#login-form");

const signupForm =
    $("#signupForm") ||
    $("#signup-form");


const loginTab =
    $("#loginTab") ||
    $(".login-tab");

const signupTab =
    $("#signupTab") ||
    $(".signup-tab");


if (loginTab && signupTab) {

    loginTab.addEventListener("click", () => {

        loginTab.classList.add("active");
        signupTab.classList.remove("active");

        if (loginForm) {
            loginForm.style.display = "block";
        }

        if (signupForm) {
            signupForm.style.display = "none";
        }

    });


    signupTab.addEventListener("click", () => {

        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        if (signupForm) {
            signupForm.style.display = "block";
        }

        if (loginForm) {
            loginForm.style.display = "none";
        }

    });

}


/* =========================================================
   12. LOAD USER PROFILE
   ========================================================= */

async function loadProfile() {

    if (!supabaseClient || !currentSession) {
        currentProfile = null;
        return null;
    }

    const userID = currentSession.user.id;

    const {
        data,
        error
    } = await supabaseClient
        .from("profiles")
        .select(
            "id, full_name, email, role, created_at"
        )
        .eq("id", userID)
        .maybeSingle();

    if (error) {

        console.error(
            "Profile loading error:",
            error
        );

        currentProfile = null;

        return null;
    }

    currentProfile = data;

    return data;
}


/* =========================================================
   13. SIGN UP
   ========================================================= */

if (signupForm) {

    signupForm.addEventListener("submit", async event => {

        event.preventDefault();

        if (!supabaseClient) {
            showToast(
                "Supabase is not connected.",
                "error"
            );
            return;
        }

        const nameInput =
            signupForm.querySelector(
                "[name='name'], [name='full_name'], #signupName"
            );

        const emailInput =
            signupForm.querySelector(
                "[name='email'], #signupEmail"
            );

        const passwordInput =
            signupForm.querySelector(
                "[name='password'], #signupPassword"
            );

        const name =
            nameInput?.value.trim() || "";

        const email =
            emailInput?.value.trim() || "";

        const password =
            passwordInput?.value || "";


        if (!email || !password) {

            showToast(
                "Please enter your email and password.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showToast(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        showToast("Creating your account...");


        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

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
                "Signup error:",
                error
            );

            showToast(
                error.message,
                "error"
            );

            return;
        }


        if (data.user && !data.session) {

            showToast(
                "Account created! Check your email and confirm your account."
            );

            signupForm.reset();

            return;
        }


        if (data.session) {

            currentSession = data.session;

            await loadProfile();

            signupForm.reset();

            closeAllModals();

            showToast(
                "Account created successfully!"
            );

            openDashboard();

        }

    });

}


/* =========================================================
   14. LOGIN
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener("submit", async event => {

        event.preventDefault();

        if (!supabaseClient) {

            showToast(
                "Supabase is not connected.",
                "error"
            );

            return;
        }


        const emailInput =
            loginForm.querySelector(
                "[name='email'], #loginEmail"
            );

        const passwordInput =
            loginForm.querySelector(
                "[name='password'], #loginPassword"
            );


        const email =
            emailInput?.value.trim() || "";

        const password =
            passwordInput?.value || "";


        if (!email || !password) {

            showToast(
                "Enter your email and password.",
                "error"
            );

            return;
        }


        showToast("Signing in...");


        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


        if (error) {

            console.error(
                "Login error:",
                error
            );

            showToast(
                error.message,
                "error"
            );

            return;
        }


        currentSession = data.session;


        await loadProfile();


        loginForm.reset();

        closeAllModals();


        if (
            currentProfile &&
            currentProfile.role === "admin"
        ) {

            showToast(
                "Welcome back, Admin."
            );

            openAdminPanel();

        } else {

            showToast(
                "Login successful."
            );

            openDashboard();

        }

    });

}


/* =========================================================
   15. AUTH STATE
   ========================================================= */

async function refreshAuth() {

    if (!supabaseClient) return;

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        return;
    }


    currentSession = data.session;


    if (currentSession) {

        await loadProfile();

    } else {

        currentProfile = null;

    }

}


if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {

            currentSession = session;

            if (session) {

                setTimeout(
                    () => loadProfile(),
                    0
                );

            } else {

                currentProfile = null;

            }

        }
    );

}


/* =========================================================
   16. INITIAL AUTH CHECK
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        refreshAuth();

    }
);


/* =========================================================
   17. PACKAGE SELECTION
   ========================================================= */

$$(
    ".package-card button, .package-btn, [data-package]"
).forEach(button => {

    button.addEventListener("click", event => {

        event.preventDefault();

        const card =
            button.closest(".package-card");

        let packageName =
            button.dataset.package || "";

        if (!packageName && card) {

            const heading =
                card.querySelector(
                    "h2, h3, .package-name"
                );

            packageName =
                heading?.textContent.trim() || "";

        }

        selectedPackage = packageName;

        const requestSection =
            $("#contact") ||
            $("#projects") ||
            $("#request");

        if (requestSection) {

            requestSection.scrollIntoView({
                behavior: "smooth"
            });

        }

        const packageInput =
            $(
                "[name='package'], #package"
            );

        if (packageInput) {

            packageInput.value =
                selectedPackage;

        }

    });

});


/* =========================================================
   18. PROJECT REQUEST FORM
   ========================================================= */

const requestForm =
    $("#requestForm") ||
    $("#projectRequestForm") ||
    $("#contactForm");


if (requestForm) {

    requestForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!supabaseClient) {

                showToast(
                    "Supabase is not connected.",
                    "error"
                );

                return;
            }


            if (!currentSession) {

                showToast(
                    "Please create an account or login first.",
                    "error"
                );

                openLogin();

                return;
            }


            const getValue = names => {

                for (const name of names) {

                    const input =
                        requestForm.querySelector(
                            `[name="${name}"], #${name}`
                        );

                    if (input) {
                        return input.value.trim();
                    }

                }

                return "";

            };


            const name =
                getValue([
                    "name",
                    "full_name",
                    "clientName"
                ]);


            const email =
                getValue([
                    "email",
                    "clientEmail"
                ]);


            const websiteType =
                getValue([
                    "website_type",
                    "websiteType",
                    "type"
                ]);


            const packageName =
                getValue([
                    "package",
                    "packageName"
                ]) ||
                selectedPackage;


            const requirements =
                getValue([
                    "requirements",
                    "message",
                    "details"
                ]);


            if (!name || !email || !websiteType) {

                showToast(
                    "Please fill all required fields.",
                    "error"
                );

                return;
            }


            showToast(
                "Sending your project request..."
            );


            const {
                data,
                error
            } = await supabaseClient
                .from("website_requests")
                .insert({

                    user_id:
                        currentSession.user.id,

                    name: name,

                    email: email,

                    website_type:
                        websiteType,

                    package:
                        packageName || null,

                    requirements:
                        requirements || null,

                    status: "NEW"

                })
                .select()
                .single();


            if (error) {

                console.error(
                    "Request error:",
                    error
                );

                showToast(
                    error.message,
                    "error"
                );

                return;
            }


            console.log(
                "Request created:",
                data
            );


            requestForm.reset();

            selectedPackage = "";


            showToast(
                "Project request submitted successfully!"
            );


            setTimeout(() => {

                openDashboard();

            }, 800);

        }
    );

}


/* =========================================================
   19. LOAD CUSTOMER REQUESTS
   ========================================================= */

async function loadCustomerRequests() {

    const container =
        $(
            "#customerRequests, #myRequests, .customer-requests"
        );


    if (!container) return;


    if (!currentSession) {

        container.innerHTML =
            "<p>Please login to view your requests.</p>";

        return;
    }


    container.innerHTML =
        "<p>Loading requests...</p>";


    const {
        data,
        error
    } = await supabaseClient
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

        console.error(error);

        container.innerHTML =
            `<p>Unable to load requests.</p>`;

        return;
    }


    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>No project requests yet.</p>";

        return;
    }


    container.innerHTML =
        data.map(request => {

            const date =
                new Date(
                    request.created_at
                ).toLocaleDateString();


            return `
                <div class="request-item">

                    <div>
                        <strong>
                            ${escapeHTML(
                                request.website_type || "Website"
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                request.status || "NEW"
                            )}
                        </span>
                    </div>

                    <p>
                        Package:
                        ${escapeHTML(
                            request.package || "Not selected"
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            request.requirements || ""
                        )}
                    </p>

                    <small>
                        ${date}
                    </small>

                </div>
            `;

        }).join("");

}


/* =========================================================
   20. LOAD ADMIN REQUESTS
   ========================================================= */

async function loadAdminRequests() {

    const container =
        $(
            "#adminRequests, .admin-requests"
        );


    if (!container) return;


    if (
        !currentProfile ||
        currentProfile.role !== "admin"
    ) {

        container.innerHTML =
            "<p>Admin access required.</p>";

        return;
    }


    container.innerHTML =
        "<p>Loading all project requests...</p>";


    const {
        data,
        error
    } = await supabaseClient
        .from("website_requests")
        .select(
            "id, user_id, name, email, website_type, package, requirements, status, created_at"
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Admin requests error:",
            error
        );

        container.innerHTML =
            "<p>Unable to load admin requests.</p>";

        return;
    }


    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>No project requests found.</p>";

        return;
    }


    container.innerHTML =
        data.map(request => {

            const date =
                new Date(
                    request.created_at
                ).toLocaleString();


            return `
                <div class="admin-request-item">

                    <h3>
                        ${escapeHTML(
                            request.website_type || "Website"
                        )}
                    </h3>

                    <p>
                        <strong>Customer:</strong>
                        ${escapeHTML(
                            request.name || ""
                        )}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${escapeHTML(
                            request.email || ""
                        )}
                    </p>

                    <p>
                        <strong>Package:</strong>
                        ${escapeHTML(
                            request.package || "None"
                        )}
                    </p>

                    <p>
                        <strong>Requirements:</strong>
                        ${escapeHTML(
                            request.requirements || "None"
                        )}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${escapeHTML(
                            request.status || "NEW"
                        )}
                    </p>

                    <small>
                        ${date}
                    </small>

                </div>
            `;

        }).join("");

}


/* =========================================================
   21. HTML SECURITY HELPER
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   22. DASHBOARD BUTTON
   ========================================================= */

$$(
    "#dashboardBtn, .dashboard-btn, [data-action='dashboard']"
).forEach(button => {

    button.addEventListener("click", event => {

        event.preventDefault();

        if (!currentSession) {

            showToast(
                "Please login first.",
                "error"
            );

            openLogin();

            return;
        }

        openDashboard();

    });

});


/* =========================================================
   23. ADMIN BUTTON
   ========================================================= */

$$(
    "#adminBtn, .admin-btn, [data-action='admin']"
).forEach(button => {

    button.addEventListener("click", event => {

        event.preventDefault();

        if (!currentSession) {

            showToast(
                "Please login first.",
                "error"
            );

            openLogin();

            return;
        }


        if (
            !currentProfile ||
            currentProfile.role !== "admin"
        ) {

            showToast(
                "Admin access required.",
                "error"
            );

            return;
        }


        openAdminPanel();

    });

});


/* =========================================================
   24. PROJECT CATEGORY BUTTONS
   ========================================================= */

$$(
    ".project-card, .project-category"
).forEach(card => {

    card.addEventListener("click", () => {

        const title =
            card.querySelector(
                "h2, h3, h4"
            );

        if (title) {

            selectedPackage =
                selectedPackage || "";

            showToast(
                `${title.textContent.trim()} selected`
            );

        }

    });

});


/* =========================================================
   25. IMAGE FALLBACK
   ========================================================= */

$$("img").forEach(image => {

    image.addEventListener("error", () => {

        image.style.opacity = "0";

        image.parentElement?.classList.add(
            "image-missing"
        );

    });

});


/* =========================================================
   26. CURSOR EFFECT
   ========================================================= */

const cursor =
    document.querySelector(".cursor");

const cursorGlow =
    document.querySelector(".cursor-glow");


if (cursor || cursorGlow) {

    document.addEventListener(
        "mousemove",
        event => {

            const x = event.clientX;
            const y = event.clientY;


            if (cursor) {

                cursor.style.left =
                    `${x}px`;

                cursor.style.top =
                    `${y}px`;

            }


            if (cursorGlow) {

                cursorGlow.style.left =
                    `${x}px`;

                cursorGlow.style.top =
                    `${y}px`;

            }

        }
    );


    $$(
        "a, button, input, textarea, select"
    ).forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                cursor?.classList.add(
                    "cursor-hover"
                );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                cursor?.classList.remove(
                    "cursor-hover"
                );

            }
        );

    });

}


/* =========================================================
   27. PAGE LOAD
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        console.log(
            "SOHAM INDUSTRIES website loaded."
        );

        console.log(
            "Supabase:",
            supabaseClient
                ? "Connected"
                : "NOT CONNECTED"
        );

    }
);


/* =========================================================
   END
   ========================================================= */
