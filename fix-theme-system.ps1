# Fix all pages to use theme system
$pages = @(
    "training-videos\index.html",
    "sms\index.html", 
    "shop\index.html",
    "news\index.html",
    "mywebropol\index.html",
    "mywebropol\library.html"
)

$rootPath = "c:\Users\ali.a-zuhairi\OneDrive - Webropol Oy\Documents\GitHub Work\webropol\"

foreach ($page in $pages) {
    $fullPath = Join-Path $rootPath $page
    if (Test-Path $fullPath) {
        Write-Host "Fixing: $page" -ForegroundColor Green
        
        # Read content
        $content = Get-Content $fullPath -Raw
        
        # Add theme-manager import if not already present
        if ($content -notmatch 'theme-manager\.js') {
            $content = $content -replace '(<script src="[^"]*FloatingButton\.js" type="module"></script>)', '$1`n    <script src="../design-system/utils/theme-manager.js" type="module"></script>'
        }
        
        # Replace hardcoded body background
        $content = $content -replace '<body class="bg-sun-to-br[^"]*"[^>]*>', '<body'
        $content = $content -replace 'style="background-color: #ebf4f7;"', ''
        
        # Enable theme selector in header if webropol-header is present
        $content = $content -replace '(<webropol-header[^>]*show-user-menu="true")([^>]*>)', '$1 show-theme-selector="true"$2'
        
        # Replace bg-sun-to-br with bg-gradient-to-br
        $content = $content -replace 'bg-sun-to-br', 'bg-gradient-to-br'
        
        # Add theme change listener if script section exists
        if ($content -match '</script>\s*</body>' -and $content -notmatch 'theme-changed') {
            $content = $content -replace '(</script>)(\s*</body>)', @"

        // Listen for theme changes
        document.addEventListener('DOMContentLoaded', function() {
            document.addEventListener('theme-changed', function(e) {
                console.log('Theme changed to:', e.detail.theme);
            });
        });
    $1$2
"@
        }
        
        # Write content back
        $content | Set-Content $fullPath -NoNewline
        
        Write-Host "  ✓ Fixed theme system integration" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ File not found: $fullPath" -ForegroundColor Red
    }
}

Write-Host "`nTheme system integration complete!" -ForegroundColor Cyan
