const products = [
    {
        id: 1,
        category: 'electronics',
        title: 'Wireless Headphones Pro',
        description: 'Premium noise-canceling headphones',
        price: 'AED 1,099',
        priceValue: 1099,
        icon: '🎧',
        colors: ['#000000', '#ffffff', '#ff0000'],
        features: ['Active Noise Cancellation', '30-hour battery life', 'Premium leather finish', 'Hi-Res Audio certified', 'Quick charge technology'],
        dateAdded: new Date('2025-01-15')
    },
    {
        id: 2,
        category: 'property',
        title: 'Luxury Penthouse',
        description: 'Premium downtown penthouse',
        price: 'AED 9,200,000',
        priceValue: 9200000,
        icon: '🏢',
        colors: ['#8b4513', '#d2691e', '#f4a460'],
        features: ['360° city views', '3 bedrooms, 2 bathrooms', 'Private rooftop terrace', 'Smart home integration', 'Concierge services'],
        dateAdded: new Date('2025-02-01')
    },
    {
        id: 3,
        category: 'household',
        title: 'Smart Coffee Maker',
        description: 'Intelligent brewing system',
        price: 'AED 729',
        priceValue: 729,
        icon: '☕',
        colors: ['#000000', '#c0c0c0', '#8b4513'],
        features: ['WiFi connectivity', 'Custom brew profiles', 'Built-in grinder', 'Temperature control', 'Mobile app control'],
        dateAdded: new Date('2025-01-20')
    },
    {
        id: 4,
        category: 'fashion',
        title: 'Designer Sneakers',
        description: 'Limited edition premium sneakers',
        price: 'AED 1,279',
        priceValue: 1279,
        icon: '👟',
        colors: ['#ffffff', '#000000', '#ff0000'],
        features: ['Italian leather construction', 'Limited edition design', 'Comfort cushioning', 'Handcrafted details', 'Premium packaging'],
        dateAdded: new Date('2025-02-10')
    },
    {
        id: 5,
        category: 'sports',
        title: 'Pro Gaming Chair',
        description: 'Ergonomic gaming chair',
        price: 'AED 2,199',
        priceValue: 2199,
        icon: '🪑',
        colors: ['#000000', '#ff0000', '#0000ff'],
        features: ['Lumbar support system', '4D armrests', 'Premium PU leather', 'Height adjustment', 'Tilt mechanism'],
        dateAdded: new Date('2025-01-25')
    },
    {
        id: 6,
        category: 'automotive',
        title: 'Smart Car Charger',
        description: 'Fast-charging car adapter',
        price: 'AED 329',
        priceValue: 329,
        icon: '🔌',
        colors: ['#000000', '#c0c0c0', '#ffffff'],
        features: ['Quick Charge 3.0', 'Dual USB-C ports', 'LED power indicator', 'Overcharge protection', 'Universal compatibility'],
        dateAdded: new Date('2025-01-30')
    },
    {
        id: 7,
        category: 'electronics',
        title: 'Smart Watch Ultra',
        description: 'Advanced fitness smartwatch',
        price: 'AED 1,649',
        priceValue: 1649,
        icon: '⌚',
        colors: ['#000000', '#c0c0c0', '#ffd700'],
        features: ['Heart rate monitoring', 'GPS tracking', '7-day battery life', 'Water resistant', 'Health insights'],
        dateAdded: new Date('2025-02-05')
    },
    {
        id: 8,
        category: 'household',
        title: 'Robot Vacuum Pro',
        description: 'Intelligent cleaning robot',
        price: 'AED 2,569',
        priceValue: 2569,
        icon: '🤖',
        colors: ['#000000', '#c0c0c0', '#ffffff'],
        features: ['Smart mapping', 'Auto-empty dock', 'Pet hair removal', 'Voice control', 'Schedule cleaning'],
        dateAdded: new Date('2025-01-10')
    },
    {
        id: 9,
        category: 'fashion',
        title: 'Leather Jacket',
        description: 'Handcrafted genuine leather',
        price: 'AED 3,299',
        priceValue: 3299,
        icon: '🧥',
        colors: ['#000000', '#8b4513', '#2f4f4f'],
        features: ['100% genuine leather', 'Custom tailoring', 'YKK zippers', 'Lifetime warranty', 'Premium lining'],
        dateAdded: new Date('2025-02-15')
    }
];

