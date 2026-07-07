/* =====================================================
   GRADUACIÓN GABINO LUCIANO 2026
   SCRIPT.JS - FASE 2 AUDITADO
   Correcciones:
   - Evita errores de consola por elementos nulos.
   - Corrige enlace de WhatsApp con encodeURIComponent completo.
   - Evita confeti infinito al terminar la cuenta regresiva.
   - Mejora compatibilidad móvil con swipe en carrusel.
   - Respeta prefers-reduced-motion.
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

function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
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

    const slidesContainer = $("#slides");
    const slides = $$(".slide");
    const carouselDots = $("#carouselDots");
    const nextBtn = $("#nextSlide");
    const prevBtn = $("#prevSlide");

    const surveyCards = $$(".survey-card");
    const rsvpForm = $("#rsvpForm");
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

    function openInvitation() {
        if (introScreen) {
            introScreen.classList.add("intro-screen--hidden");

            setTimeout(() => {
                introScreen.setAttribute("hidden", "");
            }, 1000);
        }

        startMusic();
        launchWelcomeEffect();
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
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
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
        if (slides.length <= 1 || prefersReducedMotion) return;
        carouselTimer = window.setInterval(nextSlide, 5000);
    }

    function restartCarouselTimer() {
        if (carouselTimer) {
            clearInterval(carouselTimer);
            carouselTimer = null;
        }

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
       CONFIRMACIÓN WHATSAPP
    ===================================================== */

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", event => {
            event.preventDefault();

            const nameInput = $("#guestName");
            const attendanceInput = $("#attendance");
            const songInput = $("#songSuggestion");
            const messageInput = $("#message");

            const name = nameInput ? nameInput.value.trim() : "";
            const attendance = attendanceInput ? attendanceInput.value.trim() : "";
            const songSuggestion = songInput ? songInput.value.trim() : "";
            const message = messageInput ? messageInput.value.trim() : "";

            if (!name || !attendance) {
                alert("Por favor completa tu nombre y confirma tu asistencia.");
                return;
            }

            const whatsappText = [
                "🎓 GRADUACIÓN GABINO LUCIANO 🎓",
                "",
                `Nombre: ${name}`,
                `Asistencia: ${attendance}`,
                `Canción que no debe faltar: ${songSuggestion || "Sin sugerencia"}`,
                `¿Cómo soy?: ${selectedPersonality || "Sin respuesta"}`,
                `Mensaje: ${message || "Sin mensaje"}`
            ].join("\n");

            const url =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

            window.open(url, "_blank", "noopener,noreferrer");
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
            { threshold: 0.15 }
        );

        revealElements.forEach(item => {
            item.classList.add("reveal");
            revealObserver.observe(item);
        });
    } else {
        revealElements.forEach(item => item.classList.add("active"));
    }

    /* =====================================================
       PARTÍCULAS
    ===================================================== */

    function createParticle() {
        if (prefersReducedMotion) return;

        const container = $("#particles");
        if (!container) return;

        const particle = document.createElement("div");
        const size = Math.random() * 5 + 2;

        particle.className = "particle";
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.background = Math.random() > 0.5 ? "#30d5c8" : "#c0c0c0";

        container.appendChild(particle);

        const duration = Math.random() * 10000 + 7000;

        particle.animate(
            [
                { transform: "translateY(0)", opacity: 0.8 },
                { transform: "translateY(-120vh)", opacity: 0 }
            ],
            {
                duration,
                easing: "linear"
            }
        );

        window.setTimeout(() => {
            particle.remove();
        }, duration);
    }

    function startParticles() {
        if (prefersReducedMotion) return;

        const interval = isMobileViewport() ? 900 : 350;
        particleTimer = window.setInterval(createParticle, interval);
    }

    function launchWelcomeEffect() {
        if (prefersReducedMotion) return;

        const amount = isMobileViewport() ? 16 : 40;

        for (let i = 0; i < amount; i++) {
            window.setTimeout(createParticle, i * 100);
        }
    }

    startParticles();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (particleTimer) {
                clearInterval(particleTimer);
                particleTimer = null;
            }

            if (carouselTimer) {
                clearInterval(carouselTimer);
                carouselTimer = null;
            }
        } else {
            startParticles();
            startCarouselTimer();
        }
    });

    /* =====================================================
       CONFETI
    ===================================================== */

    function graduationConfetti() {
        if (prefersReducedMotion) return;

        const total = isMobileViewport() ? 60 : 150;

        for (let i = 0; i < total; i++) {
            const confetti = document.createElement("div");

            confetti.className = "confetti";
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.background = ["#30d5c8", "#ffffff", "#c0c0c0"][
                Math.floor(Math.random() * 3)
            ];
            confetti.style.width = `${Math.random() * 10 + 6}px`;
            confetti.style.height = `${Math.random() * 10 + 6}px`;

            document.body.appendChild(confetti);

            window.setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }

    /* =====================================================
       PRELOAD DE IMÁGENES
    ===================================================== */

    [
        "assets/img/graduacion1.jpg",
        "assets/img/graduacion2.jpg",
        "assets/img/graduacion3.jpg",
        "assets/img/graduacion4.jpg",
        "assets/img/graduacion5.jpg"
    ].forEach(src => {
        const img = new Image();
        img.src = src;
    });
});
