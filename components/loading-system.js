/**
 * LoadingSystem - Modern loading states and transitions
 * Handles page transitions, button loading states, and smooth animations
 */
class LoadingSystem {
    constructor() {
        this.isTransitioning = false;
        this.loadingElements = new Map();
        
        // Initialize loading overlay
        this.initializeLoadingOverlay();
        
        // Bind methods
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handlePageShow = this.handlePageShow.bind(this);
        
        // Add page transition listeners
        this.initializePageTransitions();
    }

    /**
     * Initialize loading overlay for page transitions
     */
    initializeLoadingOverlay() {
        if (!document.getElementById('loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">Loading...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }

    /**
     * Initialize page transition effects
     */
    initializePageTransitions() {
        // Add event listeners for page transitions
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('pageshow', this.handlePageShow);
        
        // Intercept navigation links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (link && this.shouldInterceptLink(link)) {
                event.preventDefault();
                this.navigateWithTransition(link.href);
            }
        });
    }

    /**
     * Check if link should be intercepted for smooth transitions
     */
    shouldInterceptLink(link) {
        const href = link.getAttribute('href');
        
        // Skip if it's an external link
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            return false;
        }
        
        // Skip if it's a hash link
        if (href.startsWith('#')) {
            return false;
        }
        
        // Skip if it has target="_blank"
        if (link.getAttribute('target') === '_blank') {
            return false;
        }
        
        // Skip if it's a download link
        if (link.hasAttribute('download')) {
            return false;
        }
        