const categoryClasses = {
    electronics: 'card-electronics',
    property: 'card-property',
    household: 'card-household',
    fashion: 'card-fashion',
    sports: 'card-sports',
    automotive: 'card-automotive'
};

function createProductCard(product) {
    const colorOptions = product.colors.map(color => 
        `<div class="color-option" style="background-color: ${color}"></div>`
    ).join('');

    return `
        <div class="product-card ${categoryClasses[product.category]}" data-category="${product.category}">
            <div class="card-inner">
                <div class="card-front">
                    <div class="product-image">${product.icon}</div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <div class="product-title">${product.title}</div>
                        <div class="product-description">${product.description}</div>
                        <div class="product-colors">${colorOptions}</div>
                        <div class="product-price">${product.price}</div>
                    </div>
                </div>
                <div class="card-back">
                    <div class="product-image">${product.icon}</div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <div class="product-title">${product.title}</div>
                        <div class="product-description">Premium quality with attention to every detail. Designed for those who demand excellence.</div>
                        <ul class="product-features">
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <div class="product-price">${product.price}</div>
                        <button class="cta-button">Add to Bag</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let currentProducts = [...products];
let currentSort = 'featured';

function sortProducts(products, sortType) {
    const sorted = [...products];
    
    switch(sortType) {
        case 'price-low':
            return sorted.sort((a, b) => a.priceValue - b.priceValue);
        case 'price-high':
            return sorted.sort((a, b) => b.priceValue - a.priceValue);
        case 'name':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'newest':
            return sorted.sort((a, b) => b.dateAdded - a.dateAdded);
        case 'featured':
        default:
            return sorted.sort((a, b) => a.id - b.id);
    }
}

function renderProducts(productsToShow = currentProducts) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = productsToShow.map(createProductCard).join('');
    
    // Update product count
    document.getElementById('product-count').textContent = productsToShow.length;
    
    // Add click event listeners to new cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            card.classList.toggle('flipped');
        });
    });
}

function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? [...products] 
        : products.filter(product => product.category === category);
    
    currentProducts = sortProducts(filteredProducts, currentSort);
    renderProducts(currentProducts);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Detect if we're on the home page or store page
    const isHomePage = document.body.classList.contains('home-page');
    
    if (isHomePage) {
        // Initialize home page functionality
        initializeHomePage();
    } else {
        // Initialize store page functionality
        initializeStorePage();
    }
});

// Home Page Initialization
function initializeHomePage() {
    console.log('Initializing home page...');
    
    // Initialize parallax controller
    const parallaxController = new ParallaxController({
        throttleDelay: 16,
        rootMargin: '100px'
    });
    parallaxController.init();
    
    // Register parallax elements
    document.querySelectorAll('.parallax-element').forEach(element => {
        const speed = parseFloat(element.dataset.speed) || 0.5;
        parallaxController.registerElement(element, {
            speed: speed,
            startOffset: -100,
            endOffset: 100,
            property: 'translateY'
        });
    });
    
    // Initialize product showcases
    const showcase1 = new ProductShowcase('featured-products-1');
    const showcase2 = new ProductShowcase('featured-products-2');
    
    // Load and display featured products
    showcase1.init().then(() => {
        console.log('Product showcase 1 initialized');
    }).catch(error => {
        console.error('Error initializing showcase 1:', error);
    });
    
    // Initialize second showcase only if the element exists (home page)
    if (document.getElementById('featured-products-2')) {
        showcase2.init().then(() => {
            console.log('Product showcase 2 initialized');
        }).catch(error => {
            console.error('Error initializing showcase 2:', error);
        });
    }
    
    // Initialize smooth scrolling for internal links
    initializeSmoothScrolling();
    
    // Initialize scroll-triggered animations
    initializeScrollAnimations();
    
    // Store reference for cleanup if needed
    window.homePageInstances = {
        parallaxController,
        showcase1,
        showcase2
    };
}

// Store Page Initialization
function initializeStorePage() {
    console.log('Initializing store page...');
    
    currentProducts = sortProducts(products, 'featured');
    renderProducts(currentProducts);
    
    // Filter button events
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts(e.target.dataset.filter);
        });
    });

    // Sort dropdown functionality
    const sortToggle = document.getElementById('sort-toggle');
    const sortDropdown = document.getElementById('sort-dropdown');
    const sortLabel = document.getElementById('sort-label');

    if (sortToggle && sortDropdown && sortLabel) {
        sortToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sortDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            sortDropdown.classList.remove('active');
        });

        // Sort option selection
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Update selected option
                document.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // Update sort type and label
                currentSort = option.dataset.sort;
                sortLabel.textContent = option.textContent;
                
                // Apply sorting to current products
                currentProducts = sortProducts(currentProducts, currentSort);
                renderProducts(currentProducts);
                
                // Close dropdown
                sortDropdown.classList.remove('active');
            });
        });
    }
    
    // Check for product parameter in URL (from home page navigation)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
        // Find and highlight the specific product
        highlightProduct(productId);
    }
}

// Smooth scrolling for internal navigation
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.home-nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with smooth-enter class
    document.querySelectorAll('.smooth-enter').forEach(el => {
        observer.observe(el);
    });
}

// Highlight specific product (for navigation from home page)
function highlightProduct(productId) {
    setTimeout(() => {
        const productCard = document.querySelector(`[data-id="${productId}"]`);
        if (productCard) {
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add glowing effect with blue color to match Apple theme
            productCard.style.transform = 'scale(1.02)';
            productCard.style.boxShadow = '0 0 30px rgba(0, 122, 255, 0.6), 0 0 60px rgba(0, 122, 255, 0.4)';
            productCard.style.border = '2px solid rgba(0, 122, 255, 0.8)';
            productCard.style.borderRadius = '12px';
            
            // Remove effect after 4 seconds
            setTimeout(() => {
                productCard.style.transform = '';
                productCard.style.boxShadow = '';
                productCard.style.border = '';
                productCard.style.borderRadius = '';
            }, 4000);
        }
    }, 500);
}

// Enhanced Animation Systems
function initializeEnhancedAnimations() {
    // Add scroll-based scale and rotation effects
    const scrollElements = document.querySelectorAll('.enhanced-scroll');
    
    window.addEventListener('scroll', () => {
        scrollElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const screenCenter = window.innerHeight / 2;
            const distance = Math.abs(elementCenter - screenCenter);
            const maxDistance = window.innerHeight / 2;
            const proximity = Math.max(0, 1 - distance / maxDistance);
            
            // Apply scaling based on proximity to screen center
            const scale = 0.95 + (proximity * 0.05);
            element.style.transform = `scale(${scale})`;
        });
    }, { passive: true });
}

function initializeMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    
    magneticButtons.forEach(button => {
        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            }
        };
        
        const handleMouseLeave = () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        };
        
        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);
    });
}

function initializeScrollProgressIndicator() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        progressFill.style.width = `${scrollProgress * 100}%`;
    }, { passive: true });
}

function initializeStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-animation');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '20px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    staggerContainers.forEach(container => {
        observer.observe(container);
    });
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + distance * easeOutCubic);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = document.body.classList.contains('home-page');
    const isStorePage = document.getElementById('products-grid') !== null;
    
    if (isHomePage) {
        // Initialize home page functionality
        initializeHomePage();
        initializeScrollAnimations();
    } else if (isStorePage) {
        // Initialize store page functionality
        currentProducts = sortProducts(products, 'featured');
        renderProducts(currentProducts);
        
        // Filter button events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                filterProducts(e.target.dataset.filter);
            });
        });

        // Sort dropdown functionality
        const sortToggle = document.getElementById('sort-toggle');
        const sortDropdown = document.getElementById('sort-dropdown');
        const sortLabel = document.getElementById('sort-label');

        if (sortToggle && sortDropdown && sortLabel) {
            sortToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                sortDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                sortDropdown.classList.remove('active');
            });

            // Sort option selection
            document.querySelectorAll('.sort-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Update selected option
                    document.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    // Update sort type and label
                    currentSort = option.dataset.sort;
                    sortLabel.textContent = option.textContent;
                    
                    // Apply sorting to current products
                    currentProducts = sortProducts(currentProducts, currentSort);
                    renderProducts(currentProducts);
                    
                    // Close dropdown
                    sortDropdown.classList.remove('active');
                });
            });
        }
    }
    
    // Handle URL parameters for store navigation
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const filterParam = urlParams.get('filter');
    
    if (productParam && isStorePage) {
        highlightProduct(productParam);
    }
    
    if (filterParam && isStorePage) {
        const filterBtn = document.querySelector(`[data-filter="${filterParam}"]`);
        if (filterBtn) {
            setTimeout(() => filterBtn.click(), 100);
        }
    }
    
    console.log(`${isHomePage ? 'Home' : 'Store'} page initialized`);
});