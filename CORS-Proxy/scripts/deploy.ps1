<#
.SYNOPSIS
    Deploys the POL RSS CORS Proxy Azure Function.

.DESCRIPTION
    This script deploys the Azure infrastructure and function code for the CORS proxy.
    It supports both Bicep and ARM template deployments.

.PARAMETER ResourceGroup
    The name of the resource group to deploy to. Will be created if it doesn't exist.

.PARAMETER FunctionName
    The name of the Function App (must be globally unique across Azure).

.PARAMETER Location
    Azure region for deployment. Default: norwayeast

.PARAMETER AllowedDomains
    Comma-separated list of allowed domains. Supports wildcards (*.example.com). Default: *

.PARAMETER EnableAllowlist
    Enable domain allowlist validation. Default: false

.PARAMETER UseBicep
    Use Bicep template instead of ARM. Default: true

.EXAMPLE
    ./deploy.ps1 -ResourceGroup "rg-rss-proxy" -FunctionName "fn-rss-proxy-contoso"

.EXAMPLE
    ./deploy.ps1 -ResourceGroup "rg-rss-proxy" -FunctionName "fn-rss-proxy-contoso" -AllowedDomains "*.nrk.no,*.vg.no" -EnableAllowlist $true
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroup,

    [Parameter(Mandatory = $true)]
    [string]$FunctionName,

    [Parameter(Mandatory = $false)]
    [string]$Location = "norwayeast",

    [Parameter(Mandatory = $false)]
    [string]$AllowedDomains = "*",

    [Parameter(Mandatory = $false)]
    [bool]$EnableAllowlist = $false,

    [Parameter(Mandatory = $false)]
    [bool]$EnableRateLimit = $true,

    [Parameter(Mandatory = $false)]
    [int]$RateLimitRequests = 100,

    [Parameter(Mandatory = $false)]
    [int]$RateLimitWindowSeconds = 60,

    [Parameter(Mandatory = $false)]
    [bool]$UseBicep = $true
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$InfraDir = Join-Path $ScriptDir ".." "infra"
$SrcDir = Join-Path $ScriptDir ".."

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "POL RSS CORS Proxy - Deployment Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Azure CLI
$azVersion = az version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Azure CLI is not installed. Please install from https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}
Write-Host "  Azure CLI: OK" -ForegroundColor Green

# Check login status
$account = az account show 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Logging in to Azure..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to login to Azure" -ForegroundColor Red
        exit 1
    }
}

$accountInfo = az account show --query "{name:name, id:id}" -o json | ConvertFrom-Json
Write-Host "  Subscription: $($accountInfo.name)" -ForegroundColor Green
Write-Host ""

# Create resource group if it doesn't exist
Write-Host "Checking resource group '$ResourceGroup'..." -ForegroundColor Yellow
$rgExists = az group exists --name $ResourceGroup
if ($rgExists -eq "false") {
    Write-Host "Creating resource group '$ResourceGroup' in '$Location'..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location --output none
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create resource group" -ForegroundColor Red
        exit 1
    }
}
Write-Host "  Resource Group: OK" -ForegroundColor Green
Write-Host ""

# Deploy infrastructure
Write-Host "Deploying infrastructure..." -ForegroundColor Yellow

$deploymentParams = @{
    functionAppName = $FunctionName
    location = $Location
    allowedDomains = $AllowedDomains
    enableAllowlist = $EnableAllowlist
    enableRateLimit = $EnableRateLimit
    rateLimitRequests = $RateLimitRequests
    rateLimitWindowSeconds = $RateLimitWindowSeconds
}

$paramsJson = $deploymentParams | ConvertTo-Json -Compress

if ($UseBicep) {
    $templateFile = Join-Path $InfraDir "main.bicep"
    Write-Host "  Using Bicep template: $templateFile" -ForegroundColor Gray
} else {
    $templateFile = Join-Path $InfraDir "azuredeploy.json"
    Write-Host "  Using ARM template: $templateFile" -ForegroundColor Gray
}

$deploymentOutput = az deployment group create `
    --resource-group $ResourceGroup `
    --template-file $templateFile `
    --parameters functionAppName=$FunctionName `
                 location=$Location `
                 allowedDomains="$AllowedDomains" `
                 enableAllowlist=$EnableAllowlist `
                 enableRateLimit=$EnableRateLimit `
                 rateLimitRequests=$RateLimitRequests `
                 rateLimitWindowSeconds=$RateLimitWindowSeconds `
    --query "properties.outputs" `
    -o json

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Infrastructure deployment failed" -ForegroundColor Red
    exit 1
}

$outputs = $deploymentOutput | ConvertFrom-Json
Write-Host "  Infrastructure: OK" -ForegroundColor Green
Write-Host ""

# Build TypeScript code
Write-Host "Building function code..." -ForegroundColor Yellow
Push-Location $SrcDir

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing npm dependencies..." -ForegroundColor Gray
    npm install --silent
}

# Build TypeScript
npm run build --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host "  Build: OK" -ForegroundColor Green
Write-Host ""

# Deploy function code
Write-Host "Deploying function code..." -ForegroundColor Yellow

# Create deployment package
$tempZip = Join-Path $env:TEMP "cors-proxy-deploy.zip"
if (Test-Path $tempZip) { Remove-Item $tempZip }

$filesToZip = @(
    "dist",
    "host.json",
    "package.json",
    "package-lock.json"
)

Push-Location $SrcDir
Compress-Archive -Path $filesToZip -DestinationPath $tempZip -Force
Pop-Location

# Deploy to Azure
az functionapp deployment source config-zip `
    --resource-group $ResourceGroup `
    --name $FunctionName `
    --src $tempZip `
    --output none

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Code deployment failed" -ForegroundColor Red
    Remove-Item $tempZip -ErrorAction SilentlyContinue
    exit 1
}

Remove-Item $tempZip -ErrorAction SilentlyContinue
Write-Host "  Code Deployment: OK" -ForegroundColor Green
Write-Host ""

# Get function key
Write-Host "Getting function key..." -ForegroundColor Yellow
$functionKey = az functionapp keys list --name $FunctionName --resource-group $ResourceGroup --query "functionKeys.default" -o tsv

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Function App URL:  $($outputs.functionAppUrl.value)" -ForegroundColor Cyan
Write-Host "Proxy Endpoint:    $($outputs.proxyEndpoint.value)" -ForegroundColor Cyan
Write-Host "Health Endpoint:   $($outputs.healthEndpoint.value)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Function Key:      $functionKey" -ForegroundColor Yellow
Write-Host ""
Write-Host "Configure the WebPart with this proxy URL:" -ForegroundColor White
Write-Host "  $($outputs.proxyEndpoint.value)?code=$functionKey&url=" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test the proxy with:" -ForegroundColor White
Write-Host "  curl `"$($outputs.proxyEndpoint.value)?code=$functionKey&url=https://www.nrk.no/toppsaker.rss`"" -ForegroundColor Gray
Write-Host ""
