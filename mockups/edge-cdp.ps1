# Starts headless Edge with the DevTools protocol on port 9333, for mockups/capture-site.dart.
# PowerShell, not bash: headless Edge started from Git Bash exits at once (see capture-demo.ps1).
#   powershell -File mockups\edge-cdp.ps1         start
#   powershell -File mockups\edge-cdp.ps1 stop    stop it
param([string]$Cmd = 'start')
$Edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$Profile = Join-Path $env:TEMP 'itripay-cdp'
if ($Cmd -eq 'stop') {
  Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | Where-Object { $_.CommandLine -like "*itripay-cdp*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  'stopped'; exit
}
$a = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9333', "--user-data-dir=$Profile", '--no-first-run', 'about:blank')
Start-Process -FilePath $Edge -ArgumentList $a -WindowStyle Hidden | Out-Null
for ($i = 0; $i -lt 40; $i++) {
  try { (Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:9333/json/version' -TimeoutSec 1).Content | Out-Null; 'edge ready on 9333'; exit } catch { Start-Sleep -Milliseconds 250 }
}
'edge did not start'
