#!/bin/bash
# Find the process ID of the Node.js server
PID=$(ps aux | grep "node index.js" | grep -v grep | awk '{print $2}')

if [ -n "$PID" ]; then
  echo "Stopping Node.js server (PID: $PID)..."
  kill $PID
  sleep 2
  
  # Check if the process is still running
  if ps -p $PID > /dev/null; then
    echo "Server didn't stop gracefully, forcing termination..."
    kill -9 $PID
    sleep 1
  fi
  
  echo "Server stopped."
else
  echo "No Node.js server running."
fi

# Start the server again
echo "Starting Node.js server..."
cd backend
node index.js &
echo "Server started."