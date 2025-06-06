// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTooltips();
    initializeAnimations();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeReturnToTop();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                const offsetTop = targetSection.offsetTop - 80; // Account for sticky nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
}

// Tooltip functionality for family members
function initializeTooltips() {
    const siblingCards = document.querySelectorAll('.sibling-card[data-info]');
    const tooltip = document.getElementById('tooltip');
    
    if (!tooltip) return;
    
    siblingCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const info = this.getAttribute('data-info');
            tooltip.textContent = info;
            tooltip.classList.add('show');
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            let top = rect.top - tooltipRect.height - 10;
            
            // Ensure tooltip stays within viewport
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            if (top < 10) top = rect.bottom + 10;
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });
        
        card.addEventListener('mouseleave', function() {
            tooltip.classList.remove('show');
        });
        
        // Touch support for mobile
        card.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const info = this.getAttribute('data-info');
            
            // Create temporary modal for mobile info display
            showMobileInfo(info, this.querySelector('h5').textContent);
        });
    });
}

// Mobile info modal
function showMobileInfo(info, name) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.mobile-info-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'mobile-info-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h4>${name}</h4>
            <p>${info}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for modal
    const style = document.createElement('style');
    style.textContent = `
        .mobile-info-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        .modal-content {
            background: var(--paper-color);
            padding: 2rem;
            border-radius: 8px;
            max-width: 90%;
            max-height: 80%;
            overflow-y: auto;
            position: relative;
            border: 2px solid var(--accent-color);
        }
        .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 2rem;
            cursor: pointer;
            color: var(--secondary-color);
        }
        .modal-content h4 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-family: 'Playfair Display', serif;
        }
    `;
    document.head.appendChild(style);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

// Scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('siblings-grid') || 
                    entry.target.classList.contains('content-grid')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `slideInUp 0.6s ease-out forwards`;
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections and grid containers
    const elementsToObserve = document.querySelectorAll(
        '.newspaper-section, .hero-section, .siblings-grid, .content-grid, .novels-section'
    );
    
    elementsToObserve.forEach(el => observer.observe(el));
}

