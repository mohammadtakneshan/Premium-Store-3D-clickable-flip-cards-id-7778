/**
 * ParticleSystem - Creates and manages floating particle effects
 * Handles particle creation, animation, and interactive behaviors
 */
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            throw new Error('Container element not found');
        }

        this.options = {
            particleCount: 50,
            particleSize: { min: 2, max: 8 },
            speed: { min: 0.2, max: 0.8 },
            colors: ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF2D92'],
            shapes: ['circle', 'square', 'triangle'],
            opacity: { min: 0.1, max: 0.6 },
            interactive: true,
            mouseRadius: 150,
            mouseForce: 0.5,
            enableConnections: false,
            connectionDistance: 100,
            respawnEdges: true,
            gravity: 0.1,
            bounceEdges: true,
            ...options
        };

        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationFrame = null;
        this.isRunning = false;
        this.canvas = null;
        this.ctx = null;
        this.containerBounds = null;

        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.updateContainerBounds = this.updateContainerBounds.bind(this);
    }

    /**
     * Initialize the particle system
     */
    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.updateContainerBounds();
        this.start();
        
        console.log('ParticleSystem initialized with', this.options.particleCount, 'particles');
    }

    /**
     * Setup canvas element
     */
    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resizeCanvas();
    }

    /**
     * Resize canvas to match container
     */
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.updateContainerBounds();
    }

    /**
     * Update container bounds
     */
    updateContainerBounds() {
        if (this.canvas) {
            this.containerBounds = {
                width: this.canvas.width,
                height: this.canvas.height
            };
        }
    }

    /**
     * Create particle instances
     */
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    /**
     * Create a single particle
     */
    createParticle() {
        const bounds = this.containerBounds || { width: 800, height: 600 };
        
        return {
            x: Math.random() * bounds.width,
            y: Math.random() * bounds.height,
            vx: (Math.random() - 0.5) * (this.options.speed.max - this.options.speed.min) + this.options.speed.min,
            vy: (Math.random() - 0.5) * (this.options.speed.max - this.options.speed.min) + this.options.speed.min,
            size: Math.random() * (this.options.particleSize.max - this.options.particleSize.min) + this.options.particleSize.min,
            color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
            shape: this.options.shapes[Math.floor(Math.random() * this.options.shapes.length)],
            opacity: Math.random() * (this.options.opacity.max - this.options.opacity.min) + this.options.opacity.min,
            baseOpacity: Math.random() * (this.options.opacity.max - this.options.opacity.min) + this.options.opacity.min,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            life: 1,
            maxLife: 1,
            trail: []
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.options.interactive) {
            this.container.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        }
        
        window.addEventListener('resize', this.handleResize, { passive: true });
    }

    /**
     * Handle mouse movement
     */
    handleMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
    }

    /**
     * Handle window resize
     */
    handleResize() {
        this.resizeCanvas();
    }

    /**
     * Start the animation loop
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    /**
     * Stop the animation loop
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) return;

        this.clearCanvas();
        this.updateParticles();
        this.drawParticles();
        
        if (this.options.enableConnections) {
            this.drawConnections();
        }

        this.animationFrame = requestAnimationFrame(this.animate);
    }

    /**
     * Clear the canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Update particle positions and properties
     */
    updateParticles() {
        this.particles.forEach(particle => {
            this.updateParticlePosition(particle);
            this.updateParticleInteraction(particle);
            this.updateParticleProperties(particle);
        });
    }

    /**
     * Update particle position
     */
    updateParticlePosition(particle) {
        // Apply gravity
        particle.vy += this.options.gravity;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Handle edge bouncing or respawning
        if (this.options.bounceEdges) {
            if (particle.x <= 0 || particle.x >= this.containerBounds.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.containerBounds.width, particle.x));
            }
            if (particle.y <= 0 || particle.y >= this.containerBounds.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.containerBounds.height, particle.y));
            }
        } else if (this.options.respawnEdges) {
            if (particle.x < -particle.size) {
                particle.x = this.containerBounds.width + particle.size;
            } else if (particle.x > this.containerBounds.width + particle.size) {
                particle.x = -particle.size;
            }
            if (particle.y < -particle.size) {
                particle.y = this.containerBounds.height + particle.size;
            } else if (particle.y > this.containerBounds.height + particle.size) {
                particle.y = -particle.size;
            }
        }
    }

    /**
     * Update particle interaction with mouse
     */
    updateParticleInteraction(particle) {
        if (!this.options.interactive) return;

        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.options.mouseRadius) {
            const force = (this.options.mouseRadius - distance) / this.options.mouseRadius;
            const angle = Math.atan2(dy, dx);
            
            // Repel particles from mouse
            particle.vx -= Math.cos(angle) * force * this.options.mouseForce;
            particle.vy -= Math.sin(angle) * force * this.options.mouseForce;
            
            // Enhance opacity near mouse
            particle.opacity = Math.min(1, particle.baseOpacity + force * 0.5);
        } else {
            // Restore base opacity
            particle.opacity = particle.baseOpacity;
        }
    }

    /**
     * Update particle properties
     */
    updateParticleProperties(particle) {
        // Update rotation
        particle.rotation += particle.rotationSpeed;
        
        // Update life (if used)
        if (particle.life < particle.maxLife) {
            particle.life += 0.01;
        }
        
        // Damping
        particle.vx *= 0.998;
        particle.vy *= 0.998;
    }

    /**
     * Draw all particles
     */
    drawParticles() {
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
    }

    /**
     * Draw a single particle
     */
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);

        switch (particle.shape) {
            case 'circle':
                this.drawCircle(particle.size);
                break;
            case 'square':
                this.drawSquare(particle.size);
                break;
            case 'triangle':
                this.drawTriangle(particle.size);
                break;
        }

        this.ctx.restore();
    }

    /**
     * Draw circle shape
     */
    drawCircle(size) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Draw square shape
     */
    drawSquare(size) {
        this.ctx.fillRect(-size, -size, size * 2, size * 2);
    }

    /**
     * Draw triangle shape
     */
    drawTriangle(size) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(-size, size);
        this.ctx.lineTo(size, size);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Draw connections between nearby particles
     */
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];

                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.options.connectionDistance) {
                    const alpha = 1 - (distance / this.options.connectionDistance);
                    this.ctx.globalAlpha = alpha * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    /**
     * Add more particles
     */
    addParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    /**
     * Remove particles
     */
    removeParticles(count) {
        this.particles.splice(0, count);
    }

    /**
     * Update configuration
     */
    updateConfig(newOptions) {
        Object.assign(this.options, newOptions);
    }

    /**
     * Destroy the particle system
     */
    destroy() {
        this.stop();
        
        // Remove event listeners
        if (this.options.interactive) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
        }
        window.removeEventListener('resize', this.handleResize);
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear particles
        this.particles = [];
        
        console.log('ParticleSystem destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}