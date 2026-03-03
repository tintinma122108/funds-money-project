#!/bin/bash
# 启动开发服务器脚本

cd "$(dirname "$0")"
echo "正在启动 Next.js 开发服务器..."
echo "请等待几秒钟，服务器启动后会在 http://localhost:3000 运行"
echo ""
npm run dev

