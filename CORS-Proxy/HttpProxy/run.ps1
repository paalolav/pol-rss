using namespace System.Net

# Hent query-parametere frå innkomande førespurnad
$url = $Request.Query.url

# Viss 'url'-parameter manglar, returner ein feilmelding
if (-not $url) {
    $body = "Feil: Du må oppgi ein 'url' parameter i query stringen."
    $Response = [HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::BadRequest
        Body = $body
    }
    Push-OutputBinding -Name Response -Value $Response
    return
}

# Prøv å hente innhald frå den oppgitte URL-en
try {
    $apiResponse = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
    $statusCode = [HttpStatusCode]::OK
    $body = $apiResponse | ConvertTo-Json -Depth 10 # Konverter objekt til JSON-streng
}
catch {
    # Handter feil (f.eks. 404 Not Found, timeout)
    $statusCode = $_.Exception.Response.StatusCode
    $body = "Kunne ikkje hente innhald frå '$url'. Status: $($_.Exception.Message)"
}

# Førebu og send svaret tilbake til klienten
$headers = @{
    "Content-Type" = "application/json; charset=utf-8";
    "Access-Control-Allow-Origin" = "*"; # Dette er magien som løyser CORS-problemet
    "Access-Control-Allow-Methods" = "GET, OPTIONS";
}

$Response = [HttpResponseContext]@{
    StatusCode = $statusCode
    Headers = $headers
    Body = $body
}

Push-OutputBinding -Name Response -Value $Response