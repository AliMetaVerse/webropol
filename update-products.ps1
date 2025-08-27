# PowerShell script to apply BI view style to all product pages
$productsPath = "c:\Users\ali.a-zuhairi\OneDrive - Webropol Oy\Documents\GitHub Work\webropol\shop\products"

# Define product configurations
$products = @{
    "360-assessments" = @{
        title = "360 Assessments"
        breadcrumb = "360 Assessments"
        description = "Collect multi-rater feedback to develop your people. Create comprehensive assessment programs with peer, manager, and self-evaluation capabilities."
        icon = "fal fa-sync"
        background = "#fef3f2"
        color = "orange"
        price = "€60"
        benefits = @("360°", "Multi-rater")
        benefitLabels = @("Feedback", "Assessment")
        features = @(
            @{icon="fal fa-users"; title="Multi-rater Feedback"; desc="Collect feedback from peers, managers, direct reports, and customers for comprehensive insights."},
            @{icon="fal fa-chart-radar"; title="Competency Models"; desc="Build custom competency frameworks and assessment criteria tailored to your organization."},
            @{icon="fal fa-target"; title="Development Planning"; desc="Generate personalized development plans based on assessment results and feedback."},
            @{icon="fal fa-shield-check"; title="Anonymous Feedback"; desc="Ensure honest feedback with secure, anonymous response collection and reporting."}
        )
        useCases = @(
            @{icon="fal fa-user-tie"; title="Leadership Development"; desc="Executive and manager assessment programs"},
            @{icon="fal fa-chart-line"; title="Performance Reviews"; desc="Enhanced annual review processes"}
        )
    }
    "analytics" = @{
        title = "Analytics"
        breadcrumb = "Analytics"
        description = "Transform your survey data into powerful insights. Advanced analytics and reporting capabilities for data-driven decision making."
        icon = "fal fa-chart-line"
        background = "#f0f9ff"
        color = "blue"
        price = "€75"
        benefits = @("Advanced", "Real-time")
        benefitLabels = @("Analytics", "Insights")
        features = @(
            @{icon="fal fa-chart-bar"; title="Advanced Visualizations"; desc="Create compelling charts, graphs, and interactive dashboards for your data."},
            @{icon="fal fa-filter"; title="Smart Filtering"; desc="Apply complex filters and segmentation to drill down into specific data sets."},
            @{icon="fal fa-download"; title="Export & Sharing"; desc="Export reports in multiple formats and share insights with stakeholders."},
            @{icon="fal fa-clock"; title="Real-time Updates"; desc="Get live updates as new responses come in with automatic data refresh."}
        )
        useCases = @(
            @{icon="fal fa-chart-pie"; title="Business Intelligence"; desc="Advanced data analysis and reporting"},
            @{icon="fal fa-users"; title="Market Research"; desc="Customer insight and trend analysis"}
        )
    }
    "case-management" = @{
        title = "Case Management"
        breadcrumb = "Case Management"
        description = "Streamline your workflow with intelligent case management. Track, assign, and resolve cases efficiently with automated routing."
        icon = "fal fa-tasks"
        background = "#fef2f2"
        color = "red"
        price = "€85"
        benefits = @("Automated", "Efficient")
        benefitLabels = @("Routing", "Resolution")
        features = @(
            @{icon="fal fa-route"; title="Automated Routing"; desc="Intelligently assign cases based on criteria, workload, and expertise."},
            @{icon="fal fa-clock"; title="SLA Tracking"; desc="Monitor service level agreements with automated alerts and escalations."},
            @{icon="fal fa-history"; title="Case History"; desc="Complete audit trail of all case activities, updates, and communications."},
            @{icon="fal fa-chart-line"; title="Performance Metrics"; desc="Track resolution times, satisfaction scores, and team performance."}
        )
        useCases = @(
            @{icon="fal fa-headset"; title="Customer Support"; desc="Help desk and support ticket management"},
            @{icon="fal fa-building"; title="Internal Operations"; desc="HR, IT, and facility request processing"}
        )
    }
    "direct-mobile-feedback" = @{
        title = "Direct Mobile Feedback"
        breadcrumb = "Direct Mobile"
        description = "Collect feedback instantly with mobile-optimized forms. Perfect for on-the-go data collection and real-time insights."
        icon = "fal fa-mobile-alt"
        background = "#fefce8"
        color = "yellow"
        price = "€45"
        benefits = @("Mobile", "Instant")
        benefitLabels = @("Optimized", "Collection")
        features = @(
            @{icon="fal fa-mobile"; title="Mobile Optimization"; desc="Responsive forms that work perfectly on smartphones and tablets."},
            @{icon="fal fa-bolt"; title="Instant Delivery"; desc="Send surveys via SMS, email, or QR codes for immediate response collection."},
            @{icon="fal fa-wifi"; title="Offline Capability"; desc="Collect responses even without internet connection, sync when online."},
            @{icon="fal fa-chart-line"; title="Real-time Analytics"; desc="View responses and analytics in real-time as data comes in."}
        )
        useCases = @(
            @{icon="fal fa-store"; title="Retail & Events"; desc="Customer feedback at point of sale or events"},
            @{icon="fal fa-clipboard-check"; title="Field Research"; desc="Data collection in remote or mobile settings"}
        )
    }
    "direct" = @{
        title = "Direct"
        breadcrumb = "Direct"
        description = "Simple, direct feedback collection with minimal setup. Get started quickly with streamlined survey distribution."
        icon = "fal fa-paper-plane"
        background = "#f0fdf4"
        color = "green"
        price = "€35"
        benefits = @("Simple", "Quick")
        benefitLabels = @("Setup", "Launch")
        features = @(
            @{icon="fal fa-rocket"; title="Quick Launch"; desc="Create and launch surveys in minutes with pre-built templates."},
            @{icon="fal fa-share"; title="Easy Distribution"; desc="Share surveys via email, social media, or direct links."},
            @{icon="fal fa-chart-simple"; title="Basic Analytics"; desc="Essential reporting and analytics to understand your data."},
            @{icon="fal fa-download"; title="Export Results"; desc="Download results in Excel, PDF, or CSV formats."}
        )
        useCases = @(
            @{icon="fal fa-users"; title="Small Teams"; desc="Quick feedback collection for small organizations"},
            @{icon="fal fa-lightbulb"; title="Simple Surveys"; desc="Basic questionnaires and feedback forms"}
        )
    }
    "wott" = @{
        title = "WOTT Module"
        breadcrumb = "WOTT"
        description = "Advanced workflow and task management module. Streamline processes with intelligent automation and task orchestration."
        icon = "fal fa-cog"
        background = "#faf5ff"
        color = "purple"
        price = "€90"
        benefits = @("Workflow", "Automated")
        benefitLabels = @("Management", "Tasks")
        features = @(
            @{icon="fal fa-project-diagram"; title="Workflow Designer"; desc="Visual workflow builder with drag-and-drop process design capabilities."},
            @{icon="fal fa-robot"; title="Task Automation"; desc="Automate repetitive tasks with intelligent triggers and conditions."},
            @{icon="fal fa-users-cog"; title="Team Collaboration"; desc="Coordinate team activities with shared workspaces and communication tools."},
            @{icon="fal fa-chart-gantt"; title="Progress Tracking"; desc="Monitor project progress with Gantt charts and milestone tracking."}
        )
        useCases = @(
            @{icon="fal fa-building"; title="Enterprise"; desc="Large-scale process automation and workflow management"},
            @{icon="fal fa-tasks"; title="Project Management"; desc="Complex project coordination and task management"}
        )
    }
}

