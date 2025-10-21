#!/bin/bash
# Quick attach to TASKGD development session
# Use this to reconnect after disconnection

SESSION_NAME="taskgd-dev"

echo "🔍 Checking for existing session..."

if tmux has-session -t $SESSION_NAME 2>/dev/null; then
    echo "✅ Found existing session!"
    echo "🔗 Attaching to: $SESSION_NAME"
    echo ""
    tmux attach-session -t $SESSION_NAME
else
    echo "❌ No session found."
    echo "🚀 Starting new session..."
    echo ""
    ~/start-dev.sh
fi

