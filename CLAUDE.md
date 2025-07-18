# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a premium e-commerce display website built with vanilla HTML, CSS, and JavaScript. The site features a modern Apple-inspired design with parallax scrolling, interactive product cards, and smooth animations. It showcases products across multiple categories with flipping product cards and advanced visual effects.

## Architecture

### Core Structure
- **index.html**: Landing page with hero section, featured products, and parallax scrolling
- **store.html**: Product catalog with filtering, sorting, and flipping product cards
- **about.html**: Simple about page with company information
- **styling.css**: Comprehensive styles including Apple-inspired design system and parallax effects
- **script.js**: Main JavaScript file containing product data, filtering logic, and page initialization

### Component System
- **components/parallax-controller.js**: Class-based parallax scrolling system with performance optimization
- **components/product-showcase.js**: Featured product display component with animations
- **assets/data/featured-products.json**: Product data for home page featured sections

### Design System
- Apple-inspired typography using SF Pro Display font stack
- Color variables defined in CSS custom properties (--apple-white, --apple-blue, etc.)
- Responsive design with mobile-first approach
- Smooth transitions and cubic-bezier easing functions
- Support for reduced motion accessibility

## Key Features

### Interactive Product Cards
- Flip animation on click (store page)
- Hover effects with transform and shadow
- Category-specific color schemes
- Emoji-based product icons
- Detailed product information on card backs

### Parallax Effects
- Hardware-accelerated transforms using translate3d
- Intersection Observer for performance optimization
- Configurable speed and direction settings
- Automatic cleanup and memory management

### Product Management
- Hardcoded product data in script.js (lines 1-110)
- Category-based filtering system
- Multiple sorting options (price, name, newest, featured)
- URL parameter support for direct product navigation

## Development Workflow

### No Build Process
This is a static website that runs directly in the browser without any build tools or package managers. Simply open `index.html` in a web browser or serve the files with a local HTTP server.

### Local Development
```bash
# Serve with Python 3
python -m http.server 8000

# Serve with Node.js http-server
npx http-server -p 8000

# Serve with PHP
php -S localhost:8000
```

### Testing
- Manual testing in browser
- No automated test framework
- Test responsive design across different screen sizes
- Verify parallax effects work smoothly
- Check accessibility features (reduced motion support)

## Code Organization

### Product Data Structure
Products are defined in `script.js` with the following schema:
```javascript
{
    id: number,
    category: string,
    title: string,
    description: string,
    price: string,
    priceValue: number,
    icon: string, // Emoji
    colors: array,
    features: array,
    dateAdded: Date
}
```

### CSS Architecture
- Global resets and base styles
- Nike-inspired store page styles (lines 14-437)
- Apple-inspired home page styles (lines 438-1058)
- About page styles (lines 1059-1464)
- Extensive responsive breakpoints

### JavaScript Initialization
- Automatic page detection based on CSS classes and DOM elements
- Separate initialization paths for home and store pages
- Event listener management with proper cleanup
- Intersection Observer for performance-optimized animations

## Important Notes

### Performance Considerations
- Parallax effects use `will-change: transform` for optimization
- Hardware acceleration with translate3d transforms
- Intersection Observer prevents unnecessary calculations
- RequestAnimationFrame for smooth scrolling

### Browser Compatibility
- Modern browsers with ES6+ support required
- Intersection Observer API required (polyfill may be needed for older browsers)
- CSS custom properties required
- Flexbox and Grid layout used extensively

### Accessibility
- Reduced motion support via CSS media queries
- Semantic HTML structure
- Keyboard navigation support
- Alt text for images (where applicable)