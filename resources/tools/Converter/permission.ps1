# Get the directory where the PowerShell script is located
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path

# Define the path to the executable relative to the script's location
$exePath = Join-Path $scriptDirectory "resources\tools\Converter\docto.exe"

# Get current Windows Defender exclusions for processes
$currentExclusions = Get-MpPreference | Select-Object -ExpandProperty ExclusionProcess

# Check if the executable is already whitelisted
if ($currentExclusions -contains $exePath) {
    Write-Host "Executable is already whitelisted!" -ForegroundColor Yellow
} else {
    # Add the executable to Windows Defender exclusions
    Add-MpPreference -ExclusionProcess $exePath
    Write-Host "Executable whitelisted successfully!" -ForegroundColor Green
}
