/**
 * ParallaxController - Enhanced smooth parallax scrolling effects
 * Handles scroll events, element tracking, transform calculations, and multi-layer support
 */
class ParallaxController {
    constructor(options = {}) {
        this.options = {
            throttleDelay: this.detectOptimalFrameRate(), // Adaptive frame rate
            rootMargin: '50px',
            threshold: 0.1,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            enableMultiLayer: true,
            enableScrollVelocity: true,
            maxVelocity: 50,
            ...options
        };

        this.elements = new Map();
        this.layers = new Map(); // Multi-layer support
        this.isInitialized = false;
        this.animationFrame = null;
        this.lastScrollY = 0;
        this.scrollVelocity = 0;
        this.lastTimestamp = 0;
        this.viewportHeight = window.innerHeight;
        this.frameCount = 0;
        this.performanceMonitor = { lastCheck: Date.now(), frameDrops: 0 };
        
        // Bind methods
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.updateElements = this.updateElements.bind(this);
        this.updateLayers = this.updateLayers.bind(this);
        this.calculateScrollVelocity = this.calculateScrollVelocity.bind(this);
    }

    /**
     * Detect optimal frame rate for current device
     */
    detectOptimalFrameRate() {
        // Check for high refresh rate displays
        if (screen.refreshRate && screen.refreshRate > 60) {
            return 8; // ~120fps for high-end displays
        }
        return 12; // ~80fps for standard displays
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
        console.log('Enhanced ParallaxController initialized with multi-layer support');
    }

    /**
     * Handle scroll events with advanced throttling and velocity calculation
     */
    handleScroll() {
        if (this.animationFrame) {
            return;
        }

        this.animationFrame = requestAnimationFrame((timestamp) => {
            const scrollY = window.pageYOffset;
            
            // Calculate scroll velocity for momentum effects
            if (this.options.enableScrollVelocity) {
                this.calculateScrollVelocity(scrollY, timestamp);
            }
            
            // Update elements and layers
            this.updateElements(scrollY);
            if (this.options.enableMultiLayer) {
                this.updateLayers(scrollY);
            }
            
            // Performance monitoring
            this.monitorPerformance(timestamp);
            
            this.lastScrollY = scrollY;
            this.lastTimestamp = timestamp;
            this.animationFrame = null;
        });
    }

    /**
     * Calculate scroll velocity for momentum-based effects
     */
    calculateScrollVelocity(scrollY, timestamp) {
        if (this.lastTimestamp > 0) {
            const deltaTime = timestamp - this.lastTimestamp;
            const deltaScroll = scrollY - this.lastScrollY;
            
            if (deltaTime > 0) {
                this.scrollVelocity = Math.min(
                    Math.abs(deltaScroll / deltaTime * 16), // Normalize to 16ms
                    this.options.maxVelocity
                );
            }
        }
    }

    /**
     * Monitor performance and adjust frame rate if needed
     */
    monitorPerformance(timestamp) {
        this.frameCount++;
        
        // Check performance every 2 seconds
        if (timestamp - this.performanceMonitor.lastCheck > 2000) {
            const expectedFrames = (timestamp - this.performanceMonitor.lastCheck) / 16;
            const actualFrames = this.frameCount;
            
            // If we're dropping frames, increase throttle delay
            if (actualFrames < expectedFrames * 0.8) {
                this.options.throttleDelay = Math.min(this.options.throttleDelay + 2, 32);
                this.performanceMonitor.frameDrops++;
            } else if (this.performanceMonitor.frameDrops > 0) {
                // Gradually improve performance if stable
                this.options.throttleDelay = Math.max(this.options.throttleDelay - 1, 8);
                this.performanceMonitor.frameDrops = Math.max(0, this.performanceMonitor.frameDrops - 1);
            }
            
            this.performanceMonitor.lastCheck = timestamp;
            this.frameCount = 0;
        }
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
            layer: config.layer || 'default',
            enableVelocity: config.enableVelocity || false,
            velocityMultiplier: config.velocityMultiplier || 0.1,
            enableBlur: config.enableBlur || false,
            maxBlur: config.maxBlur || 5,
            enableScale: config.enableScale || false,
            scaleRange: config.scaleRange || [0.8, 1.2],
            enableRotation: config.enableRotation || false,
            rotationRange: config.rotationRange || [-5, 5],
            isVisible: false,
            ...config
        };

