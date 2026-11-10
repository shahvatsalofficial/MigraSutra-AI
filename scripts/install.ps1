param([Parameter(Mandatory=$true)][string]$HostName,[Parameter(Mandatory=$true)][string]$ProjectRoot)
$ErrorActionPreference = 'Stop'
node (Join-Path $PSScriptRoot '../packages/cli/index.mjs') skills --host $HostName --root $ProjectRoot
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
