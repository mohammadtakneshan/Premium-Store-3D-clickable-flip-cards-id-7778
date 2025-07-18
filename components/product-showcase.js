/**
 * ProductShowcase - Manages featured product display and interactions
 * Handles product rendering, animations, and navigation to store
 */
class ProductShowcase {
    constructor(containerId, productData = null) {
        this.container = document.getElementById(containerId);
        this.productData = productData;
        this.products = [];
        this.isInitialized = false;
        
        // Bind methods
        this.handleProductClick = this.handleProductClick.bind(this);
        this.handleProductHover = this.handleProductHover.bind(this);
        this.handleProductLeave = this.handleProductLeave.bind(this);
    }

    /**
     * Initialize the product showcase
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // Load product data if not provided
            if (!this.productData) {
                await this.loadProductData();
            } else {
                this.products = this.productData;
            }

            // Render products
            this.render();
            this.initializeAnimations();
            this.attachEventListeners();
            
            this.isInitialized = true;
            console.log('ProductShowcase initialized');
        } catch (error) {
            console.error('Error initializing ProductShowcase:', error);
            this.renderErrorState();
        }
    }

    /**
     * Load product data from JSON file
     */
    async loadProductData() {
        try {
            const response = await fetch('assets/data/featured-products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const allProducts = data.featuredProducts || [];
            
            // For different showcases, select different products
            if (this.container && this.container.id === 'featured-products-2') {
                // For the second showcase, reverse the order to show different products
                this.products = [...allProducts].reverse();
            } else {
                // For the first showcase, use original order
                this.products = allProducts;
            }
        } catch (error) {
            console.error('Error loading product data:', error);
            this.products = this.getFallbackProducts();
        }
    }

    /**
     * Render the product showcase
     */
    render() {
        if (!this.container) {
            console.error('Container not found');
            return;
        }

        this.container.innerHTML = '';
        
        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            this.container.appendChild(productCard);
        });
    }

    /**
     * Create a product card element
     */
    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'premium-card smooth-enter';
        card.dataset.productId = product.id;
        card.dataset.storeProductId = product.storeProductId;
        card.style.animationDelay = `${index * 0.1}s`;

        const emojiDisplay = product.emoji || product.heroImage;
        const isEmoji = product.emoji && !product.heroImage.startsWith('http') && !product.heroImage.startsWith('assets');

        card.innerHTML = `
            <div class="premium-card-image">
                ${isEmoji || emojiDisplay.length <= 4 ? 
                    `<div class="product-emoji">${emojiDisplay}</div>` :
                    `<img 
                        src="${product.heroImage}" 
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.parentElement.innerHTML='<div class=\\"product-emoji\\">📦</div>'"
                    >`
                }
                <div class="premium-card-overlay">
                    <div class="premium-card-price">$${product.price}</div>
                </div>
            </div>
            <div class="premium-card-content">
                <h3 class="premium-card-title">${product.name}</h3>
                <p class="premium-card-description">${product.shortDescription}</p>
                <div class="premium-card-features">
                    ${product.features.slice(0, 3).map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('')}
                </div>
            </div>
        `;

        return card;
    }

    /**
     * Initialize animations for product cards
     */
    initializeAnimations() {
        // Set up intersection observer for reveal animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        // Observe all product cards
        const cards = this.container.querySelectorAll('.premium-card');
        cards.forEach(card => observer.observe(card));
    }

    /**
     * Attach event listeners to product cards
     */
    attachEventListeners() {
        this.container.addEventListener('click', this.handleProductClick);
        this.container.addEventListener('mouseenter', this.handleProductHover, true);
        this.container.addEventListener('mouseleave', this.handleProductLeave, true);
    }

    /**
     * Handle product card clicks
     */
    handleProductClick(event) {
        const card = event.target.closest('.premium-card');
        if (!card) return;

        const productId = card.dataset.productId;
        const storeProductId = card.dataset.storeProductId;
        const product = this.products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Navigate to store with product highlighting
        this.navigateToStore(product, storeProductId);
    }

    /**
     * Handle product card hover effects
     */
    handleProductHover(event) {
        const card = event.target.closest('.premium-card');
        if (!card) return;

        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    }

    /**
     * Handle product card leave effects
     */
    handleProductLeave(event) {
        const card = event.target.closest('.premium-card');
        if (!card) return;

        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
    }

    /**
     * Navigate to the store with specific product
     */
    navigateToStore(product, storeProductId = null) {
        const targetProductId = storeProductId || product.storeProductId;
        
        if (product.isAvailableInStore && targetProductId) {
            // Navigate to store with product highlighted
            window.location.href = `store.html?product=${targetProductId}`;
        } else {
            // Navigate to store main page
            window.location.href = 'store.html';
        }
    }

    /**
     * Show detailed product information (future enhancement)
     */
    showProductDetails(product) {
        // For now, just log the product details
        console.log('Product details:', product);
        
        // Future: Open modal or expand card with detailed info
        alert(`${product.name}\n\n${product.shortDescription}\n\nFeatures:\n${product.features.join('\n')}\n\nPrice: $${product.price}`);
    }

    /**
     * Render error state when data loading fails
     */
    renderErrorState() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="showcase-error">
                <h3>Unable to load featured products</h3>
                <p>Please check your connection and try again.</p>
                <button class="smooth-button" onclick="window.location.reload()">
                    Retry
                </button>
            </div>
        `;
    }

    /**
     * Get fallback products when data loading fails
     */
    getFallbackProducts() {
        return [
            {
                id: 'fallback-1',
                name: 'Premium Product',
                shortDescription: 'Experience premium quality and design.',
                heroImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY3Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE2MCAyMTBIMjQwTDIwMCAxNTBaIiBmaWxsPSIjODY4NjhCIi8+CjwvU3ZnPgo=',
                price: 299.99,
                currency: 'USD',
                features: ['Premium Quality', 'Modern Design', 'Great Value'],
                isAvailableInStore: false
            }
        ];
    }

    /**
     * Destroy the product showcase and clean up
     */
    destroy() {
        if (!this.isInitialized) return;

        // Remove event listeners
        this.container.removeEventListener('click', this.handleProductClick);
        this.container.removeEventListener('mouseenter', this.handleProductHover, true);
        this.container.removeEventListener('mouseleave', this.handleProductLeave, true);

        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }

        this.isInitialized = false;
        console.log('ProductShowcase destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductShowcase;
}
