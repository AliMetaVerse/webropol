/**
 * Accessibility Utilities
 * Helper functions for accessibility features
 */

export class AccessibilityUtils {
  /**
   * Announce to screen readers
   */
  static announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  /**
   * Trap focus within an element
   */
  static trapFocus(element, event) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  /**
   * Check if element is visible to screen readers
   */
  static isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.getAttribute('aria-hidden') !== 'true';
  }

  /**
   * Generate unique ID for accessibility
   */
  static generateId(prefix = 'webropol-a11y') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set up keyboard navigation for a list
   */
  static setupListNavigation(container, itemSelector = '[role="menuitem"], [role="option"], button, a') {
    const items = container.querySelectorAll(itemSelector);
    
    items.forEach((item, index) => {
      item.addEventListener('keydown', (event) => {
        let targetIndex = index;
        
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            targetIndex = (index + 1) % items.length;
            break;
          
          case 'ArrowUp':
            event.preventDefault();
            targetIndex = index === 0 ? items.length - 1 : index - 1;
            break;
          
          case 'Home':
            event.preventDefault();
            targetIndex = 0;
            break;
          
          case 'End':
            event.preventDefault();
            targetIndex = items.length - 1;
            break;
          
          default:
            return;
        }
        
        items[targetIndex].focus();
      });
    });
  }

  /**
   * Add skip link for keyboard navigation
   */
  static addSkipLink(targetId, text = 'Skip to main content') {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-webropol-teal-600 focus:text-white focus:rounded-lg';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Check color contrast and warn if insufficient
   */
  static checkContrast(foreground, background, element) {
    // This would integrate with the theme utils contrast checker
    const ratio = this.getContrastRatio?.(foreground, background) || 1;
    
    if (ratio < 4.5) {
      console.warn(`Low contrast ratio (${ratio.toFixed(2)}) detected on element:`, element);
      console.warn(`Consider using colors with better contrast for accessibility.`);
    }
  }

  /**
   * Add high contrast mode detection
   */
  static detectHighContrast() {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };
    
    mediaQuery.addListener(handleChange);
    handleChange(mediaQuery);
  }

  /**
   * Add reduced motion detection
   */
  static detectReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };
    
    mediaQuery.addListener(handleChange);
    handleChange(mediaQuery);
  }

  /**
   * Initialize accessibility features
   */
  static initialize() {
    this.detectHighContrast();
    this.detectReducedMotion();
    
    // Add main content skip link if main element exists
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
      this.addSkipLink('main-content');
    }
  }
}
