/* =====================================================
   GRADUACIÓN GABINO LUCIANO 2026
   SCRIPT.JS PREMIUM
   Versión Gala Universitaria
===================================================== */

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const WHATSAPP_NUMBER = "5570737497";

const EVENT_DATE =
new Date("2026-08-29T14:45:00");

/* =====================================================
   VARIABLES GLOBALES
===================================================== */

let currentSlide = 0;

let selectedPersonality = "";

let musicPlaying = false;

/* =====================================================
   ELEMENTOS
===================================================== */

const introScreen =
document.getElementById("introScreen");

const openInvitationBtn =
document.getElementById("openInvitationBtn");

const audioBtn =
document.getElementById("audioBtn");

const bgMusic =
document.getElementById("bgMusic");

const slidesContainer =
document.getElementById("slides");

const slides =
document.querySelectorAll(".slide");

const carouselDots =
document.getElementById("carouselDots");

/* =====================================================
   APERTURA DE INVITACIÓN
===================================================== */

function openInvitation() {

    introScreen.style.opacity = "0";

    introScreen.style.transition =
        "all 1s ease";

    setTimeout(() => {

        introScreen.style.display = "none";

    }, 1000);

    startMusic();

    launchWelcomeEffect();

}

if (openInvitationBtn) {

    openInvitationBtn.addEventListener(
        "click",
        openInvitation
    );

}

/* =====================================================
   CONTROL DE MÚSICA
===================================================== */

function startMusic() {

    if (!bgMusic) return;

    bgMusic.play()
        .then(() => {

            musicPlaying = true;

            audioBtn.innerHTML = "♫";

        })
        .catch(() => {

            console.log(
                "Autoplay bloqueado por navegador"
            );

        });

}

function toggleMusic() {

    if (!bgMusic) return;

    if (musicPlaying) {

        bgMusic.pause();

        audioBtn.innerHTML = "♪";

        musicPlaying = false;

    } else {

        bgMusic.play();

        audioBtn.innerHTML = "♫";

        musicPlaying = true;

    }

}

if (audioBtn) {

    audioBtn.addEventListener(
        "click",
        toggleMusic
    );

}

/* =====================================================
   CUENTA REGRESIVA
===================================================== */

function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        EVENT_DATE.getTime() - now;

    if (distance <= 0) {

        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";

        graduationConfetti();

        return;
    }

    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (distance %
                (1000 * 60 * 60 * 24))
            /
            (1000 * 60 * 60)
        );

    const minutes =
        Math.floor(
            (distance %
                (1000 * 60 * 60))
            /
            (1000 * 60)
        );

    const seconds =
        Math.floor(
            (distance %
                (1000 * 60))
            /
            1000
        );

    document.getElementById("days").innerHTML =
        String(days).padStart(2, "0");

    document.getElementById("hours").innerHTML =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").innerHTML =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").innerHTML =
        String(seconds).padStart(2, "0");

}

setInterval(updateCountdown, 1000);

updateCountdown();

/* =====================================================
   CARRUSEL
===================================================== */

function createDots() {

    if (!carouselDots) return;

    slides.forEach((_, index) => {

        const dot =
            document.createElement("div");

        dot.classList.add(
            "carousel-dot"
        );

        if (index === 0) {

            dot.classList.add(
                "active"
            );

        }

        dot.addEventListener(
            "click",
            () => {

                goToSlide(index);

            }
        );

        carouselDots.appendChild(dot);

    });

}

function updateDots() {

    const dots =
        document.querySelectorAll(
            ".carousel-dot"
        );

    dots.forEach(dot => {

        dot.classList.remove(
            "active"
        );

    });

    if (dots[currentSlide]) {

        dots[currentSlide].classList.add(
            "active"
        );

    }

}

function goToSlide(index) {

    currentSlide = index;

    slidesContainer.style.transform =
        `translateX(-${currentSlide * 100}%)`;

    updateDots();

}

function nextSlide() {

    currentSlide++;

    if (
        currentSlide >= slides.length
    ) {

        currentSlide = 0;

    }

    goToSlide(currentSlide);

}

function prevSlide() {

    currentSlide--;

    if (currentSlide < 0) {

        currentSlide =
            slides.length - 1;

    }

    goToSlide(currentSlide);

}

const nextBtn =
document.getElementById("nextSlide");

const prevBtn =
document.getElementById("prevSlide");

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        nextSlide
    );

}

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        prevSlide
    );

}

createDots();

setInterval(nextSlide, 5000);

/* =====================================================
   ENCUESTA ¿CÓMO SOY?
===================================================== */

