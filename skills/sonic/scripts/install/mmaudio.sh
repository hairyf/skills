#!/usr/bin/env bash
# Auto-install local MMAudio (sound effects on your own GPU) for the sonic skill.
# Usage:
#   ./mmaudio.sh            # install only
#   ./mmaudio.sh --start    # install and start the API server (port 8001)
set -euo pipefail

DEST="${MMAUDIO_HOME:-$HOME/.sonic/mmaudio}"
START=0
[[ "${1:-}" == "--start" ]] && START=1

echo "==> 检查 NVIDIA GPU"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
else
  echo "WARN: 未检测到 nvidia-smi。MMAudio 需要 NVIDIA GPU (6G+ 显存)。"
fi

command -v git >/dev/null 2>&1 || { echo "缺少 git"; exit 1; }

PY=""
for c in python3.13 python3.12 python3.11 python3 python; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c "import sys;exit(0 if (3,9)<=sys.version_info<(3,14) else 1)" >/dev/null 2>&1; then
    PY="$c"; break
  fi
done
[ -n "$PY" ] || { echo "缺少兼容的 Python 3.9-3.13"; exit 1; }
echo "使用 Python: $PY"

echo "==> 克隆 MMAudio 仓库 -> $DEST"
if [ ! -d "$DEST/.git" ]; then
  mkdir -p "$(dirname "$DEST")"
  git clone https://github.com/hkchengrex/MMAudio "$DEST"
else
  echo "已存在，跳过克隆"
fi

cd "$DEST"

echo "==> 复制 lib/mmaudio.py 到仓库目录（目标名保持 mmaudio-server.py，避免与仓库内 mmaudio 包同名）"
cp "$(dirname "$0")/../lib/mmaudio.py" "$DEST/mmaudio-server.py"

echo "==> 创建虚拟环境"
[ -d ".venv" ] || "$PY" -m venv .venv
PY=".venv/bin/python"

echo "==> 安装 PyTorch (CUDA，较大，首次较慢)"
"$PY" -m pip install --upgrade pip >/dev/null
"$PY" -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128

echo "==> 安装 MMAudio 与 API 依赖"
"$PY" -m pip install -e .
"$PY" -m pip install fastapi uvicorn python-multipart

echo "==> 模型权重将在首次启动时自动下载 (HuggingFace, large_44k_v2 ~3GB)"

if [ "$START" = "1" ]; then
  echo "==> 启动 MMAudio API server (http://127.0.0.1:8001)"
  "$PY" -m uvicorn mmaudio-server:app --host 0.0.0.0 --port 8001
else
  echo "安装完成。启动服务："
  echo "  cd $DEST && .venv/bin/python -m uvicorn mmaudio-server:app --host 0.0.0.0 --port 8001"
  echo "然后生成音效："
  echo '  node sonic.js sfx "雨声敲打木屋顶" -o rain.flac --provider mmaudio-local'
fi
