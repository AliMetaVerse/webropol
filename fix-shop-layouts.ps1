# PowerShell script to fix shop page layouts for better space utilization and sidebar alignment

$shopPath = "c:\Users\ali.a-zuhairi\OneDrive - Webropol Oy\Documents\GitHub Work\webropol\shop\products"
$files = @(
    "analytics.html",
    "case-management.html", 
    "direct-mobile-feedback.html",
    "direct.html",
    "etest.html",
    "wott.html"
)

# Old layout pattern to replace
$oldPattern = @'
  <div class="flex min-h-screen">
    <div class="flex-1 flex flex-col">
      <webropol-header username="Ali Al-Zuhairi" show-notifications="true" show-help="true" show-user-menu="true"></webropol-header>
      
      <div class="flex">
        <shop-sidebar></shop-sidebar>
        
        <section class="flex-1 px-6 py-8">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl mb-6">
            <webropol-breadcrumbs trail='[{"label":"Home","url":"../../index.html"},{"label":"Shop","url":"../index.html"}
'@

# New layout pattern
$newPattern = @'
  <div class="flex h-screen">
    <div class="flex-1 flex flex-col overflow-hidden xl:ml-0 ml-0">
      <webropol-header username="Ali Al-Zuhairi" show-notifications="true" show-help="true" show-user-menu="true"></webropol-header>
      
      <div class="bg-white/70 backdrop-blur-sm border-b border-white/20">
        <webropol-breadcrumbs trail='[{"label":"Home","url":"../../index.html"},{"label":"Shop","url":"../index.html"}
'@

# Second pattern for closing tags
$oldClosing = @'
        </section>
      </div>
    </div>
  </div>
'@

$newClosing = @'
        </div>
      </main>
    </div>
  </div>
'@

foreach ($file in $files) {
    $filePath = Join-Path $shopPath $file
    if (Test-Path $filePath) {
        Write-Host "Processing $file..."
        
        $content = Get-Content $filePath -Raw
        
        # Replace the opening layout structure
        if ($content -match 'flex min-h-screen.*?webropol-breadcrumbs') {
            # Find the specific section to replace more carefully
            $content = $content -replace [regex]::Escape('<div class="flex min-h-screen">'), '<div class="flex h-screen">'
            $content = $content -replace [regex]::Escape('<div class="flex-1 flex flex-col">'), '<div class="flex-1 flex flex-col overflow-hidden xl:ml-0 ml-0">'
            $content = $content -replace [regex]::Escape('<div class="flex">'), '<div class="bg-white/70 backdrop-blur-sm border-b border-white/20">'
            $content = $content -replace [regex]::Escape('<shop-sidebar></shop-sidebar>'), ''
            $content = $content -replace [regex]::Escape('<section class="flex-1 px-6 py-8">'), '<main class="flex-1 overflow-y-auto">'
            $content = $content -replace [regex]::Escape('<div class="bg-white/70 backdrop-blur-sm rounded-2xl mb-6">'), ''
            $content = $content -replace [regex]::Escape('</div>'), '</div>'
            
            # Add the new structure
            $content = $content -replace 'webropol-breadcrumbs.*?</div>', @'
webropol-breadcrumbs trail='[{"label":"Home","url":"../../index.html"},{"label":"Shop","url":"../index.html"},"Product"}}]'></webropol-breadcrumbs>
      </div>
      
      <main class="flex-1 overflow-y-auto">
        <div class="flex gap-6 h-full">
          <!-- Shop Sidebar -->
          <div class="hidden lg:block">
            <shop-sidebar></shop-sidebar>
          </div>
          
          <!-- Main Content -->
          <div class="flex-1 min-w-0 px-4 lg:px-6 py-6">
'@
            
            # Replace closing structure
            $content = $content -replace [regex]::Escape('</section>'), '</div>'
            $content = $content -replace [regex]::Escape('</div>') + '\s*</div>\s*</div>', @'
          </div>
        </div>
      </main>
    </div>
  </div>
'@
        }
        
        Set-Content $filePath $content -Encoding UTF8
        Write-Host "Updated $file successfully"
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "All shop product pages have been updated with improved layouts!" -ForegroundColor Green
