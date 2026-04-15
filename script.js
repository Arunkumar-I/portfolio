// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typedText = document.getElementById('typed-text');
const particlesContainer = document.getElementById('particles');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// ===== NAVBAR SCROLL =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ===== MOBILE NAV TOGGLE =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (link) {
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== TYPING EFFECT =====
const roles = [
    'Digital Marketing Executive',
    'Social Media Manager',
    'Graphic Designer',
    'Content Creator',
    'Ad Campaign Specialist'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typedText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typedText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeEffect, typeSpeed);
}

typeEffect();

// ===== PARTICLES =====
function createParticles() {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                num.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                num.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            
            // Skill cards
            if (el.classList.contains('skill-card')) {
                const delay = parseInt(el.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    el.classList.add('visible');
                    const progress = el.querySelector('.skill-progress');
                    if (progress) {
                        const width = progress.getAttribute('data-width');
                        setTimeout(() => {
                            progress.style.width = width + '%';
                        }, 300);
                    }
                }, delay);
            }
            
            // Education cards
            if (el.classList.contains('edu-card')) {
                const delay = parseInt(el.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
            }
            
            // Timeline items
            if (el.classList.contains('timeline-item')) {
                el.classList.add('visible');
            }
            
            // Internship card
            if (el.classList.contains('internship-card')) {
                el.classList.add('visible');
            }
            
            // Stats counter
            if (el.classList.contains('hero-stats')) {
                animateCounters();
            }
            
            // Gallery items
            if (el.classList.contains('gallery-item')) {
                const delay = parseInt(el.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
            }
            
            observer.unobserve(el);
        }
    });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.skill-card, .edu-card, .timeline-item, .internship-card, .hero-stats, .gallery-item').forEach(el => {
    observer.observe(el);
});

// ===== SWIPER GALLERY =====
const swiper = new Swiper('.gallerySwiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    speed: 800,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 250,
        modifier: 1,
        slideShadows: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCurrent = document.getElementById('lightbox-current');
const lightboxTotal = document.getElementById('lightbox-total');

// Collect ALL gallery items
const allGalleryItems = document.querySelectorAll('.swiper-slide.gallery-item');
let currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxContent() {
    const item = allGalleryItems[currentLightboxIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxDesc.textContent = '';
    lightboxCurrent.textContent = currentLightboxIndex + 1;
    lightboxTotal.textContent = allGalleryItems.length;
}

function nextLightboxItem() {
    currentLightboxIndex = (currentLightboxIndex + 1) % allGalleryItems.length;
    updateLightboxContent();
}

function prevLightboxItem() {
    currentLightboxIndex = (currentLightboxIndex - 1 + allGalleryItems.length) % allGalleryItems.length;
    updateLightboxContent();
}

// Gallery card click handlers - attach to all items
allGalleryItems.forEach((item, index) => {
    const card = item.querySelector('.gallery-card');
    card.addEventListener('click', () => {
        openLightbox(index);
    });
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextLightboxItem);
lightboxPrev.addEventListener('click', prevLightboxItem);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightboxItem();
            if (e.key === 'ArrowLeft') prevLightboxItem();
        }
    });
});

// ===== SUPABASE CONTACT FORM =====
// Supabase configuration — replace with your actual credentials
const SUPABASE_URL = 'https://okvbnnyneoilqkmntoij.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2wqDyEh34CwD28oQq9V8FQ_y01hKzTk';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    const formData = {
        name: document.getElementById('form-name').value,
        email: document.getElementById('form-email').value,
        subject: document.getElementById('form-subject').value,
        message: document.getElementById('form-message').value,
        created_at: new Date().toISOString()
    };
    
    try {
        // Check if Supabase is configured
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
            // Demo mode — show success without actually sending
            await new Promise(resolve => setTimeout(resolve, 1000));
            showFormStatus('success', 'Message sent successfully! I will get back to you soon.');
            contactForm.reset();
        } else {
            // Send to Supabase
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
                showFormStatus('success', 'Message sent successfully! I will get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showFormStatus('error', 'Oops! Something went wrong. Please try again or contact me directly.');
    }
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

function showFormStatus(type, message) {
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
