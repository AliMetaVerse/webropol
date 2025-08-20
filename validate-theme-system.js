/**
 * Theme System Validation Script
 * Run this in the browser console to validate the theme system
 */

(function validateThemeSystem() {
  console.log('🎨 Validating Webropol Theme System...\n');

  const tests = [];

  // Test 1: Check if ThemeManager is available
  tests.push({
    name: 'ThemeManager Availability',
    test: () => {
      return new Promise((resolve) => {
        // Try to import ThemeManager
        import('./design-system/utils/theme-manager.js')
          .then(module => {
            window.ThemeManager = module.ThemeManager;
            resolve(!!module.ThemeManager);
          })
          .catch(() => resolve(false));
      });
    }
  });

  // Test 2: Check if theme styles are injected
  tests.push({
    name: 'Theme Styles Injection',
    test: () => {
      const styleEl = document.getElementById('webropol-theme-styles');
      return Promise.resolve(!!styleEl);
    }
  });

  // Test 3: Check if header component has theme selector
  tests.push({
    name: 'Header Theme Selector',
    test: () => {
      const header = document.querySelector('webropol-header');
      const themeButton = header?.querySelector('.theme-selector-btn');
      return Promise.resolve(!!themeButton);
    }
  });

  // Test 4: Check theme persistence
  tests.push({
    name: 'Theme Persistence',
    test: () => {
      if (!window.ThemeManager) return Promise.resolve(false);
      
  const originalTheme = window.ThemeManager.getCurrentTheme();
  const testTheme = originalTheme === 'warm' ? 'ocean' : 'warm';
      
      // Set theme and check if it persists
      window.ThemeManager.setTheme(testTheme);
      const newTheme = window.ThemeManager.getCurrentTheme();
      const persisted = localStorage.getItem('webropol-theme') === testTheme;
      
      // Restore original theme
      window.ThemeManager.setTheme(originalTheme);
      
      return Promise.resolve(newTheme === testTheme && persisted);
    }
  });

  // Test 5: Check background application
  tests.push({
    name: 'Background Theme Application',
    test: () => {
      if (!window.ThemeManager) return Promise.resolve(false);
      
      const body = document.body;
  const hasThemeClass = body.classList.contains('bg-sun-to-br') || 
           body.classList.contains('bg-ocean-to-br') ||
           body.classList.contains('bg-sky-to-br'); // legacy alias
      
      return Promise.resolve(hasThemeClass);
    }
  });

  // Run all tests
  async function runTests() {
    console.log('Running tests...\n');
    
    for (const test of tests) {
      try {
        const result = await test.test();
        const status = result ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${result ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      }
    }

    // Summary
    console.log('\n📊 Theme System Summary:');
    if (window.ThemeManager) {
      console.log(`Current Theme: ${window.ThemeManager.getCurrentTheme()}`);
      console.log(`Available Themes: ${Object.keys(window.ThemeManager.THEME_CONFIGS).join(', ')}`);
      console.log(`Storage: ${localStorage.getItem('webropol-theme') || 'Not Set'}`);
    }

    console.log('\n🎯 To test manually:');
    console.log('1. Look for a theme selector button in the header (palette icon)');
  console.log('2. Click it to see theme options (Warm/Ocean)');
    console.log('3. Select a theme and watch the background change');
    console.log('4. Refresh the page to see if theme persists');
  }

  // Wait a bit for modules to load, then run tests
  setTimeout(runTests, 1000);
})();
