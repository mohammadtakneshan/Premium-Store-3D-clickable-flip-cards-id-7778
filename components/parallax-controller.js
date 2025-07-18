/**
 * ParallaxController - Manages smooth parallax scrolling effects
 * Handles scroll events, element tracking, and transform calculations
 */
class ParallaxController {
    constructor(options = {}) {
        this.options = {
            throttleDelay: 16, // ~60fps
            rootMargin: '50px',
            threshold: 0.1,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            ...options
        };

        this.elements = new Map();
        this.isInitialized = false;
        this.animationFrame = null;
        this.lastScrollY = 0;
        this.viewportHeight = window.innerHeight;
        
        // Bind methods
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.updateElements = this.updateElements.bind(this);
    }

    /**
     * Initialize the parallax controller
     */
    init() {
        if (this.isInitialized || this.options.reducedMotion) {
            return;
        }

        // Set up intersection observer for performance
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );

        // Add event listeners
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });

        this.isInitialized = true;
        console.log('ParallaxController initialized');
    }

    /**
     * Handle scroll events with throttling
     */
    handleScroll() {
        if (this.animationFrame) {
            return;
        }

        this.animationFrame = requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            this.updateElements(scrollY);
            this.lastScrollY = scrollY;
            this.animationFrame = null;
        });
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        this.viewportHeight = window.innerHeight;
        this.updateElementsOnResize();
    }

    /**
     * Handle intersection observer callbacks
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            const elementData = this.elements.get(entry.target);
            if (elementData) {
                elementData.isVisible = entry.isIntersecting;
            }
        });
    }

    /**
     * Register an element for parallax effects
     * @param {HTMLElement} element - The element to animate
     * @param {Object} config - Animation configuration
     */
    registerElement(element, config = {}) {
        const elementConfig = {
            speed: config.speed || 0.5,
            direction: config.direction || 'vertical',
            startOffset: config.startOffset || 0,
            endOffset: config.endOffset || 0,
            property: config.property || 'translateY',
            isVisible: false,
            ...config
        };

        this.elements.set(element, elementConfig);
        this.observer.observe(element);
    }

    /**
     * Update all registered elements based on scroll position
     * @param {number} scrollY - Current scroll position
     */
    updateElements(scrollY) {
        this.elements.forEach((config, element) => {
            if (!config.isVisible) return;
            
            // Calculate transform value based on scroll progress
            const progress = this.calculateScrollProgress(element, scrollY);
            const transformValue = this.calculateTransform(progress, config);
            
            // Apply transform with performance optimization
            this.applyTransform(element, config.property, transformValue);
        });
    }

    /**
     * Calculate scroll progress for an element
     * @param {HTMLElement} element - Target element
     * @param {number} scrollY - Current scroll position
     * @returns {number} Progress value between 0 and 1
     */
    calculateScrollProgress(element, scrollY) {
        const rect = element.getBoundingClientRect();
        const elementTop = scrollY + rect.top;
        const elementHeight = rect.height;
        const windowHeight = this.viewportHeight;
        
        // Calculate when element enters and exits viewport
        const startY = elementTop - windowHeight;
        const endY = elementTop + elementHeight;
        const totalDistance = endY - startY;
        
        // Calculate progress (0 to 1) with bounds checking
        if (totalDistance === 0) return 0;
        
        const rawProgress = (scrollY - startY) / totalDistance;
        return Math.max(0, Math.min(1, rawProgress));
    }

    /**
     * Calculate transform value based on progress and configuration
     * @param {number} progress - Scroll progress (0-1)
     * @param {Object} config - Element configuration
     * @returns {number} Transform value
     */
    calculateTransform(progress, config) {
        // Apply easing function for smooth motion
        const easedProgress = this.easeInOutCubic(progress);
        
        // Calculate base transform range
        const range = config.endOffset - config.startOffset;
        let transformValue = config.startOffset + (easedProgress * range * config.speed);
        
        // Apply direction multiplier
        if (config.direction === 'reverse') {
            transformValue *= -1;
        }
        
        return transformValue;
    }

    /**
     * Smooth easing function for natural motion
     * @param {number} t - Progress value (0-1)
     * @returns {number} Eased value
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * Apply transform to element
     * @param {HTMLElement} element - Target element
     * @param {string} property - CSS property to animate
     * @param {number} value - Transform value
     */
    applyTransform(element, property, value) {
        // Optimize by using transform3d for hardware acceleration
        let transformString = '';
        
        switch (property) {
            case 'translateY':
                transformString = `translate3d(0, ${value}px, 0)`;
                break;
            case 'translateX':
                transformString = `translate3d(${value}px, 0, 0)`;
                break;
            case 'scale':
                transformString = `scale3d(${value}, ${value}, 1)`;
                break;
            case 'opacity':
                element.style.opacity = Math.max(0, Math.min(1, value));
                return; // Exit early for opacity
            default:
                transformString = `${property}(${value}px)`;
        }
        
        // Apply transform with hardware acceleration
        element.style.transform = transformString;
        element.style.willChange = 'transform'; // Hint for browser optimization
    }

    /**
     * Update elements when window resizes
     */
    updateElementsOnResize() {
        // Recalculate element positions after resize
        this.elements.forEach((config, element) => {
            // Force recalculation on next scroll
            config.needsRecalculation = true;
        });
    }

    /**
     * Destroy the parallax controller and clean up
     */
    destroy() {
        if (!this.isInitialized) return;

        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Cancel any pending animation frame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Clear elements
        this.elements.clear();
        this.isInitialized = false;

        console.log('ParallaxController destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParallaxController;
}
