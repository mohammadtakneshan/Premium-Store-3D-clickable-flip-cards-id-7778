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
});