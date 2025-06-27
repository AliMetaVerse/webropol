/**
 * Webropol Cards - Simple HTML/CSS/JS Loader
 * Load this file to get all card components without build process
 */

// Import utilities first (required for components to work)
import './utils/base-component.js';
import './utils/theme-utils.js'; 
import './utils/accessibility.js';

// Import all card components
import './components/cards/Card.js';
import './components/cards/ActionCard.js';
import './components/cards/ListCard.js';
import './components/cards/VideoCard.js';
import './components/cards/ConfigurableCard.js';

// Confirm loading
console.log('🎉 Webropol Cards loaded successfully!');
console.log('Available components:');
console.log('- <webropol-card>');
console.log('- <webropol-action-card>');
console.log('- <webropol-list-card>');
console.log('- <webropol-video-card>');
console.log('- <webropol-configurable-card>');

// Optional: Add some global utilities
window.WebropolCards = {
  version: '2025.06.27',
  components: [
    'webropol-card',
    'webropol-action-card', 
    'webropol-list-card',
    'webropol-video-card',
    'webropol-configurable-card'
  ],
  
  // Helper function to check if components are loaded
  isLoaded: () => {
    return window.WebropolCards.components.every(
      component => customElements.get(component)
    );
  }
};
