#!/usr/bin/env bash
# Auto-install Sony Woosh (local sound effects) for the sonic skill.
# Usage:
#   ./setup-woosh.sh            # install only
#   ./setup-woosh.sh --start    # install and start the API server
set -euo pipefail

DEST="${WOOSH_HOME:-$HOME/.sonic/woosh}"
START=0
[[ "${1:-}" == "--start" ]] && START=1

echo "==> 检查 NVIDIA GPU"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
else
  echo "WARN: 未检测到 nvidia-smi。Woosh 需要 NVIDIA GPU (8G+ 显存)。"
fi

echo "==> 检查 git / uv"
command -v git >/dev/null 2>&1 || { echo "缺少 git"; exit 1; }
if ! command -v uv >/dev/null 2>&1; then
  echo "安装 uv ..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

echo "==> 克隆 Woosh 仓库 -> $DEST"
if [ ! -d "$DEST/.git" ]; then
  mkdir -p "$(dirname "$DEST")"
  git clone https://github.com/SonyResearch/Woosh "$DEST"
else
  echo "已存在，跳过克隆"
fi

cd "$DEST"

echo "==> 安装 Python 依赖 (uv sync，首次较慢)"
uv sync

echo "==> 下载模型权重 (~5GB，仅首次)"
mkdir -p checkpoints
for a in Woosh-AE.zip TextConditionerA.zip Woosh-DFlow.zip Woosh-CLAP.zip; do
  t="checkpoints/${a%.zip}"
  if [ -d "$t" ]; then
    echo "$a 已就绪，跳过"
    continue
  fi
  echo "下载 $a ..."
  curl -L -o "checkpoints/$a" "https://github.com/SonyResearch/Woosh/releases/download/v1.0.0/$a"
  echo "解压 $a ..."
  unzip -o -q "checkpoints/$a" -d checkpoints
  rm -f "checkpoints/$a"
done

if [ "$START" = "1" ]; then
  echo "==> 启动 Woosh API server (http://127.0.0.1:8000)"
  uv run uvicorn api.api_server:app --host 0.0.0.0 --port 8000
else
  echo "安装完成。启动服务："
  echo "  cd $DEST && uv run uvicorn api.api_server:app --host 0.0.0.0 --port 8000"
  echo "然后生成音效："
  echo '  node sonic.js sfx "脚步声踩在雪地上" -o steps.flac'
fi
