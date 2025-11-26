// POL RSS CORS Proxy - Azure Function Deployment
// Usage: az deployment group create -g <resource-group> -f main.bicep -p functionAppName=<name>

@description('Name of the Function App (must be globally unique)')
param functionAppName string

@description('Location for all resources')
param location string = resourceGroup().location

@description('Allowed domains for proxy (comma-separated, supports wildcards like *.nrk.no). Use * to allow all.')
param allowedDomains string = '*'

@description('Enable domain allowlist validation')
param enableAllowlist bool = false

@description('Enable rate limiting')
param enableRateLimit bool = true

@description('Rate limit: requests per window')
param rateLimitRequests int = 100

@description('Rate limit: window size in seconds')
param rateLimitWindowSeconds int = 60

@description('Enable Azure AD authentication for proxy')
param enableAadAuth bool = false

@description('Azure AD Client ID (required if enableAadAuth is true)')
param aadClientId string = ''

@description('Azure AD Tenant ID (required if enableAadAuth is true)')
param aadTenantId string = ''

// Generate unique names based on resource group
var storageAccountName = 'st${uniqueString(resourceGroup().id)}'
var hostingPlanName = '${functionAppName}-plan'
var appInsightsName = '${functionAppName}-insights'

// Storage Account for Function App
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

// Consumption Plan (Serverless)
resource hostingPlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {
    reserved: false // false for Windows, true for Linux
  }
}

// Application Insights for monitoring
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
    RetentionInDays: 30
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// Function App
resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    httpsOnly: true
    siteConfig: {
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      nodeVersion: '~20'
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        // Proxy configuration
        {
          name: 'ALLOWED_DOMAINS'
          value: allowedDomains
        }
        {
          name: 'ENABLE_ALLOWLIST'
          value: string(enableAllowlist)
        }
        {
          name: 'ENABLE_RATE_LIMIT'
          value: string(enableRateLimit)
        }
        {
          name: 'RATE_LIMIT_REQUESTS'
          value: string(rateLimitRequests)
        }
        {
          name: 'RATE_LIMIT_WINDOW_SECONDS'
          value: string(rateLimitWindowSeconds)
        }
        // AAD configuration (if enabled)
        {
          name: 'ENABLE_AAD_AUTH'
          value: string(enableAadAuth)
        }
        {
          name: 'AAD_CLIENT_ID'
          value: aadClientId
        }
        {
          name: 'AAD_TENANT_ID'
          value: aadTenantId
        }
      ]
      cors: {
        allowedOrigins: [
          '*'
        ]
        supportCredentials: false
      }
    }
  }
}

// AAD Authentication configuration (if enabled)
resource functionAppAuthSettings 'Microsoft.Web/sites/config@2023-01-01' = if (enableAadAuth && aadClientId != '') {
  parent: functionApp
  name: 'authsettingsV2'
  properties: {
    globalValidation: {
      requireAuthentication: true
      unauthenticatedClientAction: 'Return401'
    }
    identityProviders: {
      azureActiveDirectory: {
        enabled: true
        registration: {
          clientId: aadClientId
          openIdIssuer: 'https://sts.windows.net/${aadTenantId}/v2.0'
        }
        validation: {
          allowedAudiences: [
            'api://${aadClientId}'
          ]
        }
      }
    }
  }
}

// Outputs
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output functionAppName string = functionApp.name
output proxyEndpoint string = 'https://${functionApp.properties.defaultHostName}/api/proxy'
output healthEndpoint string = 'https://${functionApp.properties.defaultHostName}/api/health'
output appInsightsName string = appInsights.name
output storageAccountName string = storageAccount.name
