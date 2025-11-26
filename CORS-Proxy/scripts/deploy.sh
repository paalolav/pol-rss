#!/bin/bash
# POL RSS CORS Proxy - Deployment Script for Linux/macOS
#
# Usage: ./deploy.sh -g <resource-group> -n <function-name> [-l <location>] [-d <domains>] [-a]
#
# Options:
#   -g, --resource-group   Resource group name (required)
#   -n, --function-name    Function App name (required, must be globally unique)
#   -l, --location         Azure region (default: norwayeast)
#   -d, --allowed-domains  Comma-separated allowed domains (default: *)
#   -a, --enable-allowlist Enable domain allowlist
#   -b, --use-arm          Use ARM template instead of Bicep
#   -h, --help             Show this help message

set -e

# Default values
LOCATION="norwayeast"
ALLOWED_DOMAINS="*"
ENABLE_ALLOWLIST=false
ENABLE_RATE_LIMIT=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
USE_BICEP=true

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$SCRIPT_DIR/../infra"
SRC_DIR="$SCRIPT_DIR/.."

print_usage() {
    echo "Usage: $0 -g <resource-group> -n <function-name> [options]"
    echo ""
    echo "Required:"
    echo "  -g, --resource-group   Resource group name"
    echo "  -n, --function-name    Function App name (must be globally unique)"
    echo ""
    echo "Optional:"
    echo "  -l, --location         Azure region (default: norwayeast)"
    echo "  -d, --allowed-domains  Comma-separated allowed domains (default: *)"
    echo "  -a, --enable-allowlist Enable domain allowlist"
    echo "  -b, --use-arm          Use ARM template instead of Bicep"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 -g rg-rss-proxy -n fn-rss-proxy-contoso"
    echo "  $0 -g rg-rss-proxy -n fn-rss-proxy-contoso -d '*.nrk.no,*.vg.no' -a"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -g|--resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        -n|--function-name)
            FUNCTION_NAME="$2"
            shift 2
            ;;
        -l|--location)
            LOCATION="$2"
            shift 2
            ;;
        -d|--allowed-domains)
            ALLOWED_DOMAINS="$2"
            shift 2
            ;;
        -a|--enable-allowlist)
            ENABLE_ALLOWLIST=true
            shift
            ;;
        -b|--use-arm)
            USE_BICEP=false
            shift
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            print_usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$RESOURCE_GROUP" || -z "$FUNCTION_NAME" ]]; then
    echo -e "${RED}Error: Missing required parameters${NC}"
    print_usage
    exit 1
fi

echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}POL RSS CORS Proxy - Deployment Script${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Azure CLI
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed${NC}"
    echo "Please install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi
echo -e "${GREEN}  Azure CLI: OK${NC}"

# Check login status
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Logging in to Azure...${NC}"
    az login
fi

ACCOUNT_NAME=$(az account show --query "name" -o tsv)
echo -e "${GREEN}  Subscription: $ACCOUNT_NAME${NC}"
echo ""

# Create resource group if it doesn't exist
echo -e "${YELLOW}Checking resource group '$RESOURCE_GROUP'...${NC}"
if [[ $(az group exists --name "$RESOURCE_GROUP") == "false" ]]; then
    echo -e "${YELLOW}Creating resource group '$RESOURCE_GROUP' in '$LOCATION'...${NC}"
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
fi
echo -e "${GREEN}  Resource Group: OK${NC}"
echo ""

# Deploy infrastructure
echo -e "${YELLOW}Deploying infrastructure...${NC}"

if [[ "$USE_BICEP" == true ]]; then
    TEMPLATE_FILE="$INFRA_DIR/main.bicep"
    echo -e "  Using Bicep template: $TEMPLATE_FILE"
else
    TEMPLATE_FILE="$INFRA_DIR/azuredeploy.json"
    echo -e "  Using ARM template: $TEMPLATE_FILE"
fi

DEPLOYMENT_OUTPUT=$(az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file "$TEMPLATE_FILE" \
    --parameters functionAppName="$FUNCTION_NAME" \
                 location="$LOCATION" \
                 allowedDomains="$ALLOWED_DOMAINS" \
                 enableAllowlist=$ENABLE_ALLOWLIST \
                 enableRateLimit=$ENABLE_RATE_LIMIT \
                 rateLimitRequests=$RATE_LIMIT_REQUESTS \
                 rateLimitWindowSeconds=$RATE_LIMIT_WINDOW_SECONDS \
    --query "properties.outputs" \
    -o json)

echo -e "${GREEN}  Infrastructure: OK${NC}"
echo ""

# Build TypeScript code
echo -e "${YELLOW}Building function code...${NC}"
cd "$SRC_DIR"

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
    echo "  Installing npm dependencies..."
    npm install --silent
fi

# Build TypeScript
npm run build --silent
echo -e "${GREEN}  Build: OK${NC}"
echo ""

# Deploy function code
echo -e "${YELLOW}Deploying function code...${NC}"

# Create deployment package
TEMP_ZIP="/tmp/cors-proxy-deploy.zip"
rm -f "$TEMP_ZIP"

zip -r "$TEMP_ZIP" dist host.json package.json package-lock.json -q

# Deploy to Azure
az functionapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$FUNCTION_NAME" \
    --src "$TEMP_ZIP" \
    --output none

rm -f "$TEMP_ZIP"
echo -e "${GREEN}  Code Deployment: OK${NC}"
echo ""

# Get function key
echo -e "${YELLOW}Getting function key...${NC}"
FUNCTION_KEY=$(az functionapp keys list --name "$FUNCTION_NAME" --resource-group "$RESOURCE_GROUP" --query "functionKeys.default" -o tsv)

# Parse outputs
FUNCTION_URL=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.functionAppUrl.value')
PROXY_ENDPOINT=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.proxyEndpoint.value')
HEALTH_ENDPOINT=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.healthEndpoint.value')

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${CYAN}Function App URL:  $FUNCTION_URL${NC}"
echo -e "${CYAN}Proxy Endpoint:    $PROXY_ENDPOINT${NC}"
echo -e "${CYAN}Health Endpoint:   $HEALTH_ENDPOINT${NC}"
echo ""
echo -e "${YELLOW}Function Key:      $FUNCTION_KEY${NC}"
echo ""
echo -e "Configure the WebPart with this proxy URL:"
echo -e "${CYAN}  $PROXY_ENDPOINT?code=$FUNCTION_KEY&url=${NC}"
echo ""
echo -e "Test the proxy with:"
echo -e "  curl \"$PROXY_ENDPOINT?code=$FUNCTION_KEY&url=https://www.nrk.no/toppsaker.rss\""
echo ""
