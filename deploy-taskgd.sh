#!/bin/bash

# ============================================
# TASKGD Deployment Script
# Domain: task.ninh.app
# Port: 3002
# Database: taskgd_db
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="taskgd"
DOMAIN="task.ninh.app"
PORT=3002
DB_NAME="taskgd_db"
LOCAL_PATH="/Users/nihdev/Web/TASKGD/tqlcv"
SERVER_PATH="/data/Ninh/projects/taskgd"
UBUNTU_SERVER="100.115.191.19"
UBUNTU_USER="nihdev"
SUDO_PASS="haininh1"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}TASKGD Deployment Script${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${GREEN}Project:${NC}      $PROJECT_NAME"
echo -e "${GREEN}Domain:${NC}       $DOMAIN"
echo -e "${GREEN}Port:${NC}         $PORT"
echo -e "${GREEN}Database:${NC}     $DB_NAME"
echo -e "${GREEN}Local Path:${NC}   $LOCAL_PATH"
echo -e "${GREEN}Server Path:${NC}  $SERVER_PATH"
echo ""

# Step 1: Build Frontend
echo -e "${YELLOW}[1/8] Building frontend...${NC}"
cd "$LOCAL_PATH"
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Step 2: Create server directory
echo -e "${YELLOW}[2/8] Creating server directory...${NC}"
ssh ${UBUNTU_USER}@${UBUNTU_SERVER} "mkdir -p ${SERVER_PATH}/{logs,dist}"
echo -e "${GREEN}✅ Server directory created${NC}"
echo ""

# Step 3: Sync files to server
echo -e "${YELLOW}[3/8] Syncing files to server...${NC}"
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'logs' \
  --exclude '*.md' \
  --exclude 'test-*.html' \
  --exclude 'App.*.tsx' \
  "$LOCAL_PATH/" \
  ${UBUNTU_USER}@${UBUNTU_SERVER}:${SERVER_PATH}/

# Sync database schema
rsync -avz \
  "/Users/nihdev/Web/TASKGD/database/schema.sql" \
  ${UBUNTU_USER}@${UBUNTU_SERVER}:${SERVER_PATH}/
echo -e "${GREEN}✅ Files synced successfully${NC}"
echo ""

# Step 4: Create database
echo -e "${YELLOW}[4/8] Creating PostgreSQL database...${NC}"
ssh ${UBUNTU_USER}@${UBUNTU_SERVER} << 'ENDSSH'
  # Run without sudo - use docker exec directly
  docker exec -i postgresql-16 psql -U nihdev -d postgres -c "DROP DATABASE IF EXISTS taskgd_db;"
  docker exec -i postgresql-16 psql -U nihdev -d postgres -c "CREATE DATABASE taskgd_db;"
  echo "✅ Database taskgd_db created"
ENDSSH
echo -e "${GREEN}✅ Database created successfully${NC}"
echo ""

# Step 5: Run database schema
echo -e "${YELLOW}[5/8] Running database schema...${NC}"
ssh ${UBUNTU_USER}@${UBUNTU_SERVER} << 'ENDSSH'
  # Run schema without sudo - use docker exec directly
  docker exec -i postgresql-16 psql -U nihdev -d taskgd_db < /data/Ninh/projects/taskgd/schema.sql
  echo "✅ Schema applied"
ENDSSH
echo -e "${GREEN}✅ Database schema applied${NC}"
echo ""

# Step 6: Install dependencies and start PM2
echo -e "${YELLOW}[6/8] Installing dependencies and starting PM2...${NC}"
ssh ${UBUNTU_USER}@${UBUNTU_SERVER} << 'ENDSSH'
  cd /data/Ninh/projects/taskgd
  npm install
  pm2 delete taskgd 2>/dev/null || true
  pm2 start ecosystem.config.js
  pm2 save
  echo "✅ PM2 process started"
ENDSSH
echo -e "${GREEN}✅ PM2 process started successfully${NC}"
echo ""

# Step 7: Update Cloudflare Tunnel config
echo -e "${YELLOW}[7/8] Updating Cloudflare Tunnel config...${NC}"
echo ""
echo -e "${BLUE}Please manually add this to /etc/cloudflared/config.yml:${NC}"
echo ""
echo -e "${GREEN}  - hostname: ${DOMAIN}${NC}"
echo -e "${GREEN}    service: http://localhost:${PORT}${NC}"
echo ""
echo -e "${BLUE}Then restart cloudflared:${NC}"
echo -e "${GREEN}  ssh ${UBUNTU_USER}@${UBUNTU_SERVER}${NC}"
echo -e "${GREEN}  echo '${SUDO_PASS}' | sudo -S systemctl restart cloudflared${NC}"
echo ""
read -p "Press Enter after updating Cloudflare config..."
echo ""

# Step 8: Verify deployment
echo -e "${YELLOW}[8/8] Verifying deployment...${NC}"
sleep 5
echo ""
echo -e "${BLUE}Testing API health...${NC}"
curl -I https://${DOMAIN}/api/health || echo -e "${RED}API not responding yet - may need a few seconds${NC}"
echo ""
echo -e "${BLUE}Testing frontend...${NC}"
curl -I https://${DOMAIN} || echo -e "${RED}Frontend not responding yet - may need a few seconds${NC}"
echo ""

# Final summary
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETED!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${GREEN}Project URL:${NC}      https://${DOMAIN}"
echo -e "${GREEN}API Health:${NC}       https://${DOMAIN}/api/health"
echo -e "${GREEN}PM2 Status:${NC}       ssh ${UBUNTU_USER}@${UBUNTU_SERVER} 'pm2 status'"
echo -e "${GREEN}PM2 Logs:${NC}         ssh ${UBUNTU_USER}@${UBUNTU_SERVER} 'pm2 logs ${PROJECT_NAME}'"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Update PORT_REGISTRY.md"
echo -e "  2. Test the application"
echo -e "  3. Create Synology folder: /Marketing/TASKGD/uploads/"
echo ""

