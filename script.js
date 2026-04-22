// ===== SPOTLIGHT EFFECT =====
const spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--mx', e.clientX + 'px');
    spotlight.style.setProperty('--my', e.clientY + 'px');
});

// ===== SKILL BAR ANIMATION =====
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            skillBarObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-bars').forEach(el => skillBarObserver.observe(el));

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
    updateActiveNav();
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
function updateActiveNav() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (link && scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// ===== MOBILE NAV =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== SCROLL REVEAL =====
const revealOpts = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
            setTimeout(() => {
                el.classList.add('visible');
            }, delay);
            revealObserver.unobserve(el);
        }
    });
}, revealOpts);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== 3D TILT =====
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotY = ((x - cx) / cx) * 10;
        const rotX = -((y - cy) / cy) * 10;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
});

// ===== SCROLL SMOOTH =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== CONTACT FORM =====
const SUPABASE_URL = 'https://okvbnnyneoilqkmntoij.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2wqDyEh34CwD28oQq9V8FQ_y01hKzTk';
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('form-name').value,
            email: document.getElementById('form-email').value,
            message: document.getElementById('form-message').value,
            created_at: new Date().toISOString()
        };

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = '✓ Inquiry sent successfully!';
                contactForm.reset();
            } else {
                throw new Error('Failed');
            }
        } catch {
            formStatus.className = 'form-status error';
            formStatus.textContent = '✕ Something went wrong. Please try again.';
        }

        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
    });
}
