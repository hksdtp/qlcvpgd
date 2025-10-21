#!/bin/bash

# SSH Connection Test Script
# Tests various aspects of SSH connection to Ubuntu server

SERVER="nihdev@100.115.191.19"

echo "============================================"
echo "SSH Connection Diagnostics"
echo "============================================"
echo ""

# Test 1: Ping
echo "1. Testing network connectivity (ping)..."
ping -c 3 100.115.191.19 > /tmp/ping_test.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Ping successful"
    tail -2 /tmp/ping_test.txt
else
    echo "❌ Ping failed"
    cat /tmp/ping_test.txt
fi
echo ""

# Test 2: SSH port check
echo "2. Testing SSH port (22)..."
nc -zv -w 5 100.115.191.19 22 > /tmp/port_test.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ SSH port 22 is open"
    cat /tmp/port_test.txt
else
    echo "❌ SSH port 22 is not accessible"
    cat /tmp/port_test.txt
fi
echo ""

# Test 3: Simple SSH command
echo "3. Testing simple SSH command..."
timeout 10 ssh -o ConnectTimeout=5 -o ServerAliveInterval=2 $SERVER 'echo "SSH OK"' > /tmp/ssh_test.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ SSH command successful"
    cat /tmp/ssh_test.txt
else
    echo "❌ SSH command failed or timed out"
    cat /tmp/ssh_test.txt
fi
echo ""

# Test 4: SSH with longer command
echo "4. Testing SSH with file listing..."
timeout 10 ssh -o ConnectTimeout=5 $SERVER 'ls -la /data/Ninh/projects/taskgd/ | head -5' > /tmp/ssh_ls.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ SSH file listing successful"
    cat /tmp/ssh_ls.txt
else
    echo "❌ SSH file listing failed"
    cat /tmp/ssh_ls.txt
fi
echo ""

# Test 5: Check SSH config
echo "5. Checking SSH configuration..."
if [ -f ~/.ssh/config ]; then
    echo "SSH config exists"
    grep -A 5 "100.115.191.19" ~/.ssh/config || echo "No specific config for this host"
else
    echo "No SSH config file found"
fi
echo ""

# Test 6: Check known_hosts
echo "6. Checking known_hosts..."
if grep -q "100.115.191.19" ~/.ssh/known_hosts 2>/dev/null; then
    echo "✅ Host key exists in known_hosts"
else
    echo "⚠️  Host key not in known_hosts (first connection?)"
fi
echo ""

# Test 7: SSH verbose connection test
echo "7. Testing SSH connection (verbose)..."
timeout 10 ssh -v -o ConnectTimeout=5 $SERVER 'exit' > /tmp/ssh_verbose.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Verbose SSH test successful"
    echo "Last 10 lines:"
    tail -10 /tmp/ssh_verbose.txt
else
    echo "❌ Verbose SSH test failed"
    echo "Last 20 lines:"
    tail -20 /tmp/ssh_verbose.txt
fi
echo ""

echo "============================================"
echo "Diagnostics Complete"
echo "============================================"
echo ""
echo "Summary:"
echo "- Ping: Check output above"
echo "- SSH Port: Check output above"
echo "- SSH Commands: Check output above"
echo ""
echo "If SSH commands are timing out, possible causes:"
echo "1. Firewall blocking SSH"
echo "2. SSH daemon not running"
echo "3. Network latency issues"
echo "4. SSH config issues"
echo "5. Authentication issues"
echo ""
echo "Recommendation:"
echo "- Try manual SSH: ssh $SERVER"
echo "- Check server logs: journalctl -u ssh -n 50"
echo "- Check SSH daemon: systemctl status ssh"

