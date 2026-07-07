/* =====================================================
   GRADUACIÓN GABINO LUCIANO 2026
   SCRIPT.JS - FASE 3 GALA PREMIUM+
   Mejoras:
   - Partículas avanzadas y optimizadas.
   - Animación de birrete.
   - Transiciones más elegantes.
   - RSVP profesional con estado visual.
   - Mensaje de WhatsApp completo, incluyendo canción.
   - Optimización de rendimiento y compatibilidad móvil.
===================================================== */

"use strict";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

/*
   WhatsApp requiere número internacional sin +, espacios ni guiones.
   Para México: 52 + número a 10 dígitos.
*/
const WHATSAPP_NUMBER = "525570737497";

/*
   Fecha del evento en horario del centro de México.
   Estado de México usa UTC-06:00.
*/
const EVENT_DATE = new Date("2026-08-29T14:45:00-06:00");

/* =====================================================
   HELPERS
===================================================== */

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isMobileViewport = () =>
    window.matchMedia &&
    window.matchMedia("(max-width: 768px)").matches;

const requestIdle =
    window.requestIdleCallback ||
    function (callback) {
        return window.setTimeout(callback, 450);
    };

function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
}

function setHidden(element, hidden) {
    if (!element) return;
    if (hidden) {
        element.setAttribute("hidden", "");
    } else {
        element.removeAttribute("hidden");
    }
}

function forceReflow(element) {
    if (!element) return;
    void element.offsetWidth;
}

/* =====================================================
   ESTADO GLOBAL
===================================================== */

let currentSlide = 0;
let selectedPersonality = "";
let musicPlaying = false;
let countdownTimer = null;
let confettiLaunched = false;
let particleTimer = null;
let carouselTimer = null;

