param(
  [int]$Port = 5500
)

$ErrorActionPreference = 'Stop'
$wd = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $wd '.server.pid'

function Stop-OldServer {
  if (Test-Path $pidFile) {
    $oldPid = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($oldPid) {
      Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
    }
  }

  $portOwners = netstat -ano |
    Select-String ":$Port\s" |
    ForEach-Object {
      ($_ -split '\s+')[-1]
    } |
    Where-Object { $_ -match '^\d+$' } |
    Select-Object -Unique

  foreach ($owner in $portOwners) {
    Stop-Process -Id ([int]$owner) -Force -ErrorAction SilentlyContinue
  }
}

function Get-PythonPath {
  if (Test-Path 'C:\Python314\python.exe') {
    return 'C:\Python314\python.exe'
  }

  $python = (Get-Command python.exe -ErrorAction SilentlyContinue).Source
  if ($python) {
    return $python
  }

  throw 'Python was not found. Install Python or update start-localhost.ps1 with the correct python.exe path.'
}

Stop-OldServer
Start-Sleep -Milliseconds 700

$pythonPath = Get-PythonPath
$proc = Start-Process `
  -FilePath $pythonPath `
  -ArgumentList @('-m', 'http.server', "$Port", '--bind', '127.0.0.1') `
  -WorkingDirectory $wd `
  -WindowStyle Hidden `
  -PassThru

Set-Content -Path $pidFile -Value $proc.Id -Encoding ascii
Start-Sleep -Seconds 2

$checks = @(
  "http://127.0.0.1:$Port/",
  "http://localhost:$Port/"
)

foreach ($url in $checks) {
  $status = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 6).StatusCode
  Write-Output "$url=$status"
}

Write-Output "SERVER_PID=$($proc.Id)"
