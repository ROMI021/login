/* ============================================
   SÉLECTION DES ÉLÉMENTS DU DOM
   ============================================ */

const mailInput = document.getElementById('mail');
const passwordInput = document.getElementById('password');
const form = document.querySelector('.form');
const submitBtn = document.querySelector('.submit-btn');
const togglePasswordBtn = document.querySelector('.toggle-password');

/* ============================================
   VARIABLES GLOBALES D'ÉTAT
   ============================================ */

let isFormValid = false;

/* ============================================
   GESTION DE LA VISIBILITÉ DU MOT DE PASSE
   ============================================ */

togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    // Update SVG icon
    if (isPassword) {
        // Show "Hide" icon
        togglePasswordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
    } else {
        // Show "Show" icon
        togglePasswordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
});

/* ============================================
   ÉCOUTEURS D'ÉVÉNEMENTS - VALIDATION EN TEMPS RÉEL
   ============================================ */

mailInput.addEventListener('input', () => validateMail());
passwordInput.addEventListener('input', () => validatePassword());

/* ============================================
   SYSTÈME DE FUITE DU BOUTON
   ============================================ */

document.addEventListener('mousemove', (e) => {
    if (!isFormValid) {
        const rect = submitBtn.getBoundingClientRect();
        const distance = Math.hypot(
            e.clientX - (rect.left + rect.width / 2),
            e.clientY - (rect.top + rect.height / 2)
        );

        if (distance < 150) {
            const angle = Math.atan2(
                rect.top + rect.height / 2 - e.clientY,
                rect.left + rect.width / 2 - e.clientX
            );
            const moveDistance = Math.max(60, 150 - distance);
            const moveX = Math.cos(angle) * moveDistance;
            const moveY = Math.sin(angle) * moveDistance;

            submitBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }
});

submitBtn.addEventListener('mouseenter', (e) => {
    if (!isFormValid) {
        const rect = submitBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(centerY - e.clientY, centerX - e.clientX);
        const distance = 160;
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        submitBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        submitBtn.classList.add('escaping');
        setTimeout(() => submitBtn.classList.remove('escaping'), 300);
    }
});

submitBtn.addEventListener('mouseleave', () => {
    if (!isFormValid) {
        submitBtn.style.transform = 'translate(0, 0)';
    }
});

submitBtn.addEventListener('click', (e) => {
    if (!isFormValid) {
        e.preventDefault();
        submitBtn.classList.add('escaping');
        setTimeout(() => {
            submitBtn.classList.remove('escaping');
            submitBtn.style.transform = 'translate(0, 0)';
        }, 600);
    }
});

/* ============================================
   FONCTIONS DE VALIDATION
   ============================================ */

function validateMail() {
    const value = mailInput.value.trim();
    const feedback = mailInput.closest('.input-group').querySelector('.input-feedback');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
        resetFeedback(mailInput, feedback);
    } else if (!emailRegex.test(value)) {
        setError(mailInput, feedback, 'Email invalide');
    } else {
        setSuccess(mailInput, feedback, 'Email valide');
    }
    checkFormValidity();
}

function validatePassword() {
    const value = passwordInput.value;
    const feedback = passwordInput.closest('.input-group').querySelector('.input-feedback');

    // Pour le login, on vérifie juste que le champ n'est pas vide
    if (value === '') {
        resetFeedback(passwordInput, feedback);
    } else {
        // On ne montre pas "Mot de passe fort" ici, juste que c'est rempli
        // Mais pour garder la cohérence visuelle (bordure verte), on met setSuccess
        // On peut mettre un message vide ou "Saisi"
        setSuccess(passwordInput, feedback, '');
    }
    checkFormValidity();
}

/* ============================================
   FONCTIONS D'AIDE - FEEDBACK
   ============================================ */

function setError(input, feedback, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');

    feedback.textContent = message;
    feedback.classList.add('show', 'error');
    feedback.classList.remove('success');
}

function setSuccess(input, feedback, message) {
    input.classList.add('valid');
    input.classList.remove('invalid');

    feedback.textContent = message;
    if (message) {
        feedback.classList.add('show', 'success');
    } else {
        feedback.classList.remove('show'); // Pas de message si vide
    }
    feedback.classList.remove('error');
}

function resetFeedback(input, feedback) {
    input.classList.remove('valid', 'invalid');
    feedback.textContent = '';
    feedback.classList.remove('show', 'success', 'error');
}

/* ============================================
   VÉRIFICATION DE LA VALIDITÉ DU FORMULAIRE
   ============================================ */

function checkFormValidity() {
    const isMailValid = mailInput.classList.contains('valid');
    const isPasswordValid = passwordInput.classList.contains('valid');

    isFormValid = isMailValid && isPasswordValid;

    if (isFormValid) {
        submitBtn.style.transform = 'translate(0, 0)';
        submitBtn.style.cursor = 'pointer';
        submitBtn.disabled = false;
        submitBtn.style.pointerEvents = 'auto';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
    }
}

/* ============================================
   GESTION DE LA SOUMISSION DU FORMULAIRE
   ============================================ */

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isFormValid) {
        // Animation success
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        btnText.textContent = 'Connexion...';
        submitBtn.style.background = 'var(--success)';

        setTimeout(() => {
            alert('👋 Heureux de vous revoir !');

            form.reset();
            document.querySelectorAll('.input-feedback').forEach(f => {
                f.textContent = '';
                f.classList.remove('show', 'success', 'error');
            });
            document.querySelectorAll('input').forEach(input => {
                input.classList.remove('valid', 'invalid');
            });

            btnText.textContent = originalText;
            submitBtn.style.background = '';

            isFormValid = false;
            checkFormValidity();
        }, 1500);
    }
});