        this.elements.set(element, elementConfig);
        this.observer.observe(element);
        
        // Add element to appropriate layer
        if (this.options.enableMultiLayer) {
            this.addToLayer(element, elementConfig.layer);
        }
    }

    /**
     * Add element to a specific layer for multi-layer parallax
     */
    addToLayer(element, layerName) {
        if (!this.layers.has(layerName)) {
            this.layers.set(layerName, {
                elements: new Set(),
                speed: 1,
                opacity: 1,
                blur: 0
            });
        }
        
        this.layers.get(layerName).elements.add(element);
    }

    /**
     * Configure a parallax layer
     */
    configureLayer(layerName, config) {
        if (!this.layers.has(layerName)) {
            this.layers.set(layerName, { elements: new Set() });
        }
        
        const layer = this.layers.get(layerName);
        Object.assign(layer, config);
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
        
        // Apply velocity-based momentum effects
        if (config.enableVelocity && this.options.enableScrollVelocity) {
            const velocityEffect = this.scrollVelocity * config.velocityMultiplier;
            transformValue += velocityEffect * (config.direction === 'reverse' ? -1 : 1);
        }
        
        // Apply direction multiplier
        if (config.direction === 'reverse') {
            transformValue *= -1;
        }
        
        return transformValue;
    }

    /**
     * Enhanced easing functions for natural motion
     * @param {number} t - Progress value (0-1)
     * @returns {number} Eased value
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    /**
     * Bounce easing for playful animations
     */
    easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }
    
    /**
     * Elastic easing for spring-like motion
     */
    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    /**
     * Apply transform to element with advanced effects
     * @param {HTMLElement} element - Target element
     * @param {string} property - CSS property to animate
     * @param {number} value - Transform value
     */
    applyTransform(element, property, value) {
        const config = this.elements.get(element);
        if (!config) return;
        
        let transformString = '';
        let additionalEffects = [];
        
        // Base transform
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
        
        // Add advanced effects
        if (config.enableScale) {
            const progress = this.calculateScrollProgress(element, this.lastScrollY);
            const scaleRange = config.scaleRange;
            const scale = scaleRange[0] + (progress * (scaleRange[1] - scaleRange[0]));
            additionalEffects.push(`scale(${scale})`);
        }
        
        if (config.enableRotation) {
            const progress = this.calculateScrollProgress(element, this.lastScrollY);
            const rotationRange = config.rotationRange;
            const rotation = rotationRange[0] + (progress * (rotationRange[1] - rotationRange[0]));
            additionalEffects.push(`rotate(${rotation}deg)`);
        }
        
        // Combine all transforms
        const finalTransform = [transformString, ...additionalEffects].join(' ');
        element.style.transform = finalTransform;
        element.style.willChange = 'transform';
        
        // Apply blur effect if enabled
        if (config.enableBlur) {
            const progress = this.calculateScrollProgress(element, this.lastScrollY);
            const blurAmount = progress * config.maxBlur;
            element.style.filter = `blur(${blurAmount}px)`;
        }
    }

    /**
     * Update multi-layer parallax effects
     */
    updateLayers(scrollY) {
        this.layers.forEach((layer) => {
            layer.elements.forEach(element => {
                if (!this.elements.has(element)) return;
                
                const config = this.elements.get(element);
                if (!config.isVisible) return;
                
                // Apply layer-specific effects
                const progress = this.calculateScrollProgress(element, scrollY);
                this.calculateTransform(progress, config);
                
                // Apply layer opacity and blur
                if (layer.opacity !== undefined && layer.opacity !== 1) {
                    element.style.opacity = layer.opacity;
                }
                
                if (layer.blur && layer.blur > 0) {
                    element.style.filter = `blur(${layer.blur}px)`;
                }
            });
        });
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

        console.log('Enhanced ParallaxController destroyed');
        
        // Clear layers
        this.layers.clear();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParallaxController;
}
