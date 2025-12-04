/**
 * Premium Animations
 * Scroll reveal, icon hover effects, and micro-interactions
 */

(function() {
    'use strict';

    /**
     * Scroll Reveal Animation
     * Reveals elements with fade-in effect as they enter viewport
     */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optionally unobserve after revealing
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /**
     * Auto-add reveal classes to sections
     * Automatically applies scroll reveal to key sections
     */
    function autoAddRevealClasses() {
        // Add reveal to section titles and subtitles
        const titles = document.querySelectorAll('.section-title, .section-subtitle');
        titles.forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });

        // Add reveal to feature cards with stagger
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.classList.add('reveal');
            card.style.transitionDelay = `${0.1 + index * 0.1}s`;
        });

        // Add reveal to service cards
        const serviceCards = document.querySelectorAll('.service-card-new');
        serviceCards.forEach((card, index) => {
            card.classList.add('reveal');
            card.style.transitionDelay = `${0.1 + (index % 2) * 0.15}s`;
        });

        // Add reveal to how cards
        const howCards = document.querySelectorAll('.how-card');
        howCards.forEach((card, index) => {
            card.classList.add('reveal');
            card.style.transitionDelay = `${0.1 + index * 0.1}s`;
        });

        // Add reveal to quote section elements
        const quoteCard = document.querySelector('.quote-card');
        const quoteGraphic = document.querySelector('.quote-graphic');
        if (quoteCard) quoteCard.classList.add('reveal-left');
        if (quoteGraphic) quoteGraphic.classList.add('reveal-right');
    }

    /**
     * Parallax effect for decorative elements
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.floating-circle, .animated-blob');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    
                    parallaxElements.forEach((el, index) => {
                        const speed = 0.05 + (index * 0.02);
                        const yPos = scrollY * speed;
                        el.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    /**
     * Counter animation for statistics
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
                        
                        // Easing function for smooth animation
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
     * Smooth hover effects for interactive elements
     */
    function initHoverEffects() {
        // Add magnetic effect to buttons
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translateY(-3px) scale(1.02) translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /**
     * Typing effect for hero text (optional)
     */
    function initTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(el => {
            const text = el.getAttribute('data-typing');
            const speed = parseInt(el.getAttribute('data-typing-speed') || 100, 10);
            
            el.textContent = '';
            let i = 0;

            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }

            // Start typing when element is visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.unobserve(el);
                }
            });

            observer.observe(el);
        });
    }

    /**
     * Initialize all animations
     */
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        autoAddRevealClasses();
        initScrollReveal();
        initCounterAnimation();
        // initHoverEffects(); // Uncomment for magnetic button effect
        // initParallax(); // Uncomment for parallax effect
    }

    // Run initialization
    init();

})();
