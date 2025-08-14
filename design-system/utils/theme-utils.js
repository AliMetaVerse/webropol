/**
 * Theme Utility Functions
 * Helper functions for theme management and customization
 */

import { designTokens } from '../styles/tokens.js';

export class ThemeUtils {
  /**
   * Get color value from design tokens
   */
  static getColor(colorPath, fallback = '#000000') {
    const paths = colorPath.split('.');
    let value = designTokens.colors;
    
    for (const path of paths) {
      value = value?.[path];
    }
    
    return value || fallback;
  }

  /**
   * Generate CSS custom properties from design tokens
   */
  static generateCSSCustomProperties() {
    const cssVars = [];
    
    // Colors
    Object.entries(designTokens.colors).forEach(([colorName, shades]) => {
      if (typeof shades === 'object') {
        Object.entries(shades).forEach(([shade, value]) => {
          cssVars.push(`--webropol-${colorName}-${shade}: ${value};`);
        });
      } else {
        cssVars.push(`--webropol-${colorName}: ${shades};`);
      }
    });

    // Typography
    Object.entries(designTokens.typography.fontSize).forEach(([size, value]) => {
      cssVars.push(`--font-size-${size}: ${value};`);
    });

    // Spacing
    Object.entries(designTokens.spacing).forEach(([size, value]) => {
      cssVars.push(`--spacing-${size}: ${value};`);
    });

    return `:root {\n  ${cssVars.join('\n  ')}\n}`;
  }

  /**
   * Apply dark theme
   */
  static applyDarkTheme() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('webropol-theme', 'dark');
  }

  /**
   * Apply light theme
   */
  static applyLightTheme() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('webropol-theme', 'light');
  }

  /**
   * Toggle theme
   */
  static toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      this.applyLightTheme();
    } else {
      this.applyDarkTheme();
    }
  }

  /**
   * Get current theme
   */
  static getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  /**
   * Initialize theme from localStorage
   */
  static initializeTheme() {
    const savedTheme = localStorage.getItem('webropol-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  }

  /**
   * Generate Tailwind color classes
   */
  static generateTailwindColors() {
    const colors = {};
    
    Object.entries(designTokens.colors).forEach(([colorName, shades]) => {
      if (typeof shades === 'object') {
        colors[`webropol-${colorName}`] = shades;
      }
    });

    return colors;
  }

  /**
   * Validate color contrast ratio
   */
  static getContrastRatio(color1, color2) {
    const getLuminance = (color) => {
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const [rNorm, gNorm, bNorm] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check if colors meet WCAG contrast requirements
   */
  static meetsContrastRequirement(color1, color2, level = 'AA') {
    const ratio = this.getContrastRatio(color1, color2);
    return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
  }

  /**
   * Generate component theme variations
   */
  static generateComponentTheme(componentName, baseColors) {
    const theme = {
      light: {},
      dark: {}
    };

    // Generate light theme variations
    theme.light = {
      primary: baseColors.primary || this.getColor('primary.500'),
      // Use primary (teal) as the fallback for secondary to migrate away from the old blue palette
      secondary: baseColors.secondary || this.getColor('primary.500'),
      background: this.getColor('neutral.50'),
      surface: this.getColor('neutral.100'),
      text: this.getColor('neutral.900'),
      textSecondary: this.getColor('neutral.600')
    };

    // Generate dark theme variations
    theme.dark = {
      primary: baseColors.primary || this.getColor('primary.400'),
      // Use primary (teal) as the fallback for secondary in dark theme as well
      secondary: baseColors.secondary || this.getColor('primary.400'),
      background: this.getColor('neutral.900'),
      surface: this.getColor('neutral.800'),
      text: this.getColor('neutral.100'),
      textSecondary: this.getColor('neutral.300')
    };

    return theme;
  }
}
