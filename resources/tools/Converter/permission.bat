@echo off
:: Check if the script is running as admin
NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    PowerShell -ExecutionPolicy Bypass -File "D:\Ralph\Vbcras System\LCRO\resources\tools\Converter\whitelist-doc-to.ps1"
) ELSE (
    :: Request admin privileges
    PowerShell -Command "Start-Process PowerShell -ArgumentList '-ExecutionPolicy Bypass -File ""D:\Ralph\Vbcras System\LCRO\resources\tools\Converter\whitelist-doc-to.ps1""' -Verb RunAs"
)
