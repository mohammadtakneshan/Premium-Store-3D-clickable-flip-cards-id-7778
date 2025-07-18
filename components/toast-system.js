/**
 * ToastSystem - Modern toast notification system with smooth animations
 * Handles success, error, warning, and info notifications
 */
class ToastSystem {
    constructor() {
        this.toasts = new Map();
        this.toastCounter = 0;
        this.maxToasts = 5;
        this.defaultDuration = 4000;
        
        // Initialize toast container
        this.initializeToastContainer();
    }

    /**
     * Initialize toast container
     */
    initializeToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = this.defaultDuration, options = {}) {
        const toastId = `toast-${++this.toastCounter}`;
        
        // Remove oldest toast if at limit
        if (this.toasts.size >= this.maxToasts) {
            const oldestToast = this.toasts.keys().next().value;
            this.hideToast(oldestToast);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast toast-${type}`;
        
        // Add icon based on type
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-message">${message}</div>
                ${options.showClose !== false ? `
                    <button class="toast-close" aria-label="Close notification">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                ` : ''}
            </div>
            <div class="toast-progress"></div>
        `;
        
        // Add to container
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Add event listeners
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideToast(toastId));
        }
        
        // Click to dismiss (optional)
        if (options.clickToDismiss !== false) {
            toast.addEventListener('click', () => this.hideToast(toastId));
        }
        
        // Show with animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
            
            // Start progress animation
            const progressBar = toast.querySelector('.toast-progress');
            if (progressBar && duration > 0) {
                progressBar.style.animationDuration = `${duration}ms`;
                progressBar.classList.add('animate');
            }
        });
        
        // Store toast
        this.toasts.set(toastId, {
            element: toast,
            timeout: duration > 0 ? setTimeout(() => this.hideToast(toastId), duration) : null
        });
        
        console.log('Toast shown:', toastId, type, message);
        
        return toastId;
    }

    /**
     * Hide toast
     */
    hideToast(toastId) {
        const toastData = this.toasts.get(toastId);
        if (!toastData) return;
        
        const { element, timeout } = toastData;
        
        // Clear timeout
        if (timeout) {
            clearTimeout(timeout);
        }
        
        // Hide with animation
        element.classList.remove('show');
        element.classList.add('hide');
        
        setTimeout(() => {
            element.remove();
            this.toasts.delete(toastId);
        }, 300);
        
        console.log('Toast hidden:', toastId);
    }

    /**
     * Show success toast
     */
    showSuccess(message, duration, options) {
        return this.showToast(message, 'success', duration, options);
    }

    /**
     * Show error toast
     */
    showError(message, duration, options) {
        return this.showToast(message, 'error', duration, options);
    }

    /**
     * Show warning toast
     */
    showWarning(message, duration, options) {
        return this.showToast(message, 'warning', duration, options);
    }

    /**
     * Show info toast
     */
    showInfo(message, duration, options) {
        return this.showToast(message, 'info', duration, options);
    }

    /**
     * Show loading toast
     */
    showLoading(message, options = {}) {
        const toastId = this.showToast(message, 'loading', 0, { 
            showClose: false, 
            clickToDismiss: false,
            ...options 
        });
        
        // Add loading animation
        const toast = document.getElementById(toastId);
        if (toast) {
            const icon = toast.querySelector('.toast-icon');
            if (icon) {
                icon.classList.add('loading-spin');
            }
        }
        
        return toastId;
    }

    /**
     * Update loading toast to success/error
     */
    updateLoadingToast(toastId, message, type = 'success', duration = this.defaultDuration) {
        const toastData = this.toasts.get(toastId);
        if (!toastData) return;
        
        const { element } = toastData;
        const messageEl = element.querySelector('.toast-message');
        const iconEl = element.querySelector('.toast-icon');
        const progressBar = element.querySelector('.toast-progress');
        
        if (messageEl) messageEl.textContent = message;
        if (iconEl) {
            iconEl.innerHTML = this.getToastIcon(type);
            iconEl.classList.remove('loading-spin');
        }
        
        // Update class
        element.className = `toast toast-${type} show`;
        
        // Start progress animation
        if (progressBar && duration > 0) {
            progressBar.style.animationDuration = `${duration}ms`;
            progressBar.classList.add('animate');
        }
        
        // Set timeout to hide
        if (duration > 0) {
            const timeout = setTimeout(() => this.hideToast(toastId), duration);
            this.toasts.set(toastId, { element, timeout });
        }
    }

    /**
     * Get icon for toast type
     */
    getToastIcon(type) {
        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
                <circle cx="12" cy="12" r="10"></circle>
            </svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
                <path d="M12 2l10 18H2L12 2z"></path>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
            </svg>`,
            loading: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4"></path>
                <path d="M12 18v4"></path>
                <path d="M4.93 4.93l2.83 2.83"></path>
                <path d="M16.24 16.24l2.83 2.83"></path>
                <path d="M2 12h4"></path>
                <path d="M18 12h4"></path>
                <path d="M4.93 19.07l2.83-2.83"></path>
                <path d="M16.24 7.76l2.83-2.83"></path>
            </svg>`
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Clear all toasts
     */
    clearAll() {
        this.toasts.forEach((toastData, toastId) => {
            this.hideToast(toastId);
        });
    }

    /**
     * Destroy toast system
     */
    destroy() {
        this.clearAll();
        const container = document.getElementById('toast-container');
        if (container) {
            container.remove();
        }
        
        console.log('ToastSystem destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToastSystem;
}