const surveyCards =
document.querySelectorAll(
    ".survey-card"
);

surveyCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            surveyCards.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });

            card.classList.add(
                "selected"
            );

            selectedPersonality =
                card.dataset.option;

        }
    );

});

/* =====================================================
   CONFIRMACIÓN WHATSAPP
===================================================== */

const rsvpForm =
document.getElementById(
    "rsvpForm"
);

if (rsvpForm) {

    rsvpForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const name =
                document.getElementById(
                    "guestName"
                ).value;

            const attendance =
                document.getElementById(
                    "attendance"
                ).value;

            const message =
                document.getElementById(
                    "message"
                ).value;

            let text =
                "🎓 GRADUACIÓN GABINO LUCIANO 🎓%0A%0A";

            text +=
                "*Nombre:* " +
                encodeURIComponent(name) +
                "%0A";

            text +=
                "*Asistencia:* " +
                encodeURIComponent(attendance) +
                "%0A";

            text +=
                "*¿Cómo soy?:* " +
                encodeURIComponent(
                    selectedPersonality ||
                    "Sin respuesta"
                ) +
                "%0A";

            text +=
                "*Mensaje:* " +
                encodeURIComponent(message);

            window.open(

                `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,

                "_blank"

            );

        }
    );

}

/* =====================================================
   REVEAL ON SCROLL
===================================================== */

const revealElements =
document.querySelectorAll(
    ".glass-card,.notice-card"
);

const revealObserver =
new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (
                entry.isIntersecting
            ) {

                entry.target.classList.add(
                    "active"
                );

            }

        });

    },

    {
        threshold:0.15
    }

);

revealElements.forEach(item => {

    item.classList.add("reveal");

    revealObserver.observe(item);

});

/* =====================================================
   PARTÍCULAS PREMIUM
===================================================== */

function createParticle() {

    const container =
        document.getElementById(
            "particles"
        );

    if (!container) return;

    const particle =
        document.createElement(
            "div"
        );

    const size =
        Math.random() * 5 + 2;

    particle.style.position =
        "absolute";

    particle.style.width =
        size + "px";

    particle.style.height =
        size + "px";

    particle.style.borderRadius =
        "50%";

    particle.style.background =
        Math.random() > 0.5
            ? "#30d5c8"
            : "#c0c0c0";

    particle.style.left =
        Math.random() * 100 +
        "%";

    particle.style.top =
        "110%";

    particle.style.opacity =
        "0.8";

    particle.style.boxShadow =
        "0 0 10px rgba(255,255,255,.5)";

    container.appendChild(
        particle
    );

    const duration =
        Math.random() * 10000 +
        7000;

    particle.animate(

        [

            {
                transform:
                    "translateY(0)"
            },

            {
                transform:
                    "translateY(-120vh)"
            }

        ],

        {

            duration,

            easing:"linear"

        }

    );

    setTimeout(() => {

        particle.remove();

    }, duration);

}

setInterval(
    createParticle,
    250
);

/* =====================================================
   CONFETI
===================================================== */

function graduationConfetti() {

    for (
        let i = 0;
        i < 150;
        i++
    ) {

        const confetti =
            document.createElement(
                "div"
            );

        confetti.classList.add(
            "confetti"
        );

        confetti.style.left =
            Math.random() * 100 +
            "vw";

        confetti.style.background =
            [
                "#30d5c8",
                "#ffffff",
                "#c0c0c0"
            ][
                Math.floor(
                    Math.random() * 3
                )
            ];

        confetti.style.width =
            Math.random() * 10 + 6 +
            "px";

        confetti.style.height =
            Math.random() * 10 + 6 +
            "px";

        document.body.appendChild(
            confetti
        );

        setTimeout(() => {

            confetti.remove();

        }, 4000);

    }

}

/* =====================================================
   EFECTO BIENVENIDA
===================================================== */

function launchWelcomeEffect() {

    for (
        let i = 0;
        i < 40;
        i++
    ) {

        setTimeout(() => {

            createParticle();

        }, i * 100);

    }

}

/* =====================================================
   PRELOAD DE IMÁGENES
===================================================== */

const preloadImages = [

    "assets/img/graduacion1.jpg",
    "assets/img/graduacion2.jpg",
    "assets/img/graduacion3.jpg",
    "assets/img/graduacion4.jpg",
    "assets/img/graduacion5.jpg"

];

preloadImages.forEach(src => {

    const img =
        new Image();

    img.src = src;

});

/* =====================================================
   FIN SCRIPT.JS
===================================================== */