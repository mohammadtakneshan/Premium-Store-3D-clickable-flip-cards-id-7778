/**
 * ModalSystem - Modern modal component with smooth animations and Apple-inspired design
 * Handles product details, confirmations, and custom content
 */
class ModalSystem {
    constructor() {
        this.modals = new Map();
        this.currentModal = null;
        this.isAnimating = false;
        this.scrollPosition = 0;
        
        // Bind methods
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);
        
        // Initialize modal container
        this.initializeModalContainer();
    }

    /**
     * Initialize the modal container
     */
    initializeModalContainer() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('modal-container')) {
            const container = document.createElement('div');
            container.id = 'modal-container';
            container.className = 'modal-container';
            document.body.appendChild(container);
        }
    }

    /**
     * Show product detail modal
     */
    showProductModal(product) {
        const modalId = `product-modal-${product.id || product.storeProductId}`;
        
        const content = `
            <div class="modal-header">
                <h2 class="modal-title">${product.name || product.title}</h2>
                <button class="modal-close" aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-content">
                <div class="modal-product-image">
                    <div class="product-emoji-large">${product.emoji || product.icon}</div>
                </div>
                <div class="modal-product-info">
                    <div class="product-price-large">${product.price}</div>
                    <p class="product-description-full">${product.shortDescription || product.description}</p>
                    
                    <div class="product-features-list">
                        <h3>Features:</h3>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${product.colors ? `
                        <div class="product-colors-section">
                            <h3>Available Colors:</h3>
                            <div class="color-options-large">
                                ${product.colors.map(color => `
                                    <div class="color-option-large" style="background-color: ${color}" title="${color}"></div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="modal-actions">
                        <button class="action-btn primary" data-action="add-to-cart">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="m1 1 4 4 12.68 6.39a2 2 0 0 1 .6 2.87L17 22H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11Z"></path>
                            </svg>
                            Add to Cart
                        </button>
                        <button class="action-btn secondary" data-action="add-to-wishlist">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                            </svg>
                            Add to Wishlist
                        </button>
                        ${product.isAvailableInStore ? `
                            <button class="action-btn outline" data-action="view-in-store">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 3h18v18H3V3z"></path>
                                    <path d="M9 9h6v6H9V9z"></path>
                                </svg>
                                View in Store
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalId, content, 'product-modal');
        
        // Add event listeners for modal actions
        this.attachModalActionListeners(product);
    }

    /**
     * Show confirmation modal
     */
    showConfirmationModal(title, message, onConfirm, onCancel) {
        const modalId = 'confirmation-modal';
        
        const content = `
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
            </div>
            <div class="modal-content">
                <p class="confirmation-message">${message}</p>
                <div class="modal-actions">
                    <button class="action-btn primary" data-action="confirm">Confirm</button>
                    <button class="action-btn secondary" data-action="cancel">Cancel</button>
                </div>
            </div>
        `;

        this.showModal(modalId, content, 'confirmation-modal');
        
        // Add event listeners
        const modal = document.getElementById(modalId);
        const confirmBtn = modal.querySelector('[data-action="confirm"]');
        const cancelBtn = modal.querySelector('[data-action="cancel"]');
        
        confirmBtn.addEventListener('click', () => {
            this.hideModal(modalId);
            if (onConfirm) onConfirm();
        });
        
        cancelBtn.addEventListener('click', () => {
            this.hideModal(modalId);
            if (onCancel) onCancel();
        });
    }

    /**
     * Show generic modal
     */
    showModal(modalId, content, className = '') {
        if (this.isAnimating) return;
        
        // Close any existing modal
        if (this.currentModal) {
            this.hideModal(this.currentModal);
        }
        
        // Save scroll position and disable scroll
        this.scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
        
        // Create modal element
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = `modal ${className}`;
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-dialog">
                ${content}
            </div>
        `;
        
        // Add to container
        const container = document.getElementById('modal-container');
        container.appendChild(modal);
        
        // Add event listeners
        modal.addEventListener('click', this.handleBackdropClick);
        modal.querySelector('.modal-dialog').addEventListener('click', this.handleModalClick);
        
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal(modalId));
        }
        
        // Show with animation
        this.isAnimating = true;
        requestAnimationFrame(() => {
            modal.classList.add('show');
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        });
        
        // Set as current modal
        this.currentModal = modalId;
        this.modals.set(modalId, modal);
        
        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeydown);
        
        console.log('Modal shown:', modalId);
    }

    /**
     * Hide modal
     */
    hideModal(modalId) {
        if (this.isAnimating) return;
        
        const modal = this.modals.get(modalId);
        if (!modal) return;
        
        this.isAnimating = true;
        
        // Hide with animation
        modal.classList.remove('show');
        modal.classList.add('hide');
        
        setTimeout(() => {
            // Remove modal
            modal.remove();
            this.modals.delete(modalId);
            
            // Restore scroll
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            window.scrollTo(0, this.scrollPosition);
            
            // Remove keyboard listener if no modals
            if (this.modals.size === 0) {
                document.removeEventListener('keydown', this.handleKeydown);
            }
            
            this.currentModal = null;
            this.isAnimating = false;
            
            console.log('Modal hidden:', modalId);
        }, 300);
    }

    /**
     * Handle backdrop clicks
     */
    handleBackdropClick(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                this.hideModal(modal.id);
            }
        }
    }

    /**
     * Handle modal content clicks (prevent closing)
     */
    handleModalClick(event) {
        event.stopPropagation();
    }

    /**
     * Handle keyboard events
     */
    handleKeydown(event) {
        if (event.key === 'Escape' && this.currentModal) {
            this.hideModal(this.currentModal);
        }
    }

    /**
     * Attach action listeners to modal buttons
     */
    attachModalActionListeners(product) {
        const modal = document.getElementById(this.currentModal);
        if (!modal) return;

        // Add to cart
        const addToCartBtn = modal.querySelector('[data-action="add-to-cart"]');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.hideModal(this.currentModal);
                if (window.cartSystem) {
                    window.cartSystem.addToCart(product);
                } else {
                    window.toastSystem?.showToast('Added to cart!', 'success');
                }
                console.log('Added to cart:', product);
            });
        }

        // Add to wishlist
        const addToWishlistBtn = modal.querySelector('[data-action="add-to-wishlist"]');
        if (addToWishlistBtn) {
            addToWishlistBtn.addEventListener('click', () => {
                this.hideModal(this.currentModal);
                window.toastSystem?.showToast('Added to wishlist!', 'success');
                console.log('Added to wishlist:', product);
            });
        }

        // View in store
        const viewInStoreBtn = modal.querySelector('[data-action="view-in-store"]');
        if (viewInStoreBtn) {
            viewInStoreBtn.addEventListener('click', () => {
                this.hideModal(this.currentModal);
                if (product.isAvailableInStore && product.storeProductId) {
                    window.location.href = `store.html?product=${product.storeProductId}`;
                }
            });
        }
    }

    /**
     * Get scrollbar width for proper padding
     */
    getScrollbarWidth() {
        const scrollDiv = document.createElement('div');
        scrollDiv.style.width = '100px';
        scrollDiv.style.height = '100px';
        scrollDiv.style.overflow = 'scroll';
        scrollDiv.style.position = 'absolute';
        scrollDiv.style.top = '-9999px';
        document.body.appendChild(scrollDiv);
        
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        
        return scrollbarWidth;
    }

    /**
     * Destroy modal system
     */
    destroy() {
        // Close all modals
        this.modals.forEach((modal, modalId) => {
            this.hideModal(modalId);
        });
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('ModalSystem destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalSystem;
}