// Scroll effects for navigation
function initializeScrollEffects() {
    const nav = document.querySelector('.vintage-nav');
    const sections = document.querySelectorAll('.newspaper-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        // Navbar scroll effect
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger lines into perfect symmetrical X
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            // Top line: rotate to form top-right diagonal of X, move to center
            spans[0].style.transform = 'rotate(90deg) translate(6px, 6px)';
            // Middle line: fade out completely
            spans[1].style.opacity = '0';
            spans[1].style.transform = 'scale(0)';
            // Bottom line: rotate to form bottom-right diagonal of X, move to center
            spans[2].style.transform = 'rotate(90deg) translate(-6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[1].style.transform = 'none';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (hamburger.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
    
    // Close mobile menu when clicking anywhere on the page content
    document.addEventListener('click', (e) => {
        if (hamburger.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when scrolling
    window.addEventListener('scroll', () => {
        if (hamburger.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking on main content areas
    const mainContent = document.querySelector('.newspaper-content');
    const header = document.querySelector('.newspaper-header');
    
    if (mainContent) {
        mainContent.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    if (header) {
        header.addEventListener('click', (e) => {
            if (hamburger.classList.contains('active') && !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // First remove the active class from menu items to trigger reverse animation
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transitionDelay = '0s';
                item.style.transform = 'translateY(30px)';
                item.style.opacity = '0';
            }, index * 50);
        });
        
        // Then close the menu after items have animated out
        setTimeout(() => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[1].style.transform = 'none';
            spans[2].style.transform = 'none';
            
            // Reset menu items for next opening
            setTimeout(() => {
                menuItems.forEach(item => {
                    item.style.transitionDelay = '';
                    item.style.transform = '';
                    item.style.opacity = '';
                });
            }, 100);
        }, 200);
    }
}

// Simple and reliable parallax effect for hero section
function initializeParallax() {
    const hero = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.rizal-portrait');
    
    if (!hero) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3; // Negative for upward movement
        
        // Simple background parallax
        hero.style.backgroundPositionY = rate + 'px';
        
        // Image parallax disabled to prevent upward movement
        // if (heroImage) {
        //     const imageRate = scrolled * -0.15;
        //     heroImage.style.transform = `translateY(${imageRate}px)`;
        // }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Portrait parallax effect - image breaks out of frame on scroll
function initializePortraitParallax() {
    const portrait = document.querySelector('.rizal-portrait');
    const portraitClip = document.querySelector('.portrait-clip');
    const portraitFrame = document.querySelector('.portrait-frame');
    
    if (!portrait || !portraitClip || !portraitFrame) return;
    
    let ticking = false;
    
    function updatePortraitParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (!heroSection) {
            ticking = false;
            return;
        }
        
        // Get hero section position
        const heroRect = heroSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress when hero is in view
        let scrollProgress = 0;
        
        if (heroRect.top <= viewportHeight && heroRect.bottom >= 0) {
            // Hero is in view
            scrollProgress = Math.max(0, (viewportHeight - heroRect.top) / (viewportHeight + heroRect.height));
        } else if (heroRect.bottom < 0) {
            // Hero has passed
            scrollProgress = 1;
        }
        
        // Only start the effect after significant scrolling
        const startThreshold = 0.4; // Start effect when 40% through hero section
        const breakoutThreshold = 0.7; // Start breaking out of frame at 70%
        
        if (scrollProgress < startThreshold) {
            // Keep image in original position when scroll progress is low
            portrait.style.transform = 'scale(1.2)';
            portraitClip.style.overflow = 'hidden';
            portrait.style.zIndex = '';
            portrait.style.filter = '';
        } else {
            // Calculate adjusted progress for the effect
            const effectProgress = Math.min(1, (scrollProgress - startThreshold) / (1 - startThreshold));
            
            // Apply transform based on adjusted progress
            const maxTranslateY = 80; // Reduced movement
            const maxTranslateX = 40; // Reduced movement
            const maxScale = 0.3; // Reduced scale increase
            
            // Disable all transform effects to prevent upward movement
            // const translateY = -effectProgress * maxTranslateY;
            // const translateX = effectProgress * maxTranslateX;
            // const scale = 1.2 + (effectProgress * maxScale);
            // const rotation = effectProgress * 8; // Reduced rotation
            
            // Keep the original scale without movement
            portrait.style.transform = 'scale(1.2)';
            
            // Only allow breaking out after breakout threshold
            if (scrollProgress > breakoutThreshold) {
                const clipProgress = Math.min(1, (scrollProgress - breakoutThreshold) / (1 - breakoutThreshold));
                portraitClip.style.overflow = 'visible';
                portrait.style.zIndex = '10';
                
                // Add shadow when breaking out
                const shadowIntensity = clipProgress * 15;
                portrait.style.filter = `drop-shadow(0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0,0,0,0.2))`;
            } else {
                portraitClip.style.overflow = 'hidden';
                portrait.style.zIndex = '';
                portrait.style.filter = '';
            }
        }
        
        ticking = false;
    }
    
    function requestPortraitTick() {
        if (!ticking) {
            requestAnimationFrame(updatePortraitParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestPortraitTick);
}

// Typing effect for hero quote
function initializeTypingEffect() {
    const quote = document.querySelector('.hero-quote blockquote');
    
    if (!quote) return;
    
    const text = quote.textContent;
    quote.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            quote.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after page load
    setTimeout(typeWriter, 2000);
}

// Enhanced grid hover effects
function initializeGridEffects() {
    const gridItems = document.querySelectorAll('.grid-item, .sibling-card, .novel-card');
    
    gridItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 12px 24px rgba(44, 24, 16, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// Initialize reading progress indicator
function initializeReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(212, 175, 55, 0.2);
            z-index: 1001;
        }
        .progress-fill {
            height: 100%;
            background: var(--accent-color);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = scrollPercent + '%';
    });
}

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        imageObserver.observe(img);
    });
}

// Easter egg - Konami code
function initializeEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
            // Show special Rizal animation
            showRizalAnimation();
            userInput = [];
        }
    });
}

