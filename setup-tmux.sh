#!/bin/bash

# Setup tmux for persistent SSH sessions
# This allows you to keep your work session even when disconnected

SERVER="nihdev@100.115.191.19"

echo "============================================"
echo "Setting up tmux on Ubuntu Server"
echo "============================================"
echo ""

echo "1. Installing tmux..."
ssh $SERVER 'sudo apt update && sudo apt install -y tmux'
echo ""

echo "2. Creating tmux configuration..."
ssh $SERVER 'cat > ~/.tmux.conf << "EOF"
# tmux configuration for better mobile SSH experience

# Enable mouse support (useful for mobile)
set -g mouse on

# Increase scrollback buffer
set -g history-limit 10000

# Start window numbering at 1
set -g base-index 1

# Renumber windows when one is closed
set -g renumber-windows on

# Status bar
set -g status-bg colour235
set -g status-fg colour136
set -g status-left "#[fg=green]Session: #S #[fg=yellow]| "
set -g status-right "#[fg=cyan]%d %b %R"

# Highlight active window
set-window-option -g window-status-current-style bg=colour240,fg=colour255

# Enable activity alerts
setw -g monitor-activity on
set -g visual-activity on

# Easier pane navigation
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Split panes using | and -
bind | split-window -h
bind - split-window -v

# Reload config
bind r source-file ~/.tmux.conf \; display "Config reloaded!"
EOF
'
echo ""

echo "3. Creating helper scripts..."

# Create start-dev script
ssh $SERVER 'cat > ~/start-dev.sh << "EOF"
#!/bin/bash
# Start development session with tmux

SESSION_NAME="taskgd-dev"

# Check if session exists
tmux has-session -t $SESSION_NAME 2>/dev/null

if [ $? != 0 ]; then
    echo "Creating new tmux session: $SESSION_NAME"
    
    # Create new session
    tmux new-session -d -s $SESSION_NAME -n "main"
    
    # Window 1: Main development
    tmux send-keys -t $SESSION_NAME:1 "cd /data/Ninh/projects/taskgd" C-m
    tmux send-keys -t $SESSION_NAME:1 "clear" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo \"Welcome to TASKGD Development\"" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo \"\"" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo \"Quick commands:\"" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo \"  auggie \\\"your request\\\"  - Use Auggie CLI\"" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo \"  npm run server:dev      - Start dev server\"" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo \"  git status              - Check git status\"" C-m
    tmux send-keys -t $SESSION_NAME:1 "echo \"\"" C-m
    
    # Window 2: Server logs
    tmux new-window -t $SESSION_NAME:2 -n "logs"
    tmux send-keys -t $SESSION_NAME:2 "cd /data/Ninh/projects/taskgd" C-m
    tmux send-keys -t $SESSION_NAME:2 "# Use this window for server logs or monitoring" C-m
    
    # Window 3: Database
    tmux new-window -t $SESSION_NAME:3 -n "database"
    tmux send-keys -t $SESSION_NAME:3 "# Database commands" C-m
    tmux send-keys -t $SESSION_NAME:3 "# docker exec -it postgresql-16 psql -U nihdev -d taskgd_db" C-m
    
    # Select first window
    tmux select-window -t $SESSION_NAME:1
    
    echo "Session created!"
else
    echo "Session already exists, attaching..."
fi

# Attach to session
tmux attach-session -t $SESSION_NAME
EOF
chmod +x ~/start-dev.sh
'

# Create quick-attach script
ssh $SERVER 'cat > ~/attach-dev.sh << "EOF"
#!/bin/bash
# Quick attach to existing session

SESSION_NAME="taskgd-dev"

if tmux has-session -t $SESSION_NAME 2>/dev/null; then
    echo "Attaching to existing session..."
    tmux attach-session -t $SESSION_NAME
else
    echo "No session found. Starting new session..."
    ~/start-dev.sh
fi
EOF
chmod +x ~/attach-dev.sh
'

echo ""
echo "============================================"
echo "tmux Setup Complete!"
echo "============================================"
echo ""
echo "Usage:"
echo ""
echo "1. SSH to server:"
echo "   ssh $SERVER"
echo ""
echo "2. Start development session:"
echo "   ~/start-dev.sh"
echo ""
echo "3. Or quick attach:"
echo "   ~/attach-dev.sh"
echo ""
echo "4. Detach (keep session running):"
echo "   Press: Ctrl+B then D"
echo ""
echo "5. Reconnect anytime:"
echo "   ssh $SERVER"
echo "   ~/attach-dev.sh"
echo ""
echo "Your session will persist even if:"
echo "  - SSH disconnects"
echo "  - Mobile screen turns off"
echo "  - You close SSH app"
echo "  - Network changes"
echo ""
echo "============================================"

