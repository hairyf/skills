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
  $gpuExtra = "cpu"
} else {
  nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
  $gpuExtra = "cuda"
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

Step "复制 woosh-server.py（空闲 15 分钟自动退出）到仓库目录"
Copy-Item (Join-Path $PSScriptRoot "woosh-server.py") (Join-Path $Dest "woosh-server.py") -Force

Push-Location $Dest
try {
  Step "安装 Python 依赖 (uv sync，首次较慢)"
  uv sync --extra $gpuExtra

  Step "下载模型权重 (~5GB，仅首次)"
  $ckpt = Join-Path $Dest "checkpoints"
  New-Item -ItemType Directory -Force -Path $ckpt | Out-Null
  $assets = @("Woosh-AE.zip", "TextConditionerA.zip", "Woosh-DFlow.zip", "Woosh-CLAP.zip")
  foreach ($a in $assets) {
    $zip = Join-Path $ckpt $a
    $target = Join-Path $ckpt ($a -replace '\.zip$', '')
    # 仓库自带 checkpoints/<name>/config.yaml 占位目录，必须检查真实权重文件
    # （.safetensors / .pt），否则会误判为已下载而跳过 5GB 权重。
    $hasWeights = Get-ChildItem -Path $target -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -in ".safetensors", ".pt", ".ckpt", ".bin" }
    if ($hasWeights) {
      Write-Host "$a 已就绪，跳过"
      continue
    }
    if (-not (Test-Path $zip)) {
      Write-Host "下载 $a ..."
      curl.exe -L -o $zip "https://github.com/SonyResearch/Woosh/releases/download/v1.0.0/$a"
    }
    Write-Host "解压 $a ..."
    # release zip 自带 checkpoints/ 前缀，必须解压到仓库根目录，
    # 否则会生成 checkpoints/checkpoints/<name> 嵌套目录。
    Expand-Archive -Path $zip -DestinationPath $Dest -Force
    Remove-Item -LiteralPath $zip -Force
  }

  if ($Start) {
    Step "启动 Woosh API server (http://127.0.0.1:8000)"
    # 必须带 --extra cuda/cpu：uv run 默认会按无 extra 重新同步环境，
    # 把刚装好的 CUDA torch 换回 CPU 版，导致模型跑在 CPU 上。
    # woosh-server.py 提供空闲自动退出（WOOSH_IDLE_TIMEOUT，默认 15 分钟）。
    uv run --extra $gpuExtra uvicorn woosh-server:app --host 0.0.0.0 --port 8000
  } else {
    Write-Host "`n安装完成。启动服务："
    Write-Host "  cd $Dest && uv run --extra $gpuExtra uvicorn woosh-server:app --host 0.0.0.0 --port 8000"
    $idleMinutes = if ($env:WOOSH_IDLE_TIMEOUT) { $env:WOOSH_IDLE_TIMEOUT } else { 15 }
    Write-Host "服务空闲 $idleMinutes 分钟后自动退出（WOOSH_IDLE_TIMEOUT=0 关闭自动退出）"
    Write-Host "然后生成音效："
    Write-Host '  node sonic.js sfx "footsteps crunching in the snow" -o steps.flac'
  }
} finally {
  Pop-Location
}
