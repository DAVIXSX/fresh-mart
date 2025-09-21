// ===== MODERN FRESHMART JAVASCRIPT =====

// Enhanced app initialization
class FreshMartApp {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        this.initializeCart();
        this.initializeMobileMenu();
        this.initializeQuantitySelectors();
        this.initializeForms();
        this.initializeAnimations();
        this.initializeScrollEffects();
        this.initializeLazyLoading();
        this.updateCartCount();
        this.setupHeaderScrollEffect();
    }

    // Enhanced cart functionality with animations
    initializeCart() {
        const addToCartForms = document.querySelectorAll('.add-to-cart-form');
        addToCartForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleAddToCart(e, form);
            });
        });
    }

    async handleAddToCart(event, form) {
        event.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const productCard = form.closest('.product-card');
        const cartIcon = document.querySelector('.cart-link');
        
        // Show loading state
        this.showButtonLoading(submitBtn);
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                // Success animation sequence
                await this.playAddToCartAnimation(productCard, cartIcon);
                this.showToast('تم إضافة المنتج بنجاح! 🛒', 'success');
                this.updateCartCount();
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            this.showToast('حدث خطأ في إضافة المنتج', 'error');
        } finally {
            this.hideButtonLoading(submitBtn);
        }
    }

    async playAddToCartAnimation(productCard, cartIcon) {
        return new Promise((resolve) => {
            // 1. Product card success animation
            productCard.style.animation = 'cartSuccess 0.6s ease';
            
            // 2. Create flying item
            const flyingItem = this.createFlyingItem(productCard, cartIcon);
            
            // 3. Cart icon animation
            setTimeout(() => {
                cartIcon.style.animation = 'cartBounce 0.6s ease';
                
                // Cleanup
                setTimeout(() => {
                    productCard.style.animation = '';
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
        flyingItem.textContent = '📦';
        flyingItem.style.cssText = `
            position: fixed;
            left: ${sourceRect.left + sourceRect.width / 2}px;
            top: ${sourceRect.top + sourceRect.height / 2}px;
            font-size: 2rem;
            z-index: 9999;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(flyingItem);
        
        // Animate to cart
        requestAnimationFrame(() => {
            flyingItem.style.left = `${targetRect.left}px`;
            flyingItem.style.top = `${targetRect.top}px`;
            flyingItem.style.transform = 'scale(0.3)';
            flyingItem.style.opacity = '0';
        });
        
        return flyingItem;
    }

// ===== MOBILE MENU =====
    // Enhanced mobile menu functionality
    initializeMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const navbar = document.getElementById('navbar');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileClose = document.getElementById('mobile-close');
        
        if (menuToggle && mobileMenu && mobileClose) {
            // Open mobile menu
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                menuToggle.classList.add('active');
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = 'hidden';
            });
            
            // Close mobile menu
            mobileClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            // Close menu when clicking outside
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    mobileMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Mobile dropdown functionality
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        });
    }

    // Enhanced quantity selectors with smooth animations
    initializeQuantitySelectors() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                const input = e.target.parentElement.querySelector('.qty-input, .qty-input-large');
                if (input) {
                    const isIncrease = e.target.classList.contains('plus');
                    const currentValue = parseInt(input.value) || 1;
                    const min = parseInt(input.getAttribute('min')) || 1;
                    const max = parseInt(input.getAttribute('max')) || 999;
                    
                    let newValue;
                    if (isIncrease) {
                        newValue = Math.min(currentValue + 1, max);
                    } else {
                        newValue = Math.max(currentValue - 1, min);
                    }
                    
                    // Animate value change
                    input.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        input.value = newValue;
                        input.style.transform = 'scale(1)';
                        input.dispatchEvent(new Event('change'));
                    }, 100);
                }
            }
        });
    }

    // Enhanced form validation and feedback
    initializeForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearValidationError(input));
            });
        });
        
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                if (this.validateEmail(email)) {
                    this.showToast('شكراً للاشتراك! 📧', 'success');
                    newsletterForm.reset();
                } else {
                    this.showToast('يرجى إدخال عنوان بريد صحيح', 'error');
                }
            });
        }
    }

    // Scroll-triggered animations
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
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

    // Header scroll effect
    setupHeaderScrollEffect() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = scrollY;
        });
    }

    // Lazy loading implementation
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            lazyImageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
    }

    // Scroll effects for parallax and reveals
    initializeScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Utility methods
    showButtonLoading(button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="loading-spinner"></span> جاري التحميل...';
    }

    hideButtonLoading(button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'أضف للعربة';
    }

    async updateCartCount() {
        try {
            const response = await fetch('/api/cart/count');
            const data = await response.json();
            
            document.querySelectorAll('#cart-count, .cart-count').forEach(element => {
                const oldCount = parseInt(element.textContent) || 0;
                const newCount = data.count;
                
                if (newCount !== oldCount) {
                    element.style.animation = 'countUpdate 0.3s ease';
                    element.textContent = newCount;
                    
                    setTimeout(() => {
                        element.style.animation = '';
                    }, 300);
                }
            });
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        
        let isValid = true;
        let errorMessage = '';
        
        if (!value) {
            isValid = false;
            errorMessage = 'هذا الحقل مطلوب';
        } else if (type === 'email' && !this.validateEmail(value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال عنوان بريد صحيح';
        }
        
        if (!isValid) {
            field.style.borderColor = 'var(--accent-500)';
            field.title = errorMessage;
            field.parentElement.classList.add('error');
        } else {
            field.style.borderColor = 'var(--primary-500)';
            field.title = '';
            field.parentElement.classList.remove('error');
        }
        
        return isValid;
    }

    clearValidationError(field) {
        field.style.borderColor = '';
        field.title = '';
        field.parentElement.classList.remove('error');
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = this.getToastContainer();
        const toast = document.createElement('div');
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">${icons[type] || icons.info}</span>
                <span style="flex: 1;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
            </div>
        `;
        
        Object.assign(toast.style, {
            padding: '12px 20px',
            margin: '10px 0',
            borderRadius: 'var(--radius-lg)',
            color: 'white',
            fontWeight: '500',
            boxShadow: 'var(--shadow-lg)',
            transform: 'translateX(400px)',
            transition: 'transform var(--transition-base)',
            maxWidth: '350px',
            backgroundColor: this.getToastColor(type),
            position: 'relative',
            overflow: 'hidden'
        });
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 10);
        
        // Auto-hide
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    getToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 9999;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    getToastColor(type) {
        const colors = {
            success: 'var(--primary-500)',
            error: 'var(--accent-500)',
            warning: 'var(--secondary-500)',
            info: 'var(--neutral-600)'
        };
        return colors[type] || colors.info;
    }
}

// Enhanced CSS animations
const additionalStyles = `
    @keyframes cartSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.05) rotate(2deg); }
        100% { transform: scale(1); }
    }
    
    @keyframes cartBounce {
        0%, 20%, 53%, 80%, 100% { transform: scale(1); }
        40%, 43% { transform: scale(1.2); }
        70% { transform: scale(1.1); }
        90% { transform: scale(1.05); }
    }
    
    @keyframes countUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .toast {
        border-left: 4px solid rgba(255,255,255,0.3);
    }
    
    /* Mobile responsive animations */
    @media (max-width: 768px) {
        .product-card:hover {
            transform: none;
        }
        
        .category-card:hover {
            transform: translateY(-4px);
        }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.freshMartApp = new FreshMartApp();
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        if (target !== '#') {
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});