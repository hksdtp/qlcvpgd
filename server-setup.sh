#!/bin/bash
# Run this script on Ubuntu server after syncing files
# Usage: ssh nihdev@100.115.191.19 'bash -s' < server-setup.sh

set -e

echo "============================================"
echo "TASKGD Server Setup"
echo "============================================"
echo ""

cd /data/Ninh/projects/taskgd/tqlcv

echo "[1/4] Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

echo "[2/4] Creating environment files..."
cat > .env << 'EOF'
DATABASE_URL=postgresql://nihdev:haininh1@localhost:5432/taskgd_db
API_PORT=3001
VITE_API_URL=http://localhost:3001
EOF

cat > .env.production << 'EOF'
NODE_ENV=production
API_PORT=3002
API_URL=https://task.ninh.app/api
DATABASE_URL=postgresql://nihdev:haininh1@localhost:5432/taskgd_db
EOF
echo "✅ Environment files created"
echo ""

echo "[3/4] Creating start script..."
cd /data/Ninh/projects/taskgd
cat > start.sh << 'EOF'
#!/bin/bash
cd /data/Ninh/projects/taskgd/tqlcv
export NODE_ENV=production
export API_PORT=3002
export DATABASE_URL=postgresql://nihdev:haininh1@localhost:5432/taskgd_db
./node_modules/.bin/tsx server/api.ts
EOF
chmod +x start.sh
echo "✅ Start script created"
echo ""

echo "[4/4] Verifying setup..."
echo "Git status:"
git status --short | head -10
echo ""
echo "Node modules:"
ls -la tqlcv/node_modules/.bin/tsx 2>/dev/null && echo "✅ tsx installed" || echo "❌ tsx not found"
echo ""
echo "Environment files:"
ls -la tqlcv/.env tqlcv/.env.production 2>/dev/null && echo "✅ env files exist" || echo "❌ env files missing"
echo ""

echo "============================================"
echo "✅ Setup Complete!"
echo "============================================"
echo ""
echo "You can now:"
echo "  - Start dev server: cd /data/Ninh/projects/taskgd/tqlcv && npm run server:dev"
echo "  - Use Auggie CLI for development"
echo "  - Commit changes: git add . && git commit -m 'message'"
echo ""

