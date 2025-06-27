# How to Run the Design System Demo

The design system uses ES6 modules which require a web server to work properly due to browser security restrictions.

## Quick Setup Options

### Option 1: VS Code Live Server (Recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click on `demo.html` and select "Open with Live Server"
3. The demo will open at `http://localhost:5500/demo.html`

### Option 2: Python HTTP Server
```bash
# Navigate to the design-system folder
cd design-system

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000/demo.html
```

### Option 3: Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to design-system folder and run
cd design-system
http-server -p 8000

# Then open: http://localhost:8000/demo.html
```

### Option 4: PHP Server (if you have PHP installed)
```bash
cd design-system
php -S localhost:8000

# Then open: http://localhost:8000/demo.html
```

## Why is this needed?

- **ES6 Modules**: The design system uses `import/export` statements
- **CORS Policy**: Browsers block loading local modules via `file://` protocol
- **Security**: Modern browsers require proper HTTP headers for module loading

## Troubleshooting

### If you see "nested" or stacked cards:
- ✅ **Cause**: The web components haven't loaded properly
- ✅ **Solution**: Use one of the server options above

### If you see console errors about modules:
- Check that all file paths are correct
- Ensure you're accessing via `http://` not `file://`
- Check browser console for specific error messages

### If components show fallback styling:
- The design system will show a warning message
- This indicates the JavaScript modules aren't loading
- Follow the server setup instructions above

## File Structure Check

Make sure your design-system folder has this structure:
```
design-system/
├── demo.html           ← Open this file
├── index.js            ← Main entry point
├── components/         ← Component files
├── styles/            ← CSS files
└── utils/             ← Utility files
```

## Success Indicators

When working properly, you should see:
- ✅ Cards displayed side by side in a grid
- ✅ Interactive buttons with hover effects
- ✅ Console message: "Design system loaded successfully!"
- ✅ Working theme toggle, modals, and other interactive elements
