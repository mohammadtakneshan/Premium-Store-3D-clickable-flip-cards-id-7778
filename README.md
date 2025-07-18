# Premium Store 3D

A modern, interactive 3D e-commerce website showcasing premium products with advanced visual effects and smooth animations.

## 🌟 Features

- **3D Product Cards**: Interactive product cards with flip animations and hover effects
- **Advanced Parallax Scrolling**: Multi-layer parallax effects with smooth scrolling
- **Interactive Particle System**: Dynamic floating particles with mouse interaction
- **Responsive Design**: Optimized for all screen sizes and devices
- **Product Showcase**: Featured products with detailed specifications
- **Shopping Cart System**: Complete cart functionality with toast notifications
- **Modal System**: Product details in elegant modal windows
- **Mouse Parallax**: Elements that respond to mouse movement for enhanced interactivity

## 🚀 Getting Started

1. Clone or download the project
2. Open the project folder in VS Code
3. Run the preview server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open `http://localhost:8000` in your browser

## 📁 Project Structure

```
├── index.html          # Homepage with hero section and featured products
├── store.html          # Main store with product catalog
├── about.html          # About page
├── styling.css         # Main CSS with 3D animations and effects
├── script.js           # Core JavaScript functionality
├── assets/
│   └── data/
│       └── featured-products.json  # Product data
└── components/
    ├── parallax-controller.js      # Advanced parallax effects
    ├── particle-system.js          # Interactive particle animations
    ├── cart-system.js              # Shopping cart functionality
    ├── modal-system.js             # Product detail modals
    ├── mouse-parallax-controller.js # Mouse-responsive animations
    └── [other components]
```

## 🎨 Technologies Used

- **HTML5/CSS3**: Modern web standards with CSS Grid and Flexbox
- **Vanilla JavaScript**: ES6+ features with modular component architecture
- **CSS 3D Transforms**: Hardware-accelerated 3D animations
- **Intersection Observer API**: Performance-optimized scroll effects
- **JSON**: Dynamic product data management

## 💫 Key Components

- **ParallaxController**: Manages smooth scroll-based animations
- **ParticleSystem**: Creates interactive floating particle effects
- **CartSystem**: Handles shopping cart operations
- **ModalSystem**: Product detail overlays
- **ProductShowcase**: Dynamic product card generation

## 🛍️ Product Categories

The store features premium products across multiple categories:
- Electronics (Headphones, Smart Watches)
- Travel & Lifestyle (Luxury Backpacks)
- And more premium items

## 🎯 Performance Features

- Adaptive frame rate detection for smooth animations
- Performance monitoring and optimization
- Reduced motion support for accessibility
- Throttled scroll events for better performance

This project demonstrates modern web development techniques with a focus on user experience, performance, and visual appeal.
