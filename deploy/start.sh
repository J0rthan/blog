#!/usr/bin/env sh
set -e

# Render 会注入 PORT，替换 nginx 配置中的 ${PORT}
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# 启动后端（容器内部固定 8080）
java -jar /app/app.jar --server.port=8080 &

# 前台启动 nginx（保持容器存活）
nginx -g 'daemon off;'