        return true;
    }

    /**
     * Navigate with smooth transition
     */
    navigateWithTransition(url) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Show loading overlay
        this.showPageLoading();
        
        // Add slight delay for smooth transition
        setTimeout(() => {
            window.location.href = url;
        }, 200);
    }

    /**
     * Show page loading overlay
     */
    showPageLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = overlay.querySelector('.loading-text');
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Hide page loading overlay
     */
    hidePageLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        this.isTransitioning = false;
    }

    /**
     * Handle before unload event
     */
    handleBeforeUnload() {
        // Show loading when navigating away
        this.showPageLoading('Navigating...');
    }

    /**
     * Handle page show event
     */
    handlePageShow(event) {
        // Hide loading when page loads
        this.hidePageLoading();
        
        // If page was restored from cache, ensure everything is reset
        if (event.persisted) {
            this.hidePageLoading();
        }
    }

    /**
     * Show button loading state
     */
    showButtonLoading(button, loadingText = 'Loading...') {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }
        
        if (!button) return;
        
        // Store original content
        const originalContent = button.innerHTML;\n        const originalDisabled = button.disabled;\n        \n        // Set loading state\n        button.innerHTML = `\n            <span class=\"button-loading-spinner\"></span>\n            <span class=\"button-loading-text\">${loadingText}</span>\n        `;\n        button.disabled = true;\n        button.classList.add('loading');\n        \n        // Store original state\n        this.loadingElements.set(button, {\n            originalContent,\n            originalDisabled\n        });\n        \n        return button;\n    }\n\n    /**\n     * Hide button loading state\n     */\n    hideButtonLoading(button) {\n        if (typeof button === 'string') {\n            button = document.querySelector(button);\n        }\n        \n        if (!button) return;\n        \n        const originalState = this.loadingElements.get(button);\n        if (!originalState) return;\n        \n        // Restore original state\n        button.innerHTML = originalState.originalContent;\n        button.disabled = originalState.originalDisabled;\n        button.classList.remove('loading');\n        \n        // Clean up\n        this.loadingElements.delete(button);\n        \n        return button;\n    }\n\n    /**\n     * Create loading button with promise\n     */\n    async withButtonLoading(button, promise, loadingText = 'Loading...') {\n        this.showButtonLoading(button, loadingText);\n        \n        try {\n            const result = await promise;\n            this.hideButtonLoading(button);\n            return result;\n        } catch (error) {\n            this.hideButtonLoading(button);\n            throw error;\n        }\n    }\n\n    /**\n     * Show loading skeleton for content\n     */\n    showLoadingSkeleton(container, type = 'default') {\n        if (typeof container === 'string') {\n            container = document.querySelector(container);\n        }\n        \n        if (!container) return;\n        \n        const skeletons = {\n            default: `\n                <div class=\"skeleton-item\">\n                    <div class=\"skeleton-line skeleton-line-title\"></div>\n                    <div class=\"skeleton-line skeleton-line-subtitle\"></div>\n                    <div class=\"skeleton-line skeleton-line-content\"></div>\n                </div>\n            `,\n            product: `\n                <div class=\"skeleton-product\">\n                    <div class=\"skeleton-image\"></div>\n                    <div class=\"skeleton-content\">\n                        <div class=\"skeleton-line skeleton-line-title\"></div>\n                        <div class=\"skeleton-line skeleton-line-price\"></div>\n                        <div class=\"skeleton-line skeleton-line-description\"></div>\n                    </div>\n                </div>\n            `,\n            grid: `\n                <div class=\"skeleton-grid\">\n                    ${Array(6).fill(0).map(() => `\n                        <div class=\"skeleton-product\">\n                            <div class=\"skeleton-image\"></div>\n                            <div class=\"skeleton-content\">\n                                <div class=\"skeleton-line skeleton-line-title\"></div>\n                                <div class=\"skeleton-line skeleton-line-price\"></div>\n                            </div>\n                        </div>\n                    `).join('')}\n                </div>\n            `\n        };\n        \n        // Store original content\n        const originalContent = container.innerHTML;\n        this.loadingElements.set(container, { originalContent });\n        \n        // Show skeleton\n        container.innerHTML = skeletons[type] || skeletons.default;\n        container.classList.add('skeleton-loading');\n    }\n\n    /**\n     * Hide loading skeleton\n     */\n    hideLoadingSkeleton(container) {\n        if (typeof container === 'string') {\n            container = document.querySelector(container);\n        }\n        \n        if (!container) return;\n        \n        const originalState = this.loadingElements.get(container);\n        if (!originalState) return;\n        \n        // Restore original content\n        container.innerHTML = originalState.originalContent;\n        container.classList.remove('skeleton-loading');\n        \n        // Clean up\n        this.loadingElements.delete(container);\n    }\n\n    /**\n     * Create smooth fade transition\n     */\n    fadeTransition(element, duration = 300) {\n        return new Promise((resolve) => {\n            if (typeof element === 'string') {\n                element = document.querySelector(element);\n            }\n            \n            if (!element) {\n                resolve();\n                return;\n            }\n            \n            element.style.transition = `opacity ${duration}ms ease`;\n            element.style.opacity = '0';\n            \n            setTimeout(() => {\n                element.style.opacity = '1';\n                setTimeout(() => {\n                    element.style.transition = '';\n                    resolve();\n                }, duration);\n            }, 50);\n        });\n    }\n\n    /**\n     * Create slide transition\n     */\n    slideTransition(element, direction = 'up', duration = 300) {\n        return new Promise((resolve) => {\n            if (typeof element === 'string') {\n                element = document.querySelector(element);\n            }\n            \n            if (!element) {\n                resolve();\n                return;\n            }\n            \n            const transforms = {\n                up: 'translateY(20px)',\n                down: 'translateY(-20px)',\n                left: 'translateX(20px)',\n                right: 'translateX(-20px)'\n            };\n            \n            element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;\n            element.style.transform = transforms[direction];\n            element.style.opacity = '0';\n            \n            setTimeout(() => {\n                element.style.transform = 'translateY(0)';\n                element.style.opacity = '1';\n                setTimeout(() => {\n                    element.style.transition = '';\n                    element.style.transform = '';\n                    resolve();\n                }, duration);\n            }, 50);\n        });\n    }\n\n    /**\n     * Destroy loading system\n     */\n    destroy() {\n        // Remove event listeners\n        window.removeEventListener('beforeunload', this.handleBeforeUnload);\n        window.removeEventListener('pageshow', this.handlePageShow);\n        \n        // Clean up loading elements\n        this.loadingElements.forEach((state, element) => {\n            if (element.classList.contains('loading')) {\n                this.hideButtonLoading(element);\n            }\n            if (element.classList.contains('skeleton-loading')) {\n                this.hideLoadingSkeleton(element);\n            }\n        });\n        \n        // Remove loading overlay\n        const overlay = document.getElementById('loading-overlay');\n        if (overlay) {\n            overlay.remove();\n        }\n        \n        console.log('LoadingSystem destroyed');\n    }\n}\n\n// Export for module usage\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = LoadingSystem;\n}"