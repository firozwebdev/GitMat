@echo off
:: gmt.cmd - Shortcut for gitmate CLI
:: Place this file in a directory in your PATH (e.g., C:\Windows or a custom tools folder)
:: Then you can use 'gmt' as a shortcut for 'gitmate' in any terminal

set SCRIPT_DIR=%~dp0
node "%SCRIPT_DIR%gitmate.js" %* 