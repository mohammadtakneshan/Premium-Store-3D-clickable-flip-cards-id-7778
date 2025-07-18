/**
 * MouseParallaxController - Manages mouse-following parallax effects
 * Creates subtle 3D tilt and movement effects based on cursor position
 */
class MouseParallaxController {
    constructor(options = {}) {
        this.options = {
            intensity: 0.5,
            tiltIntensity: 0.3,
            magneticStrength: 0.2,
            smoothness: 0.15,
            maxDistance: 200,
            enableTilt: true,
            enableMagnetic: true,
            ...options
        };

        this.elements = new Map();
        this.isInitialized = false;
        this.mouse = { x: 0, y: 0 };
        this.smoothMouse = { x: 0, y: 0 };
        this.animationFrame = null;
        this.viewport = { width: window.innerWidth, height: window.innerHeight };
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.updateElements = this.updateElements.bind(this);
        this.smoothMouseMovement = this.smoothMouseMovement.bind(this);
    }

    /**
     * Initialize the mouse parallax controller
     */
    init() {
        if (this.isInitialized) return;

        // Add event listeners
        document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });

        // Start the animation loop
        this.startAnimationLoop();
        this.isInitialized = true;
        
        console.log('MouseParallaxController initialized');
    }

    /**
     * Handle mouse movement events
     */
    handleMouseMove(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        
        // Update all element bounds
        this.elements.forEach((config, element) => {
            config.bounds = element.getBoundingClientRect();
        });
    }

    /**
     * Register an element for mouse parallax effects
     * @param {HTMLElement} element - The element to animate
     * @param {Object} config - Animation configuration
     */
    registerElement(element, config = {}) {
        const elementConfig = {
            type: config.type || 'parallax', // 'parallax', 'tilt', 'magnetic'
            intensity: config.intensity || this.options.intensity,
            tiltIntensity: config.tiltIntensity || this.options.tiltIntensity,
            magneticStrength: config.magneticStrength || this.options.magneticStrength,
            maxDistance: config.maxDistance || this.options.maxDistance,
            reverse: config.reverse || false,
            bounds: element.getBoundingClientRect(),
            currentTransform: { x: 0, y: 0, rotateX: 0, rotateY: 0 },
            ...config
        };

        this.elements.set(element, elementConfig);
        
        // Set initial CSS properties for smooth animations
        element.style.transition = 'transform 0.1s ease-out';
        element.style.willChange = 'transform';
    }

    /**
     * Start the main animation loop
     */
    startAnimationLoop() {
        const animate = () => {
            this.smoothMouseMovement();
            this.updateElements();
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }

    /**
     * Smooth mouse movement for more natural animations
     */
    smoothMouseMovement() {
        const smoothness = this.options.smoothness;
        
        this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * smoothness;
        this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * smoothness;
    }

    /**
     * Update all registered elements
     */
    updateElements() {
        this.elements.forEach((config, element) => {
            this.updateElement(element, config);
        });
    }

    /**
     * Update a single element based on mouse position
     * @param {HTMLElement} element - Target element
     * @param {Object} config - Element configuration
     */
    updateElement(element, config) {
        const bounds = config.bounds;
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        
        const deltaX = this.smoothMouse.x - centerX;
        const deltaY = this.smoothMouse.y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Skip if mouse is too far away
        if (distance > config.maxDistance) {
            this.resetElement(element, config);
            return;
        }

        let transform = '';
        
        switch (config.type) {
            case 'parallax':
                transform = this.calculateParallaxTransform(deltaX, deltaY, config);
                break;
            case 'tilt':
                transform = this.calculateTiltTransform(deltaX, deltaY, bounds, config);
                break;
            case 'magnetic':
                transform = this.calculateMagneticTransform(deltaX, deltaY, distance, config);
                break;
            case 'combined':
                transform = this.calculateCombinedTransform(deltaX, deltaY, bounds, distance, config);
                break;
        }
        
        element.style.transform = transform;
    }

    /**
     * Calculate parallax transform
     */
    calculateParallaxTransform(deltaX, deltaY, config) {
        const intensity = config.intensity;
        const reverse = config.reverse ? -1 : 1;
        
        const moveX = (deltaX * intensity * reverse) / 10;
        const moveY = (deltaY * intensity * reverse) / 10;
        
        return `translate3d(${moveX}px, ${moveY}px, 0)`;
    }

    /**
     * Calculate tilt transform (3D rotation)
     */
    calculateTiltTransform(deltaX, deltaY, bounds, config) {
        const intensity = config.tiltIntensity;
        const reverse = config.reverse ? -1 : 1;
        
        const rotateX = ((deltaY / bounds.height) * intensity * 20 * reverse);
        const rotateY = ((deltaX / bounds.width) * intensity * -20 * reverse);
        
        return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    /**
     * Calculate magnetic transform (attraction effect)
     */
    calculateMagneticTransform(deltaX, deltaY, distance, config) {
        const strength = config.magneticStrength;
        const maxDistance = config.maxDistance;
        
        // Inverse distance for magnetic effect
        const magneticForce = Math.max(0, 1 - (distance / maxDistance));
        
        const moveX = (deltaX * strength * magneticForce) / 2;
        const moveY = (deltaY * strength * magneticForce) / 2;
        
        return `translate3d(${moveX}px, ${moveY}px, 0)`;
    }

    /**
     * Calculate combined transform (parallax + tilt + magnetic)
     */
    calculateCombinedTransform(deltaX, deltaY, bounds, distance, config) {
        const intensity = config.intensity;
        const tiltIntensity = config.tiltIntensity;
        const magneticStrength = config.magneticStrength;
        const maxDistance = config.maxDistance;
        const reverse = config.reverse ? -1 : 1;
        
        // Parallax movement
        const moveX = (deltaX * intensity * reverse) / 15;
        const moveY = (deltaY * intensity * reverse) / 15;
        
        // Tilt rotation
        const rotateX = ((deltaY / bounds.height) * tiltIntensity * 15 * reverse);
        const rotateY = ((deltaX / bounds.width) * tiltIntensity * -15 * reverse);
        
        // Magnetic attraction
        const magneticForce = Math.max(0, 1 - (distance / maxDistance));
        const magneticX = (deltaX * magneticStrength * magneticForce) / 3;
        const magneticY = (deltaY * magneticStrength * magneticForce) / 3;
        
        const totalX = moveX + magneticX;
        const totalY = moveY + magneticY;
        
        return `perspective(1000px) translate3d(${totalX}px, ${totalY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    /**
     * Reset element to neutral position
     */
    resetElement(element, config) {
        element.style.transform = '';
    }

    /**
     * Update element bounds (call after layout changes)
     */
    updateElementBounds(element) {
        const config = this.elements.get(element);
        if (config) {
            config.bounds = element.getBoundingClientRect();
        }
    }

    /**
     * Remove an element from mouse parallax effects
     * @param {HTMLElement} element - Element to remove
     */
    unregisterElement(element) {
        if (this.elements.has(element)) {
            element.style.transform = '';
            element.style.willChange = 'auto';
            this.elements.delete(element);
        }
    }

    /**
     * Pause mouse parallax effects
     */
    pause() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * Resume mouse parallax effects
     */
    resume() {
        if (!this.animationFrame) {
            this.startAnimationLoop();
        }
    }

    /**
     * Destroy the mouse parallax controller
     */
    destroy() {
        if (!this.isInitialized) return;

        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);

        // Cancel animation frame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Reset all elements
        this.elements.forEach((config, element) => {
            element.style.transform = '';
            element.style.willChange = 'auto';
        });

        // Clear elements
        this.elements.clear();
        this.isInitialized = false;

        console.log('MouseParallaxController destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MouseParallaxController;
}