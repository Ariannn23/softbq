$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $repoRoot ".env.release"

if (-not (Test-Path -LiteralPath $envFile)) {
  Write-Host "No existe .env.release." -ForegroundColor Yellow
  Write-Host "Crea el archivo en la raiz del proyecto con:" -ForegroundColor Yellow
  Write-Host 'GH_TOKEN=ghp_tu_token_aqui' -ForegroundColor Cyan
  exit 1
}

Get-Content -LiteralPath $envFile | ForEach-Object {
  $line = $_.Trim()

  if (-not $line -or $line.StartsWith("#")) {
    return
  }

  $parts = $line.Split("=", 2)
  if ($parts.Count -ne 2) {
    return
  }

  $name = $parts[0].Trim()
  $value = $parts[1].Trim().Trim('"').Trim("'")

  if ($name) {
    [Environment]::SetEnvironmentVariable($name, $value, "Process")
  }
}

if (-not $env:GH_TOKEN -and -not $env:GITHUB_TOKEN) {
  Write-Host ".env.release no contiene GH_TOKEN ni GITHUB_TOKEN." -ForegroundColor Red
  exit 1
}

Push-Location $repoRoot
try {
  npm.cmd run publish:exe
}
finally {
  Pop-Location
}
