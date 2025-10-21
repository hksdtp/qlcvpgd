#!/bin/bash

# Quick script to check server status
# Usage: ./check-server-status.sh

SERVER="nihdev@100.115.191.19"

echo "============================================"
echo "TASKGD Server Status Check"
echo "============================================"
echo ""

echo "📁 Checking project files..."
ssh $SERVER "ls -la /data/Ninh/projects/taskgd/ | head -20"
echo ""

echo "📦 Checking tqlcv directory..."
ssh $SERVER "ls -la /data/Ninh/projects/taskgd/tqlcv/ | head -20"
echo ""

echo "🔧 Checking node_modules..."
ssh $SERVER "ls -la /data/Ninh/projects/taskgd/tqlcv/node_modules/.bin/tsx 2>/dev/null && echo '✅ tsx installed' || echo '❌ tsx not found - run: npm install'"
echo ""

echo "📝 Checking environment files..."
ssh $SERVER "ls -la /data/Ninh/projects/taskgd/tqlcv/.env* 2>/dev/null && echo '✅ env files exist' || echo '❌ env files missing'"
echo ""

echo "🔄 Checking Git status..."
ssh $SERVER "cd /data/Ninh/projects/taskgd && git status --short | head -10"
echo ""

echo "🚀 Checking PM2 status..."
ssh $SERVER "pm2 list"
echo ""

echo "🌐 Checking API health..."
ssh $SERVER "curl -s http://localhost:3002/api/health && echo '' || echo '❌ API not responding'"
echo ""

echo "============================================"
echo "Status check complete!"
echo "============================================"

