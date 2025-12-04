/**
 * Premium Animations
 * Parallax, scroll-triggered animations, floating effects, and micro-interactions
 * Optimized for performance
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        parallaxEnabled: true,
        floatEnabled: true,
        scrollRevealEnabled: true,
        throttleMs: 16, // ~60fps
        mobileBreakpoint: 768
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check if mobile
    const isMobile = () => window.innerWidth <= CONFIG.mobileBreakpoint;

    /**
     * Request Animation Frame wrapper
     */
    function rafCallback(callback) {
        let ticking = false;
        return function(...args) {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    callback.apply(this, args);
                    ticking = false;
                });
                ticking = true;
            }
        };
    }

    /**
     * Parallax Effect for Background Elements
     * Elements move at different speeds based on data-speed attribute
     */
    function initParallax() {
        if (prefersReducedMotion || isMobile() || !CONFIG.parallaxEnabled) return;

        const parallaxElements = document.querySelectorAll('.parallax-element');
        if (parallaxElements.length === 0) return;

        const handleParallax = rafCallback(() => {
            const scrollY = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.1;
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const elementCenter = elementTop + rect.height / 2;
                const viewportCenter = scrollY + window.innerHeight / 2;
                const distance = viewportCenter - elementCenter;
                
                // Only animate if element is reasonably close to viewport
                if (Math.abs(distance) < window.innerHeight * 1.5) {
                    const yOffset = distance * speed;
                    el.style.transform = `translateY(${yOffset}px)`;
                }
            });
        });

        window.addEventListener('scroll', handleParallax, { passive: true });
        handleParallax(); // Initial call
    }

    /**
     * Enhanced Floating Animation with Intersection Observer
     * Only animate elements when they're in view
     */
    function initFloatingAnimations() {
        if (prefersReducedMotion || !CONFIG.floatEnabled) return;

        const floatElements = document.querySelectorAll('.float-element');
        if (floatElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });

        floatElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    /**
     * Scroll-Triggered Reveal Animations
     * Elements fade in as they enter the viewport
     */
    function initScrollReveal() {
        if (!CONFIG.scrollRevealEnabled) return;

        // Auto-add scroll animation classes
        autoAddScrollClasses();

        const revealElements = document.querySelectorAll(
            '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in, ' +
            '.reveal, .reveal-left, .reveal-right, .reveal-scale'
        );
        
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible', 'active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /**
     * Auto-add scroll animation classes to elements
     */
    function autoAddScrollClasses() {
        // Section titles and subtitles
        document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
            if (!el.classList.contains('reveal') && !el.classList.contains('scroll-fade-in')) {
                el.classList.add('reveal');
            }
        });

        // Feature cards with stagger
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            if (!card.classList.contains('reveal')) {
                card.classList.add('reveal');
                card.style.transitionDelay = `${0.1 + index * 0.1}s`;
            }
        });

        // Service cards
        document.querySelectorAll('.service-card-new').forEach((card, index) => {
            if (!card.classList.contains('reveal')) {
                card.classList.add('reveal');
                card.style.transitionDelay = `${0.1 + (index % 2) * 0.15}s`;
            }
        });

        // How cards
        document.querySelectorAll('.how-card').forEach((card, index) => {
            if (!card.classList.contains('reveal')) {
                card.classList.add('reveal');
                card.style.transitionDelay = `${0.1 + index * 0.1}s`;
            }
        });

        // Quote section
        const quoteCard = document.querySelector('.quote-card');
        const quoteGraphic = document.querySelector('.quote-graphic');
        if (quoteCard && !quoteCard.classList.contains('reveal-left')) {
            quoteCard.classList.add('reveal-left');
        }
        if (quoteGraphic && !quoteGraphic.classList.contains('reveal-right')) {
            quoteGraphic.classList.add('reveal-right');
        }
    }

    /**
     * Background Shape Slide on Scroll
     * Subtle movement of background decorative elements
     */
    function initBackgroundSlide() {
        if (prefersReducedMotion || isMobile()) return;

        const bgElements = document.querySelectorAll('.section-decorations, .section-bg-elements');
        if (bgElements.length === 0) return;

        const handleSlide = rafCallback(() => {
            bgElements.forEach(el => {
                const parent = el.closest('section');
                if (!parent) return;

                const rect = parent.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                if (isVisible) {
                    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const offset = (progress - 0.5) * 30; // Max 15px movement
                    
                    // Apply subtle transform to decorations
                    el.style.transform = `translateY(${offset}px)`;
                }
            });
        });

        window.addEventListener('scroll', handleSlide, { passive: true });
    }

    /**
     * Counter Animation for Statistics
     */
    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-counter]');
        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-counter'), 10);
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const currentValue = Math.floor(easeOutQuart * finalValue);
                        
                        target.textContent = currentValue.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            target.textContent = finalValue.toLocaleString();
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    /**
     * Magnetic Button Effect
     */
    function initMagneticButtons() {
        if (prefersReducedMotion || isMobile()) return;

        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translateY(-3px) scale(1.02) translate(${x * 0.08}px, ${y * 0.08}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /**
     * Smooth Section Entrance
     * Trigger animations when sections come into view
     */
    function initSectionEntrance() {
        const sections = document.querySelectorAll('.section, .hero');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    
                    // Trigger child animations
                    const bgElements = entry.target.querySelector('.section-bg-elements, .hero-bg-elements');
                    if (bgElements) {
                        bgElements.classList.add('animate-in');
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    /**
     * Initialize Line Drawing Animation for How We Work section
     */
    function initLineDrawing() {
        const lineDesign = document.querySelector('.how-line-design');
        if (!lineDesign) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lineDesign.classList.add('animate');
                    observer.unobserve(lineDesign);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(lineDesign);
    }

    /**
     * Initialize all animations
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        // Core animations
        initScrollReveal();
        initFloatingAnimations();
        initSectionEntrance();
        
        // Parallax (desktop only)
        if (!isMobile()) {
            initParallax();
            initBackgroundSlide();
            initMagneticButtons();
        }
        
        // Additional effects
        initCounterAnimation();
        initLineDrawing();
        
        console.log('✨ Premium animations initialized');
    }

    // Run initialization
    init();

    // Export for potential external use
    window.PremiumAnimations = {
        init,
        CONFIG
    };

})();
