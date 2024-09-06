# Define the path to the executable you want to whitelist
$exePath = "D:\Ralph\Vbcras System\LCRO\resources\tools\Converter\docto.exe"

# Add the executable to Windows Defender exclusions
Add-MpPreference -ExclusionProcess $exePath

# Inform the user that the file has been successfully whitelisted
Write-Host "Executable whitelisted successfully!" -ForegroundColor Green
