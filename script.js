function showLoader() {
  document.getElementById('chat-loader').classList.remove('hidden');
}
function hideLoader() {
  document.getElementById('chat-loader').classList.add('hidden');
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('.nav-link-mobile');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact Form Submission with AJAX (Formspree)
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Honeypot anti-spam: if filled, it is a bot
            const gotcha = contactForm.querySelector('input[name="_gotcha"]');
            if (gotcha && gotcha.value.trim() !== "") {
                showToast('Error', 'Spam detected. Submission blocked.');
                return;
            }

            // Gather form data
            const formData = new FormData(contactForm);

            // Basic validation (client-side)
            const fullName = formData.get('fullName');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Prevent obvious abuse (min lengths, max lengths)
            if (!fullName || !email || !subject || !message ||
                fullName.length < 2 || subject.length < 2 || message.length < 5 ||
                fullName.length > 100 || email.length > 100 || subject.length > 150 || message.length > 2000
            ) {
                showToast('Error', 'Please fill in all fields with valid data.');
                return;
            }

            // Email format validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showToast('Error', 'Please enter a valid email address.');
                return;
            }

            // AJAX submit to Formspree
            try {
                showLoader();
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                hideLoader();

                if (response.ok) {
                    showToast('Message Sent!', "Thank you for your message. We'll get back to you soon.");
                    contactForm.reset();
                } else {
                    let errorMsg = "There was a problem sending your message.";
                    const data = await response.json();
                    if (data && data.errors && data.errors.length > 0) {
                        errorMsg = data.errors.map(e => e.message).join(', ');
                    }
                    showToast('Error', errorMsg);
                }
            } catch (err) {
                showToast('Error', 'Network error. Please try again later.');
            }
        });
    }
    
    // Toast notification function
    function showToast(title, description) {
        if (toast) {
            const toastTitle = toast.querySelector('.toast-title');
            const toastDescription = toast.querySelector('.toast-description');
            
            toastTitle.textContent = title;
            toastDescription.textContent = description;
            
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backgroundColor = 'hsla(0, 0%, 100%, 0.98)';
            header.style.boxShadow = '0 2px 10px -2px hsla(215, 25%, 27%, 0.1)';
        } else {
            header.style.backgroundColor = 'hsla(0, 0%, 100%, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Add animation on scroll for service cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards and product cards for animation
    const animatedElements = document.querySelectorAll('.service-card, .product-card, .partner-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.service-card, .product-card, .partner-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Button click effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Lazy loading for images (if any additional images are added)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add active state to navigation links based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

      function setHeaderHeight() {
        const header = document.querySelector('.header');
        if (header) {
        document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
        }
    }
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

});

// Add active navigation link styles
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-link.active,
    .nav-link-mobile.active {
        color: var(--color-primary) !important;
        font-weight: 600;
    }
`;
document.head.appendChild(navStyle);