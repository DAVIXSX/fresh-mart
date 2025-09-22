// Fresh Mart Static Site JavaScript
class FreshMart {
    constructor() {
        this.cart = this.loadCart();
        this.currentProducts = [];
        this.currentCategory = null;
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.bindEvents();
        this.initializePage();
    }

    // Cart Management
    loadCart() {
        const saved = localStorage.getItem('freshmart_cart');
        return saved ? JSON.parse(saved) : {};
    }

    saveCart() {
        localStorage.setItem('freshmart_cart', JSON.stringify(this.cart));
    }

    addToCart(productId, quantity = 1) {
        if (!this.cart[productId]) {
            this.cart[productId] = 0;
        }
        this.cart[productId] += quantity;
        this.saveCart();
        this.updateCartDisplay();
        this.showToast('تم إضافة المنتج إلى عربة التسوق');
    }

    removeFromCart(productId) {
        delete this.cart[productId];
        this.saveCart();
        this.updateCartDisplay();
        this.showToast('تم حذف المنتج من عربة التسوق');
    }

    updateCartQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.cart[productId] = quantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    clearCart() {
        this.cart = {};
        this.saveCart();
        this.updateCartDisplay();
        this.renderCartItems();
        this.showToast('تم إفراغ عربة التسوق');
    }

    getCartCount() {
        return Object.values(this.cart).reduce((sum, quantity) => sum + quantity, 0);
    }

    getCartTotal() {
        let total = 0;
        for (const [productId, quantity] of Object.entries(this.cart)) {
            const product = getProductById(productId);
            if (product) {
                const discountedPrice = product.price * (1 - product.discount / 100);
                total += discountedPrice * quantity;
            }
        }
        return total.toFixed(2);
    }

    updateCartDisplay() {
        const cartCount = this.getCartCount();
        const cartElements = document.querySelectorAll('#cart-count, #nav-cart-count, .cart-count');
        cartElements.forEach(element => {
            element.textContent = cartCount;
        });
    }

