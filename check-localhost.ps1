param(
  [int]$Port = 5500
)

$r1 = (Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -UseBasicParsing).StatusCode
$r2 = (Invoke-WebRequest -Uri "http://localhost:$Port" -UseBasicParsing).StatusCode
Write-Output "127.0.0.1:$Port=$r1"
Write-Output "localhost:$Port=$r2"
