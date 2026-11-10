@echo off
if "%~1"=="" (echo usage: install.cmd HOST TARGET_DIR & exit /b 2)
if "%~2"=="" (echo usage: install.cmd HOST TARGET_DIR & exit /b 2)
node "%~dp0..\packages\cli\index.mjs" skills --host "%~1" --root "%~2"
exit /b %ERRORLEVEL%
