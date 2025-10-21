#!/bin/bash

# Verify Server Setup Script
# Run this manually to check server status

SERVER="nihdev@100.115.191.19"

echo "============================================"
echo "TASKGD Server Verification"
echo "============================================"
echo ""

echo "1. Testing SSH connection..."
ssh $SERVER 'echo "✅ SSH connection OK"'
echo ""

echo "2. Checking project directory..."
ssh $SERVER 'ls -la /data/Ninh/projects/taskgd/ | head -15'
echo ""

echo "3. Checking tqlcv directory..."
ssh $SERVER 'ls -la /data/Ninh/projects/taskgd/tqlcv/ | head -20'
echo ""

echo "4. Checking node_modules..."
ssh $SERVER 'ls -la /data/Ninh/projects/taskgd/tqlcv/node_modules/.bin/tsx 2>/dev/null && echo "✅ tsx installed" || echo "❌ tsx not found"'
echo ""

echo "5. Checking environment files..."
ssh $SERVER 'ls -la /data/Ninh/projects/taskgd/tqlcv/.env* 2>/dev/null && echo "✅ env files exist" || echo "❌ env files missing"'
echo ""

echo "6. Checking Git status..."
ssh $SERVER 'cd /data/Ninh/projects/taskgd && git status --short | head -10'
echo ""

echo "7. Checking PM2 status..."
ssh $SERVER 'pm2 list'
echo ""

echo "8. Testing API health..."
ssh $SERVER 'curl -s http://localhost:3002/api/health && echo "" || echo "❌ API not responding"'
echo ""

echo "9. Checking database connection..."
ssh $SERVER 'docker exec postgresql-16 psql -U nihdev -d taskgd_db -c "SELECT 1;" 2>&1 | grep -q "1 row" && echo "✅ Database connected" || echo "❌ Database connection failed"'
echo ""

echo "============================================"
echo "Verification Complete"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. SSH to server: ssh $SERVER"
echo "2. Navigate to project: cd /data/Ninh/projects/taskgd"
echo "3. Start development: cd tqlcv && npm run server:dev"
echo "4. Or use Auggie CLI: auggie 'your request'"
echo ""

