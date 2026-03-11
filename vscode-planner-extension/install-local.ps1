param(
    [ValidateSet('stable', 'insiders')]
    [string]$Target = 'stable'
)

$ErrorActionPreference = 'Stop'

$sourceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$packageJsonPath = Join-Path $sourceDir 'package.json'

if (-not (Test-Path $packageJsonPath)) {
    throw "package.json not found in $sourceDir"
}

$package = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
$publisher = $package.publisher
$name = $package.name
$version = $package.version

if ([string]::IsNullOrWhiteSpace($publisher) -or [string]::IsNullOrWhiteSpace($name) -or [string]::IsNullOrWhiteSpace($version)) {
    throw 'publisher, name, or version missing from package.json'
}

$extensionsRoot = if ($Target -eq 'insiders') {
    Join-Path $HOME '.vscode-insiders\extensions'
} else {
    Join-Path $HOME '.vscode\extensions'
}

$destinationDir = Join-Path $extensionsRoot "$publisher.$name-$version"

New-Item -ItemType Directory -Force -Path $extensionsRoot | Out-Null

if (Test-Path $destinationDir) {
    Remove-Item -Recurse -Force $destinationDir
}

Copy-Item -Path $sourceDir -Destination $destinationDir -Recurse

Write-Host "Installed to: $destinationDir"
Write-Host 'Next step: reload VS Code and run Planner commands from the Command Palette.'