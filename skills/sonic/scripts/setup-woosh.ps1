<#
.SYNOPSIS
  Auto-install Sony Woosh (local sound effects) for the sonic skill.
  Clones the repo, sets up the Python env (uv), downloads model weights,
  and optionally starts the API server. Run by the agent — no manual steps.
.DESCRIPTION
  Requirements: Windows 10/11, NVIDIA GPU (8GB+ VRAM recommended), git.
  Usage:
    pwsh setup-woosh.ps1           # install only
    pwsh setup-woosh.ps1 -Start    # install and start the API server
.PARAMETER Dest
  Install directory (default: $HOME\.sonic\woosh)
.PARAMETER Start
  Start the Woosh API server after install.
#>
param(
  [string]$Dest = (Join-Path $HOME ".sonic\woosh"),
  [switch]$Start
)
$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "WARN: $msg" -ForegroundColor Yellow }

Step "检查 NVIDIA GPU"
$smi = Get-Command nvidia-smi -ErrorAction SilentlyContinue
if (-not $smi) {
  Warn "未检测到 nvidia-smi。Woosh 需要 NVIDIA GPU (8G+ 显存)，请先安装/更新 NVIDIA 驱动。"
} else {
  nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
}

Step "检查 git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "未安装 git，请先安装 https://git-scm.com/ 后重试"
}

Step "检查 uv"
if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
  Write-Host "安装 uv ..."
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    winget install -e --id astral-sh.uv --accept-source-agreements --accept-package-agreements
  } elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m pip install uv
  } else {
    throw "未找到 winget/python 安装 uv，请手动安装 https://docs.astral.sh/uv/ 后重试"
  }
  $env:Path = "$env:USERPROFILE\.local\bin;$env:Path"
}

Step "克隆 Woosh 仓库 -> $Dest"
if (-not (Test-Path (Join-Path $Dest ".git"))) {
  New-Item -ItemType Directory -Force -Path (Split-Path $Dest) | Out-Null
  git clone https://github.com/SonyResearch/Woosh $Dest
} else {
  Write-Host "已存在，跳过克隆"
}

Push-Location $Dest
try {
  Step "安装 Python 依赖 (uv sync，首次较慢)"
  uv sync

  Step "下载模型权重 (~5GB，仅首次)"
  $ckpt = Join-Path $Dest "checkpoints"
  New-Item -ItemType Directory -Force -Path $ckpt | Out-Null
  $assets = @("Woosh-AE.zip", "TextConditionerA.zip", "Woosh-DFlow.zip", "Woosh-CLAP.zip")
  foreach ($a in $assets) {
    $zip = Join-Path $ckpt $a
    $target = Join-Path $ckpt ($a -replace '\.zip$', '')
    if (Test-Path $target) {
      Write-Host "$a 已就绪，跳过"
      continue
    }
    if (-not (Test-Path $zip)) {
      Write-Host "下载 $a ..."
      curl.exe -L -o $zip "https://github.com/SonyResearch/Woosh/releases/download/v1.0.0/$a"
    }
    Write-Host "解压 $a ..."
    Expand-Archive -Path $zip -DestinationPath $ckpt -Force
    Remove-Item -LiteralPath $zip -Force
  }

  if ($Start) {
    Step "启动 Woosh API server (http://127.0.0.1:8000)"
    uv run uvicorn api.api_server:app --host 0.0.0.0 --port 8000
  } else {
    Write-Host "`n安装完成。启动服务："
    Write-Host "  cd $Dest && uv run uvicorn api.api_server:app --host 0.0.0.0 --port 8000"
    Write-Host "然后生成音效："
    Write-Host '  node sonic.js sfx "脚步声踩在雪地上" -o steps.flac'
  }
} finally {
  Pop-Location
}