    // Event Binding
    bindEvents() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileClose = document.getElementById('mobile-close');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('active');
            });
        }

        if (mobileClose) {
            mobileClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        }

        // Dropdown functionality
        const dropdownTrigger = document.querySelector('.dropdown-trigger');
        const dropdownPanel = document.querySelector('.dropdown-panel');

        if (dropdownTrigger && dropdownPanel) {
            dropdownTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownPanel.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!dropdownTrigger.contains(e.target) && !dropdownPanel.contains(e.target)) {
                    dropdownPanel.classList.remove('active');
                }
            });
        }

        // Add to cart forms
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('add-to-cart-form')) {
                e.preventDefault();
                const formData = new FormData(e.target);
                const productId = formData.get('product_id');
                const quantity = parseInt(formData.get('quantity') || 1);
                this.addToCart(productId, quantity);
            }
        });

        // Quantity selectors
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                e.preventDefault();
                const input = e.target.parentNode.querySelector('.qty-input');
                const isPlus = e.target.classList.contains('plus');
                let value = parseInt(input.value) || 1;

                if (isPlus) {
                    value = Math.min(value + 1, parseInt(input.max) || 99);
                } else {
                    value = Math.max(value - 1, parseInt(input.min) || 1);
                }

                input.value = value;
            }
        });

        // Search functionality
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = e.target.querySelector('input[name="q"]').value;
                this.performSearch(query);
            });
        }
    }

    // Page Initialization
    initializePage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';

        switch (page) {
            case 'index.html':
            case '':
                this.initHomePage();
                break;
            case 'cart.html':
                this.initCartPage();
                break;
            case 'checkout.html':
                this.initCheckoutPage();
                break;
            default:
                if (page.includes('category-')) {
                    const category = page.replace('category-', '').replace('.html', '');
                    this.initCategoryPage(category);
                } else if (page.includes('product-')) {
                    const productId = page.replace('product-', '').replace('.html', '');
                    this.initProductPage(productId);
                }
                break;
        }
    }

    // Page-specific initialization
    initHomePage() {
        this.renderFeaturedProducts();
        this.renderDiscountedProducts();
        this.renderCategories();
        this.initHeroSlider();
    }

    initCategoryPage(category) {
        this.currentCategory = category;
        this.currentProducts = getProductsByCategory(category);
        this.renderProducts(this.currentProducts);
    }

    initCartPage() {
        this.renderCartItems();
    }

    initProductPage(productId) {
        const product = getProductById(productId);
        if (product) {
            this.renderProductDetails(product);
            this.renderSimilarProducts(product);
        }
    }

    // Rendering Functions
    renderCategories() {
        const container = document.querySelector('.categories-grid');
        if (!container) return;

        container.innerHTML = '';
        Object.entries(CATEGORIES).forEach(([key, category]) => {
            const categoryCard = document.createElement('a');
            categoryCard.href = `category-${key}.html`;
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <h3 class="category-name">${category.name}</h3>
                <div class="category-hover">
                    <span class="shop-now">تسوق الآن ←</span>
                </div>
            `;
            container.appendChild(categoryCard);
        });
    }

    renderFeaturedProducts() {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        const featuredProducts = getFeaturedProducts();
        container.innerHTML = '';

        featuredProducts.forEach(product => {
            const productCard = this.createProductCard(product, true);
            container.appendChild(productCard);
        });
    }

    renderDiscountedProducts() {
        const container = document.querySelector('.deals-grid');
        if (!container) return;

        const discountedProducts = getDiscountedProducts();
        container.innerHTML = '';

        discountedProducts.forEach(product => {
            const dealCard = this.createDealCard(product);
            container.appendChild(dealCard);
        });
    }

    renderProducts(products) {
        const container = document.querySelector('.products-grid, .category-products-grid');
        if (!container) return;

        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<div class="no-products">لا توجد منتجات متاحة</div>';
            return;
        }

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });
    }

    createProductCard(product, isFeatured = false) {
        const card = document.createElement('div');
        card.className = `product-card ${isFeatured ? 'featured-product' : ''}`;

        const discountedPrice = product.price * (1 - product.discount / 100);
        const stockClass = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock';
        const stockText = product.stock > 10 ? '✅ متوفر' : 
                         product.stock > 0 ? `⚠️ باقي ${product.stock} قطع` : '❌ نفد المخزون';

        card.innerHTML = `
            ${isFeatured ? '<div class="product-badge">⭐ مميز</div>' : ''}
            ${product.discount > 0 ? `<div class="product-badge discount-badge">-${product.discount}%</div>` : ''}
            
            <div class="product-image">
                <span class="product-placeholder">${this.getProductEmoji(product)}</span>
                <div class="product-overlay">
                    <a href="product-${product.id}.html" class="overlay-btn">عرض سريع</a>
                </div>
            </div>
            
            <div class="product-info">
                <h3 class="product-name">
                    <a href="product-${product.id}.html">${product.name}</a>
                </h3>
                <p class="product-brand">${product.brand}</p>
                
                <div class="product-rating">
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <span class="rating-count">(${Math.floor(Math.random() * 50) + 10})</span>
                </div>
                
                <div class="product-price">
                    ${product.discount > 0 ? 
                        `<span class="price-original">$${product.price.toFixed(2)}</span>
                         <span class="price-discounted">$${discountedPrice.toFixed(2)}</span>` :
                        `<span class="price">$${product.price.toFixed(2)}</span>`
                    }
                </div>
                
                <div class="product-actions">
                    <form class="add-to-cart-form">
                        <input type="hidden" name="product_id" value="${product.id}">
                        <div class="quantity-selector">
                            <button type="button" class="qty-btn minus">-</button>
                            <input type="number" name="quantity" value="1" min="1" max="${product.stock}" class="qty-input">
                            <button type="button" class="qty-btn plus">+</button>
                        </div>
                        <button type="submit" class="btn btn-primary btn-cart">
                            <span class="btn-text">أضف للعربة</span>
                            <span class="btn-icon">🛒</span>
                        </button>
                    </form>
                </div>
                
                <div class="product-meta">
                    <span class="stock-indicator ${stockClass}">${stockText}</span>
                </div>
            </div>
        `;

        return card;
    }

    createDealCard(product) {
        const card = document.createElement('div');
        card.className = 'deal-card';

        const discountedPrice = product.price * (1 - product.discount / 100);
        const savings = product.price * product.discount / 100;

        card.innerHTML = `
            <div class="deal-badge">${product.discount}% خصم</div>
            <div class="deal-image">
                <span class="product-placeholder">${this.getProductEmoji(product)}</span>
                <div class="deal-timer">
                    <span class="timer-icon">⏰</span>
                    <span class="timer-text">ينتهي قريباً</span>
                </div>
            </div>
            <div class="deal-info">
                <h3 class="deal-name">${product.name}</h3>
                <p class="deal-brand">${product.brand}</p>
                <div class="deal-prices">
                    <span class="price-original">$${product.price.toFixed(2)}</span>
                    <span class="price-deal">$${discountedPrice.toFixed(2)}</span>
                </div>
                <p class="deal-savings">
                    <span class="savings-icon">💰</span>
                    وفر $${savings.toFixed(2)}
                </p>
                <form class="deal-form add-to-cart-form">
                    <input type="hidden" name="product_id" value="${product.id}">
                    <input type="hidden" name="quantity" value="1">
                    <button type="submit" class="btn btn-accent btn-deal">
                        <span class="btn-text">احصل على العرض</span>
                        <span class="btn-icon">🛒</span>
                    </button>
                </form>
                <div class="stock-urgency">
                    <div class="urgency-bar">
                        <div class="urgency-fill" style="width: ${Math.round(product.stock / 20 * 100)}%"></div>
                    </div>
                    <span class="urgency-text">باقي ${product.stock} قطعة فقط!</span>
                </div>
            </div>
        `;

        return card;
    }

    renderCartItems() {
        const container = document.querySelector('.cart-items-container');
        const totalElement = document.querySelector('.cart-total');
        
        if (!container) return;

        container.innerHTML = '';

        if (Object.keys(this.cart).length === 0) {
            container.innerHTML = '<div class="empty-cart">عربة التسوق فارغة</div>';
            if (totalElement) totalElement.textContent = '$0.00';
            return;
        }

        Object.entries(this.cart).forEach(([productId, quantity]) => {
            const product = getProductById(productId);
            if (!product) return;

            const discountedPrice = product.price * (1 - product.discount / 100);
            const totalPrice = discountedPrice * quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <span class="product-placeholder">${this.getProductEmoji(product)}</span>
                </div>
                <div class="cart-item-details">
                    <h4>${product.name}</h4>
                    <p>${product.brand}</p>
                    <div class="cart-item-price">$${discountedPrice.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" onclick="freshMart.updateCartQuantity(${productId}, ${quantity - 1})">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="qty-btn plus" onclick="freshMart.updateCartQuantity(${productId}, ${quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">$${totalPrice.toFixed(2)}</div>
                <button class="remove-item" onclick="freshMart.removeFromCart(${productId})">🗑️</button>
            `;
            container.appendChild(cartItem);
        });

        if (totalElement) {
            totalElement.textContent = `$${this.getCartTotal()}`;
        }
    }

    // Search functionality
    performSearch(query) {
        if (!query.trim()) return;

        const results = searchProducts(query);
        this.currentProducts = results;
        
        // If we're on a search results page or can render results
        const container = document.querySelector('.search-results, .products-grid');
        if (container) {
            this.renderProducts(results);
        } else {
            // Navigate to search results page (you'd need to create this)
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }

    // Hero slider
    initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const navBtns = document.querySelectorAll('.hero-nav-btn');
        let currentSlide = 0;

        if (slides.length === 0) return;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            navBtns.forEach(btn => btn.classList.remove('active'));
            
            if (slides[index]) slides[index].classList.add('active');
            if (navBtns[index]) navBtns[index].classList.add('active');
        }

        navBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // Get product-specific emoji based on category and product type
    getProductEmoji(product) {
        // Category-based emojis
        const categoryEmojis = {
            'vegetables': '🥬',
            'fruits': '🍎',
            'dairy': '🥛',
            'legumes': '🌱',
            'bakery': '🍞',
            'beverages': '🥤',
            'household': '🧽',
            'snacks': '🍿',
            'frozen': '🧊'
        };

        // Product-specific emojis for better variety
        const productEmojis = {
            // Vegetables
            'tomato': '🍅', 'potato': '🥔', 'onion': '🧅', 'carrot': '🥕',
            'broccoli': '🥦', 'cucumber': '🥒', 'lettuce': '🥬', 'pepper': '🌶️',
            'eggplant': '🍆', 'corn': '🌽', 'spinach': '🥬',
            
            // Fruits
            'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'grape': '🍇',
            'strawberry': '🍓', 'pineapple': '🍍', 'watermelon': '🍉',
            'peach': '🍑', 'lemon': '🍋', 'cherry': '🍒', 'avocado': '🥑',
            
            // Dairy
            'milk': '🥛', 'cheese': '🧀', 'butter': '🧈', 'yogurt': '🥛',
            'cream': '🥛', 'ice cream': '🍦',
            
            // Bakery
            'bread': '🍞', 'croissant': '🥐', 'bagel': '🥯', 'donut': '🍩',
            'cake': '🎂', 'cookie': '🍪', 'pretzel': '🥨',
            
            // Beverages
            'coffee': '☕', 'tea': '🍵', 'juice': '🧃', 'soda': '🥤',
            'water': '💧', 'beer': '🍺', 'wine': '🍷',
            
            // Snacks
            'chips': '🍟', 'popcorn': '🍿', 'nuts': '🥜', 'chocolate': '🍫',
            'candy': '🍬', 'crackers': '🍘',
            
            // Legumes
            'beans': '🫘', 'lentils': '🌱', 'peas': '🟢', 'chickpeas': '🌱'
        };

        // First try to find a specific emoji for the product name
        const productName = product.name.toLowerCase();
        for (const [key, emoji] of Object.entries(productEmojis)) {
            if (productName.includes(key)) {
                return emoji;
            }
        }

        // Fall back to category emoji
        return categoryEmojis[product.category] || '📦';
    }

    // Toast notifications
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        const container = document.getElementById('toast-container') || document.body;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the app
const freshMart = new FreshMart();

// Make it globally accessible for onclick handlers
window.freshMart = freshMart;
