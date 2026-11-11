# First-screen and thread-effect captures of direction C with headless Edge (live page, real animations).
#   powershell -File mockups\capture-demo.ps1            (server must be running: dart run tool/serve.dart)
#   powershell -File mockups\capture-demo.ps1 hero       (only the hero shots)  |  threads  (only the thread shots)
# PowerShell, not bash: since Edge 157.0.4341.46, headless Edge started from Git Bash exits at once with no output.
param([string]$Only = '')
$Edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$Dart = 'C:\src\flutter\bin\dart.bat'
$Base = 'http://localhost:8080/mockups'
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $Here
$Out = Join-Path $Here 'shots'
$Profile = Join-Path $env:TEMP 'itripay-shots-ps'
New-Item -ItemType Directory -Force $Out | Out-Null

function Invoke-Edge([string[]]$EdgeArgs, [string]$Stdout) {
  $a = @('--headless', '--disable-gpu', '--hide-scrollbars', "--user-data-dir=$Profile") + $EdgeArgs
  $p = Start-Process -FilePath $Edge -ArgumentList $a -PassThru -NoNewWindow -RedirectStandardOutput $Stdout -RedirectStandardError "$env:TEMP\itri-edge-err.txt"
  if (-not $p.WaitForExit(90000)) { try { $p.Kill() } catch {} }
}
function Shot([string]$Name, [string]$Url, [int]$W, [int]$H, [int]$Scale = 1, [int]$Budget = 6500, [string[]]$Extra = @()) {
  $file = Join-Path $Out "$Name.png"
  Remove-Item $file -ErrorAction SilentlyContinue
  for ($try = 0; $try -lt 4 -and -not (Test-Path $file); $try++) {
    Invoke-Edge (@("--force-device-scale-factor=$Scale", "--window-size=$W,$H", "--virtual-time-budget=$Budget") + $Extra + @("--screenshot=$file", $Url)) "$env:TEMP\itri-edge-out.txt"
  }
  if (Test-Path $file) { "$Name.png" } else { "FAILED $Name" }
}
function Crop([string]$Name, [int[]]$Box) {
  Push-Location $Root; & $Dart run mockups/crop.dart "mockups/shots/$Name.png" @($Box | ForEach-Object { "$_" }) | Out-Null; Pop-Location
}
function Phone([string]$Name, [string]$Lang, [int]$W, [int]$H) {
  # Headless Edge will not go narrower than ~500px, so the page is framed at phone size and the shot cropped.
  # Animations do not advance inside that frame, so these shots use reduced motion: the layout at rest.
  Shot $Name "$Base/frame.html?dir=c&lang=$Lang&w=$W&h=$H" 600 $H 2 6500 @('--force-prefers-reduced-motion')
  Crop $Name @(($W * 2))
}
function Thread([string]$Name, [string]$Query, [int]$Budget = 7000, [int]$WinH = 768) {
  $url = "$Base/c/demo.html?$Query&timers=1&still=1&vw=1366&vh=768"
  $crop = $null
  for ($try = 0; $try -lt 4 -and -not $crop; $try++) {
    Invoke-Edge @("--window-size=1366,$WinH", '--virtual-time-budget=5000', '--dump-dom', $url) "$env:TEMP\itri-dom.txt"
    $m = Select-String -Path "$env:TEMP\itri-dom.txt" -Pattern 'data-crop="([0-9,-]+)"' | Select-Object -First 1
    if ($m) { $crop = $m.Matches[0].Groups[1].Value }
  }
  if (-not $crop) { "FAILED $Name (no crop)"; return }
  Shot $Name $url 1366 $WinH 2 $Budget
  $b = $crop.Split(',') | ForEach-Object { [int]$_ * 2 }
  Crop $Name $b
}

if ($Only -eq '' -or $Only -eq 'hero') {
  foreach ($s in '1366x768', '1536x864', '1920x1080') { $w, $h = $s.Split('x'); Shot "hero-$s-en" "$Base/c/demo.html?lang=en&timers=1&still=1" $w $h }
  Shot 'hero-1366x768-ar' "$Base/c/demo.html?lang=ar&timers=1&still=1" 1366 768
  Shot 'hero-1366x768-fr' "$Base/c/demo.html?lang=fr&timers=1&still=1" 1366 768
  Phone 'hero-390x844-en' en 390 844; Phone 'hero-390x844-ar' ar 390 844
  Phone 'hero-360x640-en' en 360 640; Phone 'hero-360x640-ar' ar 360 640; Phone 'hero-360x640-fr' fr 360 640
}
# Thread shots: since the threads moved to a full-screen layer they are taken in the in-app browser
# (c/demo.html?btn=N&dist=55&timers=1&still=1, plus scroll=1 for buttons further down). The lines below are kept for reference.
if ($Only -eq 'threads-headless') {
  foreach ($d in 200, 130, 90, 55, 25, 8) { Thread "threads-hero-$d" "btn=1&dist=$d" }
  Thread 'threads-hero-absorbed' 'btn=1&dist=on' 4000
  Thread 'threads-hero-after-leaving' 'btn=1&dist=40&then=away' 9500
  Thread 'threads-premium-50' 'btn=2&dist=50&noshift=1' 7000 7000
  Thread 'threads-form-50' 'btn=3&dist=50&noshift=1' 7000 9000
  Thread 'threads-header-50' 'btn=0&dist=50&noshift=1'
}
if ($Only -eq '' -or $Only -eq 'header') {
  # the header after scrolling, over white sections (features, then the FAQ)
  # Headless Edge photographs a blank page once the page is scrolled: these three are taken in the in-app browser instead.
  # Shot 'header-scrolled-features-en' "$Base/c/demo.html?lang=en&timers=1&still=1&scrollto=features" 1366 768 1 6500
  # Shot 'header-scrolled-faq-ar' "$Base/c/demo.html?lang=ar&timers=1&still=1&scrollto=faq" 1366 768 1 6500
}
