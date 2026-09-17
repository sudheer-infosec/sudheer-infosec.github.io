/* =========================================================
   CYBERSECURITY PORTFOLIO V2
   SOC / DFIR / THREAT ANALYSIS ANIMATION ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. MATRIX / CYBER TELEMETRY BACKGROUND
       ===================================================== */

    const canvas = document.getElementById("matrix");

    if (canvas) {

        const ctx = canvas.getContext("2d");

        let width;
        let height;
        let columns;
        let drops;

        const characters =
            "01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}#$%";

        function resizeMatrix() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            columns = Math.floor(width / 16);

            drops = Array.from(
                { length: columns },
                () => Math.random() * height / 16
            );
        }

        resizeMatrix();

        window.addEventListener(
            "resize",
            resizeMatrix
        );

        function drawMatrix() {

            ctx.fillStyle =
                "rgba(5, 8, 12, 0.09)";

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

            for (let i = 0; i < columns; i++) {

                const character =
                    characters[
                        Math.floor(
                            Math.random() *
                            characters.length
                        )
                    ];

                ctx.fillStyle =
                    i % 5 === 0
                        ? "#00D9FF"
                        : "#00FF88";

                ctx.font =
                    "12px monospace";

                ctx.fillText(
                    character,
                    i * 16,
                    drops[i] * 16
                );

                if (
                    drops[i] * 16 > height &&
                    Math.random() > 0.975
                ) {
                    drops[i] = 0;
                }

                drops[i]++;
            }

            requestAnimationFrame(
                drawMatrix
            );
        }

        drawMatrix();
    }


    /* =====================================================
       02. CYBERSECURITY ROLE TYPING ENGINE
       ===================================================== */

    const typingElement =
        document.getElementById("typing");

    if (typingElement) {

        const roles = [

            "SOC ANALYST",
            "ETHICAL HACKER",
            "DIGITAL FORENSICS",
            "THREAT DETECTION",
            "INCIDENT RESPONSE",
            "SECURITY RESEARCHER",
            "CYBERSECURITY MENTOR"

        ];

        let roleIndex = 0;
        let characterIndex = 0;
        let deleting = false;

        function typeRole() {

            const currentRole =
                roles[roleIndex];

            if (!deleting) {

                characterIndex++;

                typingElement.textContent =
                    currentRole.substring(
                        0,
                        characterIndex
                    );

                if (
                    characterIndex >=
                    currentRole.length
                ) {

                    deleting = true;

                    setTimeout(
                        typeRole,
                        1500
                    );

                    return;
                }

            } else {

                characterIndex--;

                typingElement.textContent =
                    currentRole.substring(
                        0,
                        characterIndex
                    );

                if (characterIndex <= 0) {

                    deleting = false;

                    roleIndex =
                        (roleIndex + 1) %
                        roles.length;
                }
            }

            setTimeout(
                typeRole,
                deleting ? 45 : 70
            );
        }

        typeRole();
    }


    /* =====================================================
       03. SMOOTH NAVIGATION
       ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                event => {

                    const target =
                        document.querySelector(
                            anchor.getAttribute(
                                "href"
                            )
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        });


    /* =====================================================
       04. SOC PROJECT SCANNING EFFECT
       ===================================================== */

    const projects =
        document.querySelectorAll(
            ".project"
        );

    projects.forEach(project => {

        project.addEventListener(
            "mouseenter",
            () => {

                project.classList.remove(
                    "security-scan"
                );

                void project.offsetWidth;

                project.classList.add(
                    "security-scan"
                );
            }
        );

        project.addEventListener(
            "mouseleave",
            () => {

                project.classList.remove(
                    "security-scan"
                );
            }
        );
    });


    /* =====================================================
       05. RESOURCE HUB ANALYSIS EFFECT
       ===================================================== */

    const resources =
        document.querySelectorAll(
            ".resource-card"
        );

    resources.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.classList.add(
                    "resource-active"
                );
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.classList.remove(
                    "resource-active"
                );
            }
        );
    });


    /* =====================================================
       06. SAFE SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".section, .project, .resource-card"
        );

    if (
        "IntersectionObserver" in window
    ) {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "v2-reveal"
                );
            }
        );

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        "is-visible"
                                    );

                                revealObserver
                                    .unobserve(
                                        entry.target
                                    );
                            }
                        }
                    );
                },
                {
                    threshold: 0.08
                }
            );

        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );
            }
        );
    }


    /* =====================================================
       07. SECURITY STATUS EFFECT
       ===================================================== */

    const statusElements =
        document.querySelectorAll(
            ".status"
        );

    statusElements.forEach(
        status => {

            status.classList.add(
                "status-online"
            );
        }
    );


    /* =====================================================
       08. CYBER CONSOLE LOG
       ===================================================== */

    console.log(
        "%c[ SOC ENGINE ] ONLINE",
        "color:#00FF88;font-weight:bold;"
    );

    console.log(
        "%c[ TELEMETRY ] Monitoring active",
        "color:#00D9FF;font-weight:bold;"
    );

    console.log(
        "%c[ DFIR ] Investigation modules ready",
        "color:#A78BFA;font-weight:bold;"
    );

    console.log(
        "%c[ SECURITY ] Portfolio interface initialized",
        "color:#4DA3FF;font-weight:bold;"
    );

});