function showRizalAnimation() {
    const animation = document.createElement('div');
    animation.innerHTML = '🇵🇭 ¡Viva Rizal! 🇵🇭';
    animation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: var(--accent-color);
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        z-index: 9999;
        animation: bounce 2s ease-in-out;
        pointer-events: none;
    `;
    
    const keyframes = `
        @keyframes bounce {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.5); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
        animation.remove();
        style.remove();
    }, 2000);
}

// Fade up animation on scroll
function initializeFadeUpAnimation() {
    // Create fade-up styles
    const style = document.createElement('style');
    style.textContent = `
        .fade-up-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
        
        .fade-up-element.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .fade-up-delayed {
            transition-delay: 0.2s;
        }
        
        .fade-up-delayed-2 {
            transition-delay: 0.4s;
        }
        
        .fade-up-delayed-3 {
            transition-delay: 0.6s;
        }
    `;
    document.head.appendChild(style);
    
    // Add fade-up class to elements
    const elementsToAnimate = document.querySelectorAll(`
        .newspaper-section,
        .grid-item,
        .sibling-card,
        .novel-card,
        .pyramid-level,
        .political-level,
        .timeline-item,
        .childhood-item,
        .love-item,
        .study-period,
        .travel-card,
        .woman-card,
        .parent-card,
        .education-item,
        .final-period,
        .oversight-item,
        .defect-item
    `);
    
    elementsToAnimate.forEach((element, index) => {
        element.classList.add('fade-up-element');
        
        // Add staggered delays for elements in the same container
        const container = element.parentElement;
        const siblingsWithSameClass = Array.from(container.children).filter(child => 
            child.classList.contains(element.classList[0])
        );
        const indexInContainer = siblingsWithSameClass.indexOf(element);
        
        if (indexInContainer === 1) element.classList.add('fade-up-delayed');
        if (indexInContainer === 2) element.classList.add('fade-up-delayed-2');
        if (indexInContainer >= 3) element.classList.add('fade-up-delayed-3');
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.07,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initializeParallax();
    initializeTypingEffect();
    initializeGridEffects();
    initializeReadingProgress();
    initializeLazyLoading();
    initializeEasterEgg();
    initializeFadeUpAnimation();
});

// Accessibility improvements
function initializeAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: var(--accent-color);
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const mainContent = document.querySelector('.newspaper-content');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('tabindex', '-1');
    }
    
    // Keyboard navigation for sibling cards
    const siblingCards = document.querySelectorAll('.sibling-card');
    siblingCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('h5').textContent}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const info = card.getAttribute('data-info');
                if (info) {
                    showMobileInfo(info, card.querySelector('h5').textContent);
                }
            }
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Return to Top functionality
function initializeReturnToTop() {
    const returnToTopBtn = document.getElementById('returnToTop');
    const heroSection = document.querySelector('.hero-section');
    
    console.log('Return to top button:', returnToTopBtn);
    console.log('Hero section:', heroSection);
    
    if (!returnToTopBtn || !heroSection) {
        console.log('Missing elements - button or hero section not found');
        return;
    }
    
    let heroBottomOffset = 0;
    
    // Calculate hero section bottom position
    function updateHeroOffset() {
        const heroRect = heroSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        heroBottomOffset = heroRect.bottom + scrollTop;
    }
    
    // Initial calculation
    updateHeroOffset();
    
    // Recalculate on resize
    window.addEventListener('resize', updateHeroOffset);
    
    // Show/hide button based on scroll position
    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        console.log('Current scroll:', currentScroll, 'Hero bottom offset:', heroBottomOffset);
        
        if (currentScroll > heroBottomOffset) {
            console.log('Adding visible class');
            returnToTopBtn.classList.add('visible');
        } else {
            console.log('Removing visible class');
            returnToTopBtn.classList.remove('visible');
            returnToTopBtn.classList.remove('closing'); // Reset closing state
        }
    }
    
    // Click handler for return to top
    function handleClick() {
        // Add closing animation
        returnToTopBtn.classList.add('closing');
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Remove closing animation after scroll completes
        setTimeout(() => {
            returnToTopBtn.classList.remove('closing');
        }, 800); // Shorter duration for the spin animation
    }
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    returnToTopBtn.addEventListener('click', handleClick);
    
    // Initial check
    handleScroll();
}