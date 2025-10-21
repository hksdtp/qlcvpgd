#!/bin/bash

# ============================================
# TASKGD Full Project Sync to Ubuntu Server
# ============================================
# Syncs entire project from Mac to Ubuntu server
# for remote development via SSH Tailscale
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
UBUNTU_SERVER="100.115.191.19"
UBUNTU_USER="nihdev"
SERVER_PATH="/data/Ninh/projects/taskgd"
LOCAL_PATH="$(pwd)"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}TASKGD Full Project Sync${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "Local Path:   ${LOCAL_PATH}"
echo -e "Server:       ${UBUNTU_USER}@${UBUNTU_SERVER}"
echo -e "Server Path:  ${SERVER_PATH}"
echo ""

# Step 1: Sync Git repository
echo -e "${YELLOW}[1/4] Syncing Git repository...${NC}"
rsync -avz \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  .git/ ${UBUNTU_USER}@${UBUNTU_SERVER}:${SERVER_PATH}/.git/
echo -e "${GREEN}✅ Git repository synced${NC}"
echo ""

# Step 2: Sync project files
echo -e "${YELLOW}[2/4] Syncing project files...${NC}"
rsync -avz \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude 'tqlcv/node_modules' \
  --exclude 'tqlcv/dist' \
  . ${UBUNTU_USER}@${UBUNTU_SERVER}:${SERVER_PATH}/

echo -e "${GREEN}✅ Project files synced${NC}"
echo ""

# Step 3: Copy server setup script
echo -e "${YELLOW}[3/4] Copying server setup script...${NC}"
scp server-setup.sh ${UBUNTU_USER}@${UBUNTU_SERVER}:${SERVER_PATH}/
echo -e "${GREEN}✅ Setup script copied${NC}"
echo ""

# Step 4: Run server setup
echo -e "${YELLOW}[4/4] Running server setup (this may take a few minutes)...${NC}"
echo -e "${BLUE}Installing dependencies on server...${NC}"
ssh ${UBUNTU_USER}@${UBUNTU_SERVER} "cd ${SERVER_PATH} && bash server-setup.sh"
echo -e "${GREEN}✅ Server setup completed${NC}"
echo ""

# Summary
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✅ SYNC COMPLETED!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${BLUE}Server Information:${NC}"
echo -e "  SSH Access:       ssh ${UBUNTU_USER}@${UBUNTU_SERVER}"
echo -e "  Tailscale SSH:    ssh ${UBUNTU_USER}@<tailscale-ip>"
echo -e "  Project Path:     ${SERVER_PATH}"
echo ""
echo -e "${BLUE}Development Commands:${NC}"
echo -e "  Start Dev Server: cd ${SERVER_PATH}/tqlcv && npm run server:dev"
echo -e "  Build Frontend:   cd ${SERVER_PATH}/tqlcv && npm run build"
echo -e "  PM2 Status:       pm2 status"
echo -e "  PM2 Logs:         pm2 logs taskgd"
echo ""
echo -e "${BLUE}Git Commands:${NC}"
echo -e "  Git Status:       cd ${SERVER_PATH} && git status"
echo -e "  Git Pull:         cd ${SERVER_PATH} && git pull"
echo -e "  Git Commit:       cd ${SERVER_PATH} && git add . && git commit -m 'message'"
echo ""
echo -e "${YELLOW}Note: You can now use Auggie CLI on the server via SSH Tailscale${NC}"
echo ""

