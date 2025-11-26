# === Konfigurasjon ===
# Endre desse variablane for kvar kunde/miljø
$resourceGroupName = "CORS-Proxy-RG"
$location = "norwayeast" # Vel ein passande Azure-region
$storageAccountName = "corsproxystorage$((Get-Random).ToString().ToLower())" # Må vere globalt unikt
$functionAppName = "CORS-Proxy-App-$((Get-Random).ToString().ToLower())" # Må vere globalt unikt
$functionName = "HttpProxy" # Namnet på mappa med koden

# === Script Start ===
Write-Host "Loggar inn på Azure..."
az login

#Write-Host "Opprettar ressursgruppe: $resourceGroupName..."
#az group create --name $resourceGroupName --location $location

#Write-Host "Oppretter lagringskonto: $storageAccountName..."
#az storage account create --name $storageAccountName --location $location --resource-group $resourceGroupName --sku Standard_LRS

Write-Host "Oppretter Function App: $functionAppName..."
az functionapp create `
    --resource-group $resourceGroupName `
    --consumption-plan-location $location `
    --runtime powershell `
    --functions-version 4 `
    --name $functionAppName `
    --storage-account $storageAccountName

Write-Host "Pakkar og deployer kode til Function App..."
# Zip funksjonsmappa
Compress-Archive -Path "./$functionName" -DestinationPath "./$($functionName).zip" -Force

# Last opp zip-fila
az functionapp deployment source config-zip `
    --resource-group $resourceGroupName `
    --name $functionAppName `
    --src "./$($functionName).zip"

Write-Host "Utrulling fullført!"
Write-Host "Gå til Azure Portal for å hente ut funksjons-URL og nøkkel."

# Rydd opp i zip-fil
Remove-Item "./$($functionName).zip"