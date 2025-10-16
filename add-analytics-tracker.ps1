# PowerShell Script to Add Global Analytics Tracker to All HTML Pages
# This script adds the analytics tracker script tag before the closing </head> tag in all HTML files

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Global Analytics Tracker Installer" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script's directory (workspace root)
$rootPath = $PSScriptRoot

# Define the analytics script tag to insert
$analyticsScriptTag = @"
    
    <!-- Global Analytics Tracker -->
    <script src="../scripts/analytics-global-tracker.js"></script>
"@

# For root-level HTML files
$analyticsScriptTagRoot = @"
    
    <!-- Global Analytics Tracker -->
    <script src="scripts/analytics-global-tracker.js"></script>
"@

# Directories to process
$directories = @(
    "surveys",
    "events",
    "dashboards",
    "shop",
    "mywebropol",
    "news",
    "training-videos",
    "sms",
    "exw",
    "webroai",
    "admin-tools",
    "case-management",
    "promo",
    "create",
    "examples",
    "misc",
    "surveys\create",
    "surveys\collect",
    "shop\products"
)

# Files to skip (already have the tracker or should not be modified)
$skipFiles = @(
    "cp.html",  # Already has tracker
    "login.html",  # Login pages usually don't need tracking
    "analytics-monitor.html",  # Analytics dashboard itself
    "analytics-integration-snippet.html",  # Documentation
    "spa-diagnostic.html",  # Diagnostic tool
    "404.html"  # Error page
)

# Counter for tracking progress
$totalProcessed = 0
$totalSkipped = 0
$totalErrors = 0
$filesModified = @()

function Add-AnalyticsTracker {
    param(
        [string]$filePath,
        [string]$scriptTag
    )
    
    try {
        # Read the file content
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        # Check if analytics tracker is already present
        if ($content -match "analytics-global-tracker\.js") {
            Write-Host "  [SKIP] Already has tracker: $filePath" -ForegroundColor Yellow
            return "skipped"
        }
        
        # Check if file has </head> tag
        if ($content -notmatch "</head>") {
            Write-Host "  [SKIP] No </head> tag found: $filePath" -ForegroundColor Yellow
            return "skipped"
        }
        
        # Insert the analytics script before </head>
        $newContent = $content -replace "</head>", "$scriptTag`r`n</head>"
        
        # Write the modified content back to the file
        Set-Content -Path $filePath -Value $newContent -Encoding UTF8 -NoNewline
        
        Write-Host "  [OK] Added tracker: $filePath" -ForegroundColor Green
        return "modified"
        
    } catch {
        Write-Host "  [ERROR] Failed to process: $filePath - $_" -ForegroundColor Red
        return "error"
    }
}

# Process root-level HTML files (special case)
Write-Host "`nProcessing root-level HTML files..." -ForegroundColor Cyan
Write-Host "------------------------------------" -ForegroundColor Cyan

$rootHtmlFiles = Get-ChildItem -Path $rootPath -Filter "*.html" -File | Where-Object {
    $skipFiles -notcontains $_.Name -and $_.Name -ne "index.html"  # index.html already done
}

foreach ($file in $rootHtmlFiles) {
    $result = Add-AnalyticsTracker -filePath $file.FullName -scriptTag $analyticsScriptTagRoot
    
    switch ($result) {
        "modified" { $totalProcessed++; $filesModified += $file.FullName }
        "skipped" { $totalSkipped++ }
        "error" { $totalErrors++ }
    }
}

# Process subdirectories
foreach ($dir in $directories) {
    $fullPath = Join-Path -Path $rootPath -ChildPath $dir
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "`n[SKIP] Directory not found: $dir" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "`nProcessing: $dir" -ForegroundColor Cyan
    Write-Host "------------------------------------" -ForegroundColor Cyan
    
    # Get all HTML files in the directory
    $htmlFiles = Get-ChildItem -Path $fullPath -Filter "*.html" -File
    
    foreach ($file in $htmlFiles) {
        # Skip files in the skip list
        if ($skipFiles -contains $file.Name) {
            Write-Host "  [SKIP] Excluded file: $($file.Name)" -ForegroundColor Yellow
            $totalSkipped++
            continue
        }
        
        $result = Add-AnalyticsTracker -filePath $file.FullName -scriptTag $analyticsScriptTag
        
        switch ($result) {
            "modified" { $totalProcessed++; $filesModified += $file.FullName }
            "skipped" { $totalSkipped++ }
            "error" { $totalErrors++ }
        }
    }
}

# Summary
Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "  ✅ Files Modified: $totalProcessed" -ForegroundColor Green
Write-Host "  ⏭️  Files Skipped:  $totalSkipped" -ForegroundColor Yellow
Write-Host "  ❌ Errors:         $totalErrors" -ForegroundColor Red
Write-Host ""

if ($filesModified.Count -gt 0) {
    Write-Host "Modified Files:" -ForegroundColor White
    $filesModified | ForEach-Object {
        $relativePath = $_.Replace($rootPath, "").TrimStart("\")
        Write-Host "  • $relativePath" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open any page in your browser (e.g., surveys/index.html)" -ForegroundColor White
Write-Host "  2. Press F12 to open Developer Console" -ForegroundColor White
Write-Host "  3. Look for: [Global Analytics] Initialized" -ForegroundColor White
Write-Host "  4. Visit multiple pages to generate analytics data" -ForegroundColor White
Write-Host "  5. Open cp/cp.html and go to Analytics tab to see all tracked pages" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: docs/GLOBAL-ANALYTICS-COMPLETE.md" -ForegroundColor Gray
Write-Host ""
