/**
 * BYTESCRIPT — CONTROLADOR PRINCIPAL JAVASCRIPT
 * Lógica modular vanilla, accesibilidad, interacciones y WhatsApp Integration.
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initScrollEffects();
    initScrollReveal();
    initContactForm();
});

/* ==========================================================================
   1. MODO OSCURO / MODO CLARO (LocalStorage)
   ========================================================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Recuperar preferencia guardada o usar preferencia del sistema
    const savedTheme = localStorage.getItem('bytescript-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (!systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'light');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('bytescript-theme', newTheme);
        showToast(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
    });
}

/* ==========================================================================
   2. MENÚ HAMBURGUESA RESPONSIVE Y NAVEGACIÓN
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

/* ==========================================================================
   3. EFECTOS DE SCROLL (Navbar shadow, Scroll progress, Back to top)
   ========================================================================== */
function initScrollEffects() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // Barra de progreso superior
        if (scrollProgress) {
            scrollProgress.style.width = `${scrolled}%`;
        }

        // Estilo Navbar al hacer scroll
        if (winScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Mostrar/Ocultar botón Volver Arriba
        if (winScroll > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================================================
   4. ANIMACIONES AL HACER SCROLL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const elementsToReveal = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); // Animación se ejecuta solo una vez
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. VALIDACIÓN DE FORMULARIO E INTEGRACIÓN CON WHATSAPP
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar errores previos
        clearErrors();

        // Obtener valores de campos
        const nombre = document.getElementById('nombre').value.trim();
        const empresa = document.getElementById('empresa').value.trim() || 'No especificada';
        const email = document.getElementById('email').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const tipoProyecto = document.getElementById('tipo_proyecto').value;
        const presupuesto = document.getElementById('presupuesto').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        let isValid = true;

        // Validaciones
        if (!nombre) {
            showFieldError('nombre', 'error-nombre');
            isValid = false;
        }

        if (!email || !validateEmail(email)) {
            showFieldError('email', 'error-email');
            isValid = false;
        }

        if (!whatsapp) {
            showFieldError('whatsapp', 'error-whatsapp');
            isValid = false;
        }

        if (!tipoProyecto) {
            showFieldError('tipo_proyecto', 'error-tipo_proyecto');
            isValid = false;
        }

        if (!mensaje) {
            showFieldError('mensaje', 'error-mensaje');
            isValid = false;
        }

        if (isValid) {
            // Construir mensaje codificado para WhatsApp
            const textMsg = `Hola ByteScript, quiero solicitar una cotización.
            
*Nombre:* ${nombre}
*Empresa:* ${empresa}
*Email:* ${email}
*WhatsApp:* ${whatsapp}
*Tipo de proyecto:* ${tipoProyecto}
*Presupuesto:* ${presupuesto}
*Mensaje:* ${mensaje}`;

            const encodedMsg = encodeURIComponent(textMsg.replace(/^ +/gm, ''));
            const whatsappUrl = `https://wa.me/50242023344?text=${encodedMsg}`;

            showToast('Redirigiendo a WhatsApp...');
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                form.reset();
            }, 1000);
        }
    });
}

function showFieldError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);

    if (input) input.classList.add('invalid');
    if (errorSpan) errorSpan.classList.add('visible');
}

function clearErrors() {
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ==========================================================================
   6. SISTEMA DE NOTIFICACIONES TOAST
   ========================================================================== */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}