# Function to create product page content
function Create-ProductPage {
    param(
        [string]$filename,
        [hashtable]$config
    )
    
    $content = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$($config.title) • Webropol Shop</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <link href="../../design-system/styles/animations.css" rel="stylesheet">
  <link href="../../design-system/styles/tokens.css" rel="stylesheet">
  <script type="module" src="../../design-system/components/navigation/Header.js"></script>
  <script type="module" src="../../design-system/components/navigation/Breadcrumbs.js"></script>
  <script type="module" src="../../design-system/utils/global-settings-manager.js"></script>
  <script type="module" src="../shop-sidebar.js"></script>
  <script src="../header-guard.js"></script>
  
  <style>
    /* Modern glass card styling */
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.25);
      box-shadow: 
        0 8px 32px rgba(6, 182, 212, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }
    
    /* Enhanced animations */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
      50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.5); }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    
    /* Gradient button styling */
    .gradient-btn {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .gradient-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    
    .gradient-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4);
    }
    
    .gradient-btn:hover::before {
      left: 100%;
    }
    
    /* Feature list styling */
    .feature-item {
      transition: all 0.3s ease;
      border-radius: 12px;
      padding: 16px;
    }
    
    .feature-item:hover {
      background: rgba(6, 182, 212, 0.05);
      transform: translateX(8px);
    }
    
    /* Pricing card styling */
    .pricing-card {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }
    
    .pricing-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      animation: pulse-glow 3s ease-in-out infinite;
    }
    
    .prose p { color: #475569; }
  </style>
</head>
<body class="min-h-screen" x-data="productStore()">
  <div class="flex min-h-screen">
    <div class="flex-1 flex flex-col">
      <webropol-header username="Ali Al-Zuhairi" show-notifications="true" show-help="true" show-user-menu="true"></webropol-header>
      
      <div class="flex">
        <shop-sidebar></shop-sidebar>
        
        <section class="flex-1 px-6 py-8">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl mb-6">
            <webropol-breadcrumbs trail='[{"label":"Home","url":"../../index.html"},{"label":"Shop","url":"../index.html"},{"label":"$($config.breadcrumb)","url":"#"}]'></webropol-breadcrumbs>
          </div>
          
          <div class="max-w-7xl mx-auto">
            <!-- Hero Section -->
            <div class="glass-card rounded-3xl p-8 mb-8 animate-fade-in-up">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background:$($config.background)">
                      <i class="$($config.icon) text-2xl text-slate-700"></i>
                    </div>
                    <div>
                      <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-900 to-$($config.color)-700 bg-clip-text text-transparent">$($config.title)</h1>
                      <p class="text-$($config.color)-600 font-medium">Professional Module</p>
                    </div>
                  </div>
                  
                  <p class="text-xl text-slate-600 mb-6 leading-relaxed">
                    $($config.description)
                  </p>
                  
                  <!-- Key Benefits -->
                  <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center p-4 glass-card rounded-2xl">
                      <div class="text-2xl font-bold text-$($config.color)-600">$($config.benefits[0])</div>
                      <div class="text-sm text-slate-600">$($config.benefitLabels[0])</div>
                    </div>
                    <div class="text-center p-4 glass-card rounded-2xl">
                      <div class="text-2xl font-bold text-$($config.color)-600">$($config.benefits[1])</div>
                      <div class="text-sm text-slate-600">$($config.benefitLabels[1])</div>
                    </div>
                  </div>
                </div>
                
                <!-- Preview Image/Video -->
                <div class="relative">
                  <div class="glass-card rounded-3xl p-6 h-80 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-24 h-24 mx-auto mb-4 rounded-3xl flex items-center justify-center" style="background:$($config.background)">
                        <i class="fal fa-play text-3xl text-slate-700"></i>
                      </div>
                      <h3 class="text-lg font-semibold text-slate-900 mb-2">Interactive Demo</h3>
                      <p class="text-slate-600 mb-4">See $($config.title) in action</p>
                      <button class="btn btn-primary">
                        <i class="fal fa-play mr-2"></i>Watch Demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Main Content -->
              <div class="lg:col-span-2 space-y-8">
                <!-- Features -->
                <div class="glass-card rounded-3xl p-8 animate-fade-in-up" style="animation-delay: 0.1s;">
                  <h2 class="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
                  <div class="grid gap-4">
"@

    # Add features
    foreach ($feature in $config.features) {
        $content += @"
                    <div class="feature-item">
                      <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background:$($config.background)">
                          <i class="$($feature.icon) text-slate-700"></i>
                        </div>
                        <div>
                          <h3 class="font-semibold text-slate-900 mb-2">$($feature.title)</h3>
                          <p class="text-slate-600 text-sm">$($feature.desc)</p>
                        </div>
                      </div>
                    </div>
                    
"@
    }

    $content += @"
                  </div>
                </div>

                <!-- Use Cases -->
                <div class="glass-card rounded-3xl p-8 animate-fade-in-up" style="animation-delay: 0.2s;">
                  <h2 class="text-2xl font-bold text-slate-900 mb-6">Perfect For</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
"@

    # Add use cases
    foreach ($useCase in $config.useCases) {
        $content += @"
                    <div class="text-center p-6 bg-white rounded-2xl">
                      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background:$($config.background)">
                        <i class="$($useCase.icon) text-slate-700 text-xl"></i>
                      </div>
                      <h3 class="font-semibold text-slate-900 mb-2">$($useCase.title)</h3>
                      <p class="text-slate-600 text-sm">$($useCase.desc)</p>
                    </div>
                    
"@
    }

    $content += @"
                  </div>
                </div>
              </div>

              <!-- Pricing Sidebar -->
              <aside class="space-y-6">
                <!-- Pricing Card -->
                <div class="pricing-card rounded-3xl p-8 text-center animate-fade-in-up" style="animation-delay: 0.3s;">
                  <h3 class="text-xl font-bold mb-2">Get Started Today</h3>
                  <div class="text-4xl font-bold mb-1">$($config.price)</div>
                  <div class="text-sm opacity-90 mb-6">per month</div>
                  
                  <!-- Company Size Information -->
                  <div class="mb-6">
                    <div class="text-left">
                      <h4 class="text-sm font-medium mb-1">Company Size</h4>
                      <div class="bg-white/20 rounded-xl p-3 text-sm">
                        <div class="font-medium mb-1">Medium Enterprise (51-200 employees)</div>
                        <div class="text-xs opacity-90">
                          Pricing is automatically determined based on your organization's profile and usage requirements.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button class="btn btn-primary w-full mb-4">
                    <i class="fal fa-shopping-cart mr-2"></i>Add to Order
                  </button>
                  
                  <div class="text-xs opacity-75">
                    <i class="fal fa-shield-check mr-1"></i>
                    30-day money-back guarantee
                  </div>
                </div>

                <!-- Contact Sales -->
                <div class="glass-card rounded-3xl p-6 text-center animate-fade-in-up" style="animation-delay: 0.4s;">
                  <div class="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background:$($config.background)">
                    <i class="fal fa-phone text-slate-700"></i>
                  </div>
                  <h3 class="font-semibold text-slate-900 mb-2">Need Custom Pricing?</h3>
                  <p class="text-slate-600 text-sm mb-4">Get in touch for enterprise discounts and custom solutions.</p>
                  <button class="btn btn-secondary w-full">
                    <i class="fal fa-envelope mr-2"></i>Contact Sales
                  </button>
                </div>

                <!-- Trust Indicators -->
                <div class="glass-card rounded-3xl p-6 animate-fade-in-up" style="animation-delay: 0.5s;">
                  <h3 class="font-semibold text-slate-900 mb-4">Why Choose $($config.title)?</h3>
                  <ul class="space-y-3 text-sm">
                    <li class="flex items-center gap-3">
                      <i class="fal fa-check-circle text-green-500"></i>
                      <span class="text-slate-700">ISO 27001 Certified</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <i class="fal fa-check-circle text-green-500"></i>
                      <span class="text-slate-700">99.9% Uptime SLA</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <i class="fal fa-check-circle text-green-500"></i>
                      <span class="text-slate-700">24/7 Expert Support</span>
                    </li>
                    <li class="flex items-center gap-3">
                      <i class="fal fa-check-circle text-green-500"></i>
                      <span class="text-slate-700">GDPR Compliant</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <script>
    function productStore() {
      return {
        init() {
          // Initialize product store
        }
      }
    }
  </script>
</body>
</html>
"@

    return $content
}

# Process each product
foreach ($productKey in $products.Keys) {
    $filename = "$productKey.html"
    $filepath = Join-Path $productsPath $filename
    
    if (Test-Path $filepath) {
        Write-Host "Updating $filename..."
        
        # Backup original
        $backupPath = Join-Path $productsPath "$productKey-old.html"
        if (-not (Test-Path $backupPath)) {
            Copy-Item $filepath $backupPath
        }
        
        # Create new content
        $newContent = Create-ProductPage -filename $filename -config $products[$productKey]
        
        # Write new content
        $newContent | Out-File -FilePath $filepath -Encoding UTF8
        
        Write-Host "✓ Updated $filename"
    }
}

Write-Host "`nAll product pages have been updated with the BI view style!"
