$root = "design-system/component-demos"
if (!(Test-Path $root)) { New-Item -ItemType Directory -Path $root | Out-Null }

$tags = Get-ChildItem "design-system/components" -Recurse -Filter *.js |
  ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    [regex]::Matches($content, "customElements\.define\('([^']+)'") | ForEach-Object { $_.Groups[1].Value }
  } |
  Sort-Object -Unique

function Get-PrettyName([string]$tag) {
  (($tag -replace '^webropol-','').Split('-') | ForEach-Object {
    if ($_.Length -gt 0) { $_.Substring(0,1).ToUpper() + $_.Substring(1) }
  }) -join ' '
}

function Get-FileName([string]$tag) {
  "{0}-demo.html" -f ($tag -replace '^webropol-','')
}

$snippets = @{}
$snippets['webropol-button'] = '<webropol-button variant="primary" size="md">Primary Button</webropol-button>'
$snippets['webropol-button-hue'] = '<webropol-button-hue hue="primary" theme="filled" label="Create New" icon="fal fa-plus"></webropol-button-hue>'
$snippets['webropol-text-link'] = '<webropol-text-link href="#" icon="fal fa-arrow-right">Read more</webropol-text-link>'
$snippets['webropol-badge'] = '<webropol-badge variant="success">Active</webropol-badge>'
$snippets['webropol-input'] = '<webropol-input label="Name" placeholder="Enter your name"></webropol-input>'
$snippets['webropol-loading'] = '<webropol-loading type="spinner" size="md"></webropol-loading>'
$snippets['webropol-tooltip'] = '<webropol-tooltip content="Helpful tooltip"><webropol-button variant="secondary">Hover me</webropol-button></webropol-tooltip>'
$snippets['webropol-breadcrumbs'] = '<webropol-breadcrumbs trail=''[{"label":"Home","url":"../index.html"},{"label":"Design System","url":"index.html"},{"label":"Demo"}]''></webropol-breadcrumbs>'
$snippets['webropol-header'] = '<webropol-header username="Demo User" show-notifications show-help show-user-menu show-theme-selector></webropol-header>'
$snippets['webropol-header-enhanced'] = '<webropol-header-enhanced username="Demo User" show-notifications show-help show-user-menu show-theme-selector></webropol-header-enhanced>'
$snippets['webropol-sidebar'] = '<div class="h-[500px] overflow-hidden rounded-xl border border-webropol-gray-200"><webropol-sidebar active="surveys" base="../"></webropol-sidebar></div>'
$snippets['webropol-sidebar-enhanced'] = '<div class="h-[500px] overflow-hidden rounded-xl border border-webropol-gray-200"><webropol-sidebar-enhanced active="surveys" base="../"></webropol-sidebar-enhanced></div>'
$snippets['webropol-floating-button'] = '<webropol-floating-button position="bottom-right" theme="primary-blue" items=''[{"id":"survey","label":"Survey","description":"Create survey","icon":"fal fa-chart-bar","url":"../index.html"}]''></webropol-floating-button>'
$snippets['webropol-card'] = '<webropol-card title="Survey Overview" subtitle="Recent performance"><p class="text-webropol-gray-700">Card content demo.</p></webropol-card>'
$snippets['webropol-action-card'] = '<webropol-action-card title="Create Survey" subtitle="Start quickly" icon="fal fa-chart-bar"></webropol-action-card>'
$snippets['webropol-list-card'] = '<webropol-list-card title="Recent Surveys"></webropol-list-card>'
$snippets['webropol-video-card'] = '<webropol-video-card title="Training Video" subtitle="Best practices"></webropol-video-card>'
$snippets['webropol-modal'] = '<webropol-button id="openModalBtn" variant="primary">Open Modal</webropol-button><webropol-modal id="demoModal" title="Modal Demo"><p class="text-webropol-gray-700">Modal content.</p></webropol-modal>'
$snippets['webropol-settings-modal'] = '<webropol-button id="openSettingsModalBtn" variant="secondary">Open Settings Modal</webropol-button><webropol-settings-modal id="demoSettingsModal"></webropol-settings-modal>'
$snippets['webropol-survey-settings-modal'] = '<webropol-button id="openSurveySettingsBtn" variant="secondary">Open Survey Settings Modal</webropol-button><webropol-survey-settings-modal id="demoSurveySettingsModal"></webropol-survey-settings-modal>'
$snippets['webropol-add-question-modal'] = '<webropol-button id="openAddQuestionBtn" variant="primary">Open Add Question Modal</webropol-button><webropol-add-question-modal id="demoAddQuestionModal"></webropol-add-question-modal>'