/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const introScreen = $("#introScreen");
    const openInvitationBtn = $("#openInvitationBtn");
    const audioBtn = $("#audioBtn");
    const bgMusic = $("#bgMusic");
    const graduationCap = $("#graduationCap");

    const slidesContainer = $("#slides");
    const slides = $$(".slide");
    const carouselDots = $("#carouselDots");
    const nextBtn = $("#nextSlide");
    const prevBtn = $("#prevSlide");

    const surveyCards = $$(".survey-card");
    const rsvpForm = $("#rsvpForm");
    const rsvpStatus = $("#rsvpStatus");
    const rsvpSubmitBtn = $("#rsvpSubmitBtn");
    const revealElements = $$(".glass-card,.notice-card");

    /* =====================================================
       APERTURA DE INVITACIÓN
    ===================================================== */

    function updateAudioButton() {
        if (!audioBtn) return;

        audioBtn.textContent = musicPlaying ? "♫" : "♪";
        audioBtn.setAttribute("aria-pressed", String(musicPlaying));
        audioBtn.setAttribute(
            "aria-label",
            musicPlaying ? "Pausar música" : "Activar música"
        );
    }

    function startMusic() {
        if (!bgMusic) return;

        bgMusic.play()
            .then(() => {
                musicPlaying = true;
                updateAudioButton();
            })
            .catch(() => {
                musicPlaying = false;
                updateAudioButton();
                console.info("El navegador bloqueó el autoplay. El usuario puede activar la música manualmente.");
            });
    }

    function toggleMusic() {
        if (!bgMusic) return;

        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            updateAudioButton();
            return;
        }

        bgMusic.play()
            .then(() => {
                musicPlaying = true;
                updateAudioButton();
            })
            .catch(() => {
                musicPlaying = false;
                updateAudioButton();
                console.info("No se pudo reproducir el audio sin interacción del usuario.");
            });
    }

    function launchCapAnimation(mode = "intro") {
        if (!graduationCap || prefersReducedMotion) return;

        const className = mode === "rsvp" ? "cap-burst" : "is-launched";
        graduationCap.classList.remove("is-launched", "cap-burst");
        forceReflow(graduationCap);
        graduationCap.classList.add(className);

        window.setTimeout(() => {
            graduationCap.classList.remove(className);
        }, mode === "rsvp" ? 1300 : 1650);
    }

    function openInvitation() {
        if (introScreen) {
            introScreen.classList.add("intro-screen--hidden");

            window.setTimeout(() => {
                introScreen.setAttribute("hidden", "");
            }, 1000);
        }

        startMusic();
        launchWelcomeEffect();
        launchCapAnimation("intro");
    }

    if (openInvitationBtn) {
        openInvitationBtn.addEventListener("click", openInvitation);
    }

    if (audioBtn) {
        audioBtn.addEventListener("click", toggleMusic);
        updateAudioButton();
    }

    /* =====================================================
       CUENTA REGRESIVA
    ===================================================== */

    function updateCountdown() {
        const distance = EVENT_DATE.getTime() - Date.now();

        if (distance <= 0) {
            setText("#days", "00");
            setText("#hours", "00");
            setText("#minutes", "00");
            setText("#seconds", "00");

            if (!confettiLaunched) {
                confettiLaunched = true;
                graduationConfetti();

                if (countdownTimer) {
                    clearInterval(countdownTimer);
                    countdownTimer = null;
                }
            }

            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );
        const seconds = Math.floor(
            (distance % (1000 * 60)) /
            1000
        );

        setText("#days", String(days).padStart(2, "0"));
        setText("#hours", String(hours).padStart(2, "0"));
        setText("#minutes", String(minutes).padStart(2, "0"));
        setText("#seconds", String(seconds).padStart(2, "0"));
    }

    updateCountdown();
    countdownTimer = window.setInterval(updateCountdown, 1000);

    /* =====================================================
       CARRUSEL
    ===================================================== */

    function updateDots() {
        if (!carouselDots) return;

        $$(".carousel-dot", carouselDots).forEach((dot, index) => {
            dot.classList.toggle("active", index === currentSlide);
            dot.setAttribute("aria-selected", String(index === currentSlide));
        });
    }

    function goToSlide(index) {
        if (!slidesContainer || slides.length === 0) return;

        currentSlide = (index + slides.length) % slides.length;

        window.requestAnimationFrame(() => {
            slidesContainer.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
        });

        updateDots();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function createDots() {
        if (!carouselDots || slides.length === 0) return;

        carouselDots.innerHTML = "";

        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", `Ir a la imagen ${index + 1}`);
            dot.setAttribute("aria-selected", String(index === 0));

            if (index === 0) {
                dot.classList.add("active");
            }

            dot.addEventListener("click", () => {
                goToSlide(index);
                restartCarouselTimer();
            });

            carouselDots.appendChild(dot);
        });
    }

    function startCarouselTimer() {
        if (carouselTimer || slides.length <= 1 || prefersReducedMotion) return;
        carouselTimer = window.setInterval(nextSlide, 5200);
    }

    function stopCarouselTimer() {
        if (!carouselTimer) return;
        clearInterval(carouselTimer);
        carouselTimer = null;
    }

    function restartCarouselTimer() {
        stopCarouselTimer();
        startCarouselTimer();
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            restartCarouselTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            restartCarouselTimer();
        });
    }

    createDots();
    goToSlide(0);
    startCarouselTimer();

    /*
       Soporte swipe para móviles.
    */
    if (slidesContainer && slides.length > 1) {
        let touchStartX = 0;
        let touchEndX = 0;

        slidesContainer.addEventListener(
            "touchstart",
            event => {
                touchStartX = event.changedTouches[0].screenX;
            },
            { passive: true }
        );

        slidesContainer.addEventListener(
            "touchend",
            event => {
                touchEndX = event.changedTouches[0].screenX;
                const distance = touchEndX - touchStartX;

                if (Math.abs(distance) > 50) {
                    distance < 0 ? nextSlide() : prevSlide();
                    restartCarouselTimer();
                }
            },
            { passive: true }
        );
    }

    /* =====================================================
       ENCUESTA ¿CÓMO SOY?
    ===================================================== */

    surveyCards.forEach(card => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");

        const selectCard = () => {
            surveyCards.forEach(item => item.classList.remove("selected"));
            card.classList.add("selected");
            selectedPersonality = card.dataset.option || "";
        };

        card.addEventListener("click", selectCard);
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectCard();
            }
        });
    });

    /* =====================================================
       CONFIRMACIÓN RSVP + WHATSAPP
    ===================================================== */

    function showRsvpStatus(message, type = "success") {
        if (!rsvpStatus) return;

        rsvpStatus.textContent = message;
        rsvpStatus.classList.toggle("is-error", type === "error");
        setHidden(rsvpStatus, false);
    }

    function clearInvalidStates() {
        $$(".is-invalid", rsvpForm || document).forEach(element => {
            element.classList.remove("is-invalid");
        });
    }

    function setSubmitLoading(isLoading) {
        if (!rsvpSubmitBtn) return;

        rsvpSubmitBtn.classList.toggle("is-loading", isLoading);
        rsvpSubmitBtn.disabled = isLoading;

        const label = $("span", rsvpSubmitBtn);
        if (label) {
            label.textContent = isLoading ? "Preparando WhatsApp" : "Confirmar por WhatsApp";
        }
    }

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", event => {
            event.preventDefault();
            clearInvalidStates();

            const nameInput = $("#guestName");
            const attendanceInput = $("#attendance");
            const songInput = $("#songSuggestion");
            const messageInput = $("#message");

            const name = nameInput ? nameInput.value.trim() : "";
            const attendance = attendanceInput ? attendanceInput.value.trim() : "";
            const song = songInput ? songInput.value.trim() : "";
            const message = messageInput ? messageInput.value.trim() : "";

            const invalidFields = [];

            if (!name && nameInput) invalidFields.push(nameInput);
            if (!attendance && attendanceInput) invalidFields.push(attendanceInput);

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => field.classList.add("is-invalid"));
                invalidFields[0].focus();
                showRsvpStatus("Por favor completa tu nombre y confirma tu asistencia antes de enviar.", "error");
                return;
            }

            const whatsappText = [
                "🎓 GRADUACIÓN GABINO LUCIANO 🎓",
                "",
                `Nombre: ${name}`,
                `Asistencia: ${attendance}`,
                `¿Cómo soy?: ${selectedPersonality || "Sin respuesta"}`,
                `Canción que no debe faltar: ${song || "Sin sugerencia"}`,
                `Mensaje: ${message || "Sin mensaje"}`
            ].join("\n");

            const url =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

            setSubmitLoading(true);
            showRsvpStatus("Tu confirmación está lista. Se abrirá WhatsApp para enviarla.");
            launchCapAnimation("rsvp");
            graduationConfetti(isMobileViewport() ? 28 : 52);

            window.open(url, "_blank", "noopener,noreferrer");

            window.setTimeout(() => {
                setSubmitLoading(false);
            }, 900);
        });
    }

    /* =====================================================
       REVEAL ON SCROLL
    ===================================================== */

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
        );

        revealElements.forEach((item, index) => {
            item.classList.add("reveal");
            item.style.transitionDelay = `${Math.min(index * 65, 260)}ms`;
            revealObserver.observe(item);
        });
    } else {
        revealElements.forEach(item => item.classList.add("active"));
    }

    /* =====================================================
       PARTÍCULAS AVANZADAS
    ===================================================== */

    function createParticle(options = {}) {
        if (prefersReducedMotion || document.hidden) return;

        const container = $("#particles");
        if (!container) return;

        const maxParticles = isMobileViewport() ? 26 : 70;
        if (container.children.length >= maxParticles) return;

        const particle = document.createElement("span");
        const types = options.types || ["dot", "spark", "line"];
        const type = types[Math.floor(Math.random() * types.length)];
        const size = options.size || Math.random() * 5 + 2;
        const startX = options.x ?? Math.random() * 100;
        const driftX = (Math.random() * 80 - 40) * (isMobileViewport() ? .55 : 1);
        const duration = options.duration || Math.random() * 6200 + 6800;
        const opacity = Math.random() * .45 + .35;
        const colors = ["#30d5c8", "#ffffff", "#c0c0c0", "#f5d483"];

        particle.className = `particle particle--${type}`;
        particle.style.width = type === "line" ? "2px" : `${size}px`;
        particle.style.height = type === "line" ? `${size * 7}px` : `${type === "spark" ? size * 2.8 : size}px`;
        particle.style.left = `${startX}%`;
        particle.style.top = options.y ? `${options.y}%` : "110%";
        particle.style.opacity = String(opacity);
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);

        const animation = particle.animate(
            [
                {
                    transform: "translate3d(0, 0, 0) rotate(0deg)",
                    opacity
                },
                {
                    transform: `translate3d(${driftX}px, -124vh, 0) rotate(${Math.random() * 540 + 180}deg)`,
                    opacity: 0
                }
            ],
            {
                duration,
                easing: "linear",
                fill: "forwards"
            }
        );

        animation.onfinish = () => particle.remove();
        animation.oncancel = () => particle.remove();
    }

    function startParticles() {
        if (prefersReducedMotion || particleTimer || document.hidden) return;

        const interval = isMobileViewport() ? 820 : 260;
        particleTimer = window.setInterval(createParticle, interval);
    }

    function stopParticles() {
        if (!particleTimer) return;
        clearInterval(particleTimer);
        particleTimer = null;
    }

    function launchWelcomeEffect() {
        if (prefersReducedMotion) return;

        const amount = isMobileViewport() ? 18 : 46;

        for (let i = 0; i < amount; i++) {
            window.setTimeout(() => {
                createParticle({
                    types: ["dot", "spark", "line", "cap"],
                    y: Math.random() * 96,
                    duration: Math.random() * 2800 + 2600
                });
            }, i * 55);
        }
    }

    startParticles();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopParticles();
            stopCarouselTimer();
        } else {
            startParticles();
            startCarouselTimer();
        }
    });

    /* =====================================================
       CONFETI GALA
    ===================================================== */

    function graduationConfetti(customTotal) {
        if (prefersReducedMotion) return;

        const total = customTotal || (isMobileViewport() ? 60 : 150);
        const colors = ["#30d5c8", "#ffffff", "#c0c0c0", "#f5d483"];

        for (let i = 0; i < total; i++) {
            const confetti = document.createElement("span");
            const isCap = Math.random() > .82;

            confetti.className = isCap ? "confetti confetti--cap" : "confetti";
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 6}px`;
            confetti.style.height = `${Math.random() * 10 + 6}px`;
            confetti.style.animationDelay = `${Math.random() * .35}s`;

            document.body.appendChild(confetti);

            window.setTimeout(() => {
                confetti.remove();
            }, 4600);
        }
    }

    /* =====================================================
       PRELOAD LIGERO DE IMÁGENES
    ===================================================== */

    requestIdle(() => {
        [
            "assets/img/graduacion1.jpg",
            "assets/img/graduacion2.jpg",
            "assets/img/graduacion3.jpg",
            "assets/img/graduacion4.jpg",
            "assets/img/graduacion5.jpg"
        ].forEach(src => {
            const img = new Image();
            img.decoding = "async";
            img.src = src;
        });
    });
});
