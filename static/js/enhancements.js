// ===== FRESHMART UI ENHANCEMENTS JAVASCRIPT =====

class FreshMartEnhancements {
    constructor() {
        this.initializeEnhancements();
    }

    initializeEnhancements() {
        this.setupEnhancedAddToCart();
        this.setupSkeletonLoading();
        this.setupEnhancedToasts();
        this.setupScrollAnimations();
        this.setupTouchGestures();
        this.setupLazyLoading();
        this.setupEnhancedNavigation();
    }

    // ===== ENHANCED NAVIGATION =====
    setupEnhancedNavigation() {
        this.setupActiveNavigation();
        this.setupDropdownInteractions();
        this.setupNavAnimations();
        this.setupMobileNavigation();
    }

    setupActiveNavigation() {
        // Highlight current page in navigation
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link-enhanced, .dropdown-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath === href) {
                link.classList.add('active');
                
                // If it's a dropdown link, also highlight the main dropdown
                if (link.classList.contains('dropdown-link')) {
                    const dropdownTrigger = link.closest('.nav-dropdown')?.querySelector('.dropdown-trigger');
                    if (dropdownTrigger) {
                        dropdownTrigger.classList.add('active');
                    }
                }
            }
        });
    }

    setupDropdownInteractions() {
        const dropdown = document.querySelector('.nav-dropdown');
        const trigger = dropdown?.querySelector('.dropdown-trigger');
        const panel = dropdown?.querySelector('.dropdown-panel');
        
        if (!dropdown || !trigger || !panel) return;

        let hoverTimeout;
        let isHovering = false;

        // Mouse enter events
        const handleMouseEnter = () => {
            clearTimeout(hoverTimeout);
            isHovering = true;
            trigger.setAttribute('aria-expanded', 'true');
            this.showDropdown(panel);
        };

        // Mouse leave events
        const handleMouseLeave = () => {
            isHovering = false;
            hoverTimeout = setTimeout(() => {
                if (!isHovering) {
                    trigger.setAttribute('aria-expanded', 'false');
                    this.hideDropdown(panel);
                }
            }, 300); // Delay to allow moving to dropdown
        };

        // Add event listeners
        dropdown.addEventListener('mouseenter', handleMouseEnter);
        dropdown.addEventListener('mouseleave', handleMouseLeave);
        
        // Keyboard navigation
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    this.hideDropdown(panel);
                    trigger.setAttribute('aria-expanded', 'false');
                } else {
                    this.showDropdown(panel);
                    trigger.setAttribute('aria-expanded', 'true');
                }
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                this.hideDropdown(panel);
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    showDropdown(panel) {
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
        panel.style.transform = 'translateX(-50%) translateY(0)';
        
        // Animate dropdown items
        const items = panel.querySelectorAll('.dropdown-link');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    hideDropdown(panel) {
        panel.style.opacity = '0';
        panel.style.visibility = 'hidden';
        panel.style.transform = 'translateX(-50%) translateY(-10px)';
        
        // Reset dropdown items
        const items = panel.querySelectorAll('.dropdown-link');
        items.forEach(item => {
            item.style.opacity = '0.7';
            item.style.transform = 'translateY(-5px)';
        });
    }

    setupNavAnimations() {
        const navLinks = document.querySelectorAll('.nav-link-enhanced');
        
        navLinks.forEach((link, index) => {
            // Stagger animation on page load
            link.style.opacity = '0';
            link.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 100);
            
            // Enhanced hover effects
            link.addEventListener('mouseenter', () => {
                if (!link.classList.contains('dropdown-trigger')) {
                    this.addNavHoverEffect(link);
                }
            });
            
            link.addEventListener('mouseleave', () => {
                this.removeNavHoverEffect(link);
            });
        });
    }

    addNavHoverEffect(link) {
        const icon = link.querySelector('.nav-icon');
        if (icon) {
            icon.style.animation = 'navIconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }
    }

    removeNavHoverEffect(link) {
        const icon = link.querySelector('.nav-icon');
        if (icon) {
            icon.style.animation = '';
        }
    }

    setupMobileNavigation() {
        // Mobile dropdown behavior
        if (window.innerWidth <= 768) {
            const dropdownTrigger = document.querySelector('.dropdown-trigger');
            if (dropdownTrigger) {
                dropdownTrigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const panel = document.querySelector('.dropdown-panel');
                    const isVisible = panel.style.opacity === '1';
                    
                    if (isVisible) {
                        this.hideDropdown(panel);
                    } else {
                        this.showDropdown(panel);
                    }
                });
            }
        }
        
        // Responsive navigation adjustments
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Reset mobile-specific styles
                const panel = document.querySelector('.dropdown-panel');
                if (panel) {
                    panel.style.opacity = '';
                    panel.style.visibility = '';
                    panel.style.transform = '';
                }
            }
        });
    }

    // ===== ENHANCED ADD TO CART ANIMATION =====
    setupEnhancedAddToCart() {
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('add-to-cart-form')) {
                e.preventDefault();
                this.handleEnhancedAddToCart(e.target);
            }
        });
    }

    async handleEnhancedAddToCart(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const productCard = form.closest('.product-card, .product-card-enhanced');
        const cartIcon = document.querySelector('.cart-link');

        // Show loading state
        this.showButtonLoading(submitBtn);

        try {
            // Submit form
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Success animation sequence
                await this.playAddToCartAnimation(productCard, cartIcon);
                this.showEnhancedToast('تم إضافة المنتج إلى العربة بنجاح! 🛒', 'success');
                this.updateCartCount();
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            this.showEnhancedToast('حدث خطأ في إضافة المنتج', 'error');
        } finally {
            this.hideButtonLoading(submitBtn);
        }
    }

    async playAddToCartAnimation(productCard, cartIcon) {
        return new Promise((resolve) => {
            // 1. Product card bounce
            productCard.classList.add('cart-success-animation');
            
            // 2. Create flying item
            const flyingItem = this.createFlyingItem(productCard, cartIcon);
            
            // 3. Cart icon bounce after flying animation
            setTimeout(() => {
                cartIcon.style.animation = 'addToCartSuccess 0.6s ease';
                
                // Cleanup
                setTimeout(() => {
                    productCard.classList.remove('cart-success-animation');
                    cartIcon.style.animation = '';
                    if (flyingItem.parentNode) {
                        flyingItem.parentNode.removeChild(flyingItem);
                    }
                    resolve();
                }, 600);
            }, 800);
        });
    }

    createFlyingItem(sourceElement, targetElement) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        const flyingItem = document.createElement('div');
        flyingItem.className = 'cart-item-fly';
        flyingItem.textContent = '📦';
        
        // Position at source
        flyingItem.style.cssText = `
            position: fixed;
            left: ${sourceRect.left + sourceRect.width / 2}px;
            top: ${sourceRect.top + sourceRect.height / 2}px;
            font-size: 2rem;
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(flyingItem);
        
        // Calculate trajectory
        const deltaX = targetRect.left - sourceRect.left;
        const deltaY = targetRect.top - sourceRect.top;
        
        // Animate to cart
        requestAnimationFrame(() => {
            flyingItem.style.setProperty('--cart-x', `${deltaX}px`);
            flyingItem.style.setProperty('--cart-y', `${deltaY}px`);
            flyingItem.classList.add('flying');
        });
        
        return flyingItem;
    }

    // ===== SKELETON LOADING STATES =====
    setupSkeletonLoading() {
        this.createSkeletonObserver();
    }

    createSkeletonObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadContent(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-lazy-load]').forEach(el => {
            observer.observe(el);
        });
    }

    loadContent(element) {
        const skeletons = element.querySelectorAll('.skeleton');
        
        // Simulate loading delay
        setTimeout(() => {
            skeletons.forEach(skeleton => {
                skeleton.classList.remove('skeleton');
                
                // Add content based on type
                if (skeleton.classList.contains('skeleton-text')) {
                    skeleton.textContent = this.generatePlaceholderText();
                } else if (skeleton.classList.contains('skeleton-card')) {
                    skeleton.style.background = 'white';
                }
            });
        }, Math.random() * 1000 + 500);
    }

    generatePlaceholderText() {
        const texts = [
            'منتج طازج وعالي الجودة',
            'خضروات وفواكه طبيعية',
            'منتجات الألبان الطازجة',
            'لحوم مختارة بعناية'
        ];
        return texts[Math.floor(Math.random() * texts.length)];
    }

    // ===== ENHANCED TOAST NOTIFICATIONS =====
    setupEnhancedToasts() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container-enhanced')) {
            const container = document.createElement('div');
            container.id = 'toast-container-enhanced';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }
    }

    showEnhancedToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container-enhanced');
        const toast = document.createElement('div');
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.className = `toast-enhanced ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">${icons[type] || icons.info}</span>
                <span style="flex: 1;">${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Show toast
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto-hide
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.product-card, .category-card, .feature-card, .deal-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    // ===== TOUCH GESTURES =====
    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            // Detect swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.handleSwipeLeft(e.target);
                    } else {
                        this.handleSwipeRight(e.target);
                    }
                }
            }

            touchStartX = 0;
            touchStartY = 0;
        });
    }

    handleSwipeLeft(element) {
        // Handle left swipe (e.g., next product in carousel)
        const carousel = element.closest('.products-grid, .deals-grid');
        if (carousel) {
            this.scrollCarousel(carousel, 'left');
        }
    }

    handleSwipeRight(element) {
        // Handle right swipe (e.g., previous product in carousel)
        const carousel = element.closest('.products-grid, .deals-grid');
        if (carousel) {
            this.scrollCarousel(carousel, 'right');
        }
    }

    scrollCarousel(carousel, direction) {
        const scrollAmount = 300;
        const currentScroll = carousel.scrollLeft;
        
        if (direction === 'left') {
            carousel.scrollTo({
                left: currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        } else {
            carousel.scrollTo({
                left: currentScroll - scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    // ===== LAZY LOADING =====
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
    }

    // ===== UTILITY METHODS =====
    showButtonLoading(button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="spinner-small"></span> Loading...';
    }

    hideButtonLoading(button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Add to Cart';
    }

    async updateCartCount() {
        try {
            const response = await fetch('/api/cart/count');
            const data = await response.json();
            
            // Update all cart count elements including new navigation
            document.querySelectorAll('#cart-count, .cart-count, #nav-cart-count, .cart-badge').forEach(element => {
                element.textContent = data.count;
                
                // Animate count update
                element.style.animation = 'countUpdate 0.3s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 300);
            });
        } catch (error) {
            console.error('Error updating cart count:', error);
            
            // Fallback: update from form response if API fails
            this.updateCartCountFromStorage();
        }
    }
    
    updateCartCountFromStorage() {
        const count = localStorage.getItem('cart_count') || '0';
        document.querySelectorAll('#cart-count, .cart-count, #nav-cart-count, .cart-badge').forEach(element => {
            element.textContent = count;
        });
    }

    // ===== PERFORMANCE MONITORING =====
    logPerformance(action, startTime) {
        const duration = performance.now() - startTime;
        console.log(`FreshMart: ${action} completed in ${duration.toFixed(2)}ms`);
    }
}

// ===== ADDITIONAL ANIMATION KEYFRAMES =====
const additionalStyles = `
    @keyframes countUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes navIconBounce {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(5deg); }
        50% { transform: scale(1.2) rotate(-3deg); }
        75% { transform: scale(1.1) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
    
    .spinner-small {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #4CAF50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    /* Initialize dropdown items for animation */
    .dropdown-link {
        opacity: 0.7;
        transform: translateY(-5px);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .spinner-small {
            animation: none;
        }
        
        @keyframes navIconBounce {
            0%, 100% { transform: scale(1) rotate(0deg); }
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZE ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    window.freshMartEnhancements = new FreshMartEnhancements();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FreshMartEnhancements;
}