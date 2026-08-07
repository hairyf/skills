<#
.SYNOPSIS
  Auto-install local MMAudio (sound effects on your own GPU) for the sonic skill.
  Clones the repo, installs Python deps (torch CUDA), and starts the local API server.
.DESCRIPTION
  Requirements: Windows 10/11, NVIDIA GPU (6GB+ VRAM recommended), git, Python 3.10+.
  Usage:
    pwsh setup-mmaudio.ps1           # install only
    pwsh setup-mmaudio.ps1 -Start    # install and start the API server (port 8001)
.PARAMETER Dest
  Install directory (default: $HOME\.sonic\mmaudio)
.PARAMETER Start
  Start the MMAudio API server after install.
#>
param(
  [string]$Dest = (Join-Path $HOME ".sonic\mmaudio"),
  [switch]$Start
)
$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "WARN: $msg" -ForegroundColor Yellow }

Step "检查 NVIDIA GPU"
$smi = Get-Command nvidia-smi -ErrorAction SilentlyContinue
if (-not $smi) {
  Warn "未检测到 nvidia-smi。MMAudio 需要 NVIDIA GPU (6G+ 显存)。"
} else {
  nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
}

Step "检查 git / python"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "未安装 git，请先安装 https://git-scm.com/"
}
$py = Get-Command python -ErrorAction SilentlyContinue
if (-not $py) {
  throw "未安装 Python，请先安装 https://www.python.org/ (勾选 Add to PATH)"
}

Step "克隆 MMAudio 仓库 -> $Dest"
if (-not (Test-Path (Join-Path $Dest ".git"))) {
  New-Item -ItemType Directory -Force -Path (Split-Path $Dest) | Out-Null
  git clone https://github.com/hkchengrex/MMAudio $Dest
} else {
  Write-Host "已存在，跳过克隆"
}

Push-Location $Dest
try {
  Step "创建虚拟环境"
  if (-not (Test-Path ".venv")) { python -m venv .venv }
  $venvPy = Join-Path $Dest ".venv\Scripts\python.exe"

  Step "安装 PyTorch (CUDA，较大，首次较慢)"
  & $venvPy -m pip install --upgrade pip | Out-Null
  & $venvPy -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128

  Step "安装 MMAudio 与 API 依赖"
  & $venvPy -m pip install -e .
  & $venvPy -m pip install "fastapi" "uvicorn" "python-multipart"

  Step "模型权重将在首次启动时自动下载 (HuggingFace, large_44k_v2 ~3GB)"

  if ($Start) {
    Step "启动 MMAudio API server (http://127.0.0.1:8001)"
    & $venvPy -m uvicorn mmaudio-server:app --host 0.0.0.0 --port 8001
  } else {
    Write-Host "`n安装完成。启动服务："
    Write-Host "  cd $Dest && .venv\Scripts\python -m uvicorn mmaudio-server:app --host 0.0.0.0 --port 8001"
    Write-Host "然后生成音效："
    Write-Host '  node sonic.js sfx "雨声敲打木屋顶" -o rain.flac --provider mmaudio-local'
  }
} finally {
  Pop-Location
}