$cards = @()

foreach ($tag in $tags) {
  $name = Get-PrettyName $tag
  $fileName = Get-FileName $tag
  $filePath = Join-Path $root $fileName
  $snippet = if ($snippets.ContainsKey($tag)) { $snippets[$tag] } else { "<$tag></$tag>" }

  $content = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$name Demo | Webropol Design System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'webropol-primary': { 50: '#f0fdff', 500: '#06b6d4', 700: '#0e7490', 900: '#164e63' },
            'webropol-gray': { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' }
          },
          fontFamily: { 'sans': ['Inter', 'system-ui', 'sans-serif'] }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script type="module" src="../components/index.js"></script>
</head>
<body class="font-sans bg-webropol-gray-50 min-h-screen text-webropol-gray-900">
  <main class="max-w-6xl mx-auto px-6 py-10">
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 class="text-3xl font-semibold">$name Demo</h1>
        <p class="text-webropol-gray-500 mt-2">Component tag: <span class="font-medium">$tag</span></p>
      </div>
      <a href="index.html" class="inline-flex items-center px-4 py-2 rounded-xl border border-webropol-gray-200 bg-white hover:bg-webropol-gray-50">
        <i class="fal fa-grid-2 mr-2"></i>
        Component Gallery
      </a>
    </div>

    <section class="bg-white rounded-2xl shadow-card p-8 border border-webropol-gray-100">
      $snippet
    </section>
  </main>

  <script>
    const modalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('demoModal');
    if (modalBtn && modal) {
      modalBtn.addEventListener('click', () => {
        if (typeof modal.open === 'function') modal.open();
        else modal.setAttribute('open', '');
      });
    }

    const settingsBtn = document.getElementById('openSettingsModalBtn');
    const settingsModal = document.getElementById('demoSettingsModal');
    if (settingsBtn && settingsModal) {
      settingsBtn.addEventListener('click', () => {
        if (typeof settingsModal.open === 'function') settingsModal.open();
        else settingsModal.setAttribute('open', '');
      });
    }

    const surveySettingsBtn = document.getElementById('openSurveySettingsBtn');
    const surveySettingsModal = document.getElementById('demoSurveySettingsModal');
    if (surveySettingsBtn && surveySettingsModal) {
      surveySettingsBtn.addEventListener('click', () => {
        if (typeof surveySettingsModal.open === 'function') surveySettingsModal.open();
        else surveySettingsModal.setAttribute('open', '');
      });
    }

    const addQuestionBtn = document.getElementById('openAddQuestionBtn');
    const addQuestionModal = document.getElementById('demoAddQuestionModal');
    if (addQuestionBtn && addQuestionModal) {
      addQuestionBtn.addEventListener('click', () => {
        if (typeof addQuestionModal.open === 'function') addQuestionModal.open();
        else addQuestionModal.setAttribute('open', '');
      });
    }
  </script>
</body>
</html>
"@

  Set-Content -Path $filePath -Value $content -Encoding UTF8
  $cards += [PSCustomObject]@{ Name = $name; File = $fileName; Tag = $tag }
}

$cardHtml = ($cards | Sort-Object Name | ForEach-Object {
@"
      <a href="$($_.File)" class="block bg-white rounded-2xl border border-webropol-gray-200 p-5 hover:border-webropol-primary-500 hover:shadow-card transition-all">
        <h2 class="text-lg font-semibold text-webropol-gray-900">$($_.Name)</h2>
        <p class="text-sm text-webropol-gray-500 mt-1">$($_.Tag)</p>
      </a>
"@
}) -join "`n"

$indexContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Design System Component Gallery | Webropol</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'webropol-primary': { 50: '#f0fdff', 500: '#06b6d4', 700: '#0e7490', 900: '#164e63' },
            'webropol-gray': { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' }
          },
          fontFamily: { 'sans': ['Inter', 'system-ui', 'sans-serif'] }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="font-sans bg-webropol-gray-50 min-h-screen text-webropol-gray-900">
  <main class="max-w-7xl mx-auto px-6 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold">Design System Component Gallery</h1>
      <p class="text-webropol-gray-500 mt-2">Browse individual demo pages for each Webropol design component.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
$cardHtml
    </div>
  </main>
</body>
</html>
"@

Set-Content -Path (Join-Path $root 'index.html') -Value $indexContent -Encoding UTF8

"Generated $($tags.Count) component demo pages + gallery index in $root"
