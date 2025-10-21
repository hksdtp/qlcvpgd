#!/bin/bash
# Start TASKGD development session with tmux
# This keeps your work session alive even when disconnected

SESSION_NAME="taskgd-dev"

# Check if session exists
tmux has-session -t $SESSION_NAME 2>/dev/null

if [ $? != 0 ]; then
    echo "🚀 Creating new tmux session: $SESSION_NAME"
    echo ""
    
    # Create new session (detached)
    tmux new-session -d -s $SESSION_NAME -n "main"
    
    # Window 1: Main development
    tmux send-keys -t $SESSION_NAME:1 "cd /data/Ninh/projects/taskgd" C-m
    tmux send-keys -t $SESSION_NAME:1 "clear" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo ''" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '🎉 Welcome to TASKGD Development (tmux session)'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo ''" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '📱 Mobile-friendly tmux commands:'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  Ctrl+B then D  - Detach (keep session running)'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  Ctrl+B then C  - Create new window'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  Ctrl+B then N  - Next window'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  Ctrl+B then P  - Previous window'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  Ctrl+B then |  - Split vertical'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  Ctrl+B then -  - Split horizontal'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo ''" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '🤖 Auggie CLI commands:'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  auggie \"your request\"  - Use AI to code'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo ''" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '🔧 Development commands:'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  npm run server:dev  - Start dev server'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  git status          - Check git status'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '  pm2 list            - Check PM2 status'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo ''" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '💡 Tip: Your session persists even when disconnected!'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo '    Just run: ~/attach-dev.sh to reconnect'" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo ''" C-m
    
    # Window 2: Server/Logs
    tmux new-window -t $SESSION_NAME:2 -n "server"
    tmux send-keys -t $SESSION_NAME:2 "cd /data/Ninh/projects/taskgd/tqlcv" C-m
    tmux send-keys -t $SESSION_NAME:2 "echo '# Use this window to run dev server or view logs'" C-m
    tmux send-keys -t $SESSION_NAME:2 "echo '# npm run server:dev'" C-m
    
    # Window 3: Git
    tmux new-window -t $SESSION_NAME:3 -n "git"
    tmux send-keys -t $SESSION_NAME:3 "cd /data/Ninh/projects/taskgd" C-m
    tmux send-keys -t $SESSION_NAME:3 "echo '# Git commands window'" C-m
    tmux send-keys -t $SESSION_NAME:3 "echo '# git status'" C-m
    tmux send-keys -t $SESSION_NAME:3 "echo '# git log --oneline -10'" C-m
    
    # Window 4: Database
    tmux new-window -t $SESSION_NAME:4 -n "database"
    tmux send-keys -t $SESSION_NAME:4 "echo '# Database commands'" C-m
    tmux send-keys -t $SESSION_NAME:4 "echo '# docker exec -it postgresql-16 psql -U nihdev -d taskgd_db'" C-m
    
    # Select first window
    tmux select-window -t $SESSION_NAME:1
    
    echo "✅ Session created with 4 windows:"
    echo "   1. main     - Main development"
    echo "   2. server   - Dev server / logs"
    echo "   3. git      - Git commands"
    echo "   4. database - Database access"
    echo ""
else
    echo "✅ Session already exists, attaching..."
    echo ""
fi

# Attach to session
echo "🔗 Attaching to session..."
echo ""
tmux attach-session -t $SESSION_NAME

