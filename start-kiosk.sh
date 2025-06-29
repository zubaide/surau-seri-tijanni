#!/bin/bash

# Improved start-kiosk.sh with better error handling and logging

LOG_FILE="/home/surau-st/masjid-display-system/startup.log"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to wait for network
wait_for_network() {
    log_message "Waiting for network connection..."
    while ! ping -c 1 google.com &> /dev/null; do
        sleep 5
    done
    log_message "Network connection established"
}

# Function to wait for X server
wait_for_display() {
    log_message "Waiting for display server..."
    while ! xset q &>/dev/null; do
        sleep 2
    done
    log_message "Display server ready"
}

cd "$SCRIPT_DIR" || exit 1

log_message "Starting Masjid Display System..."

# Wait for network and display
wait_for_network
wait_for_display

# Kill any existing instances
pkill -f "chromium"
pkill -f "node server/server.js"

# Wait a bit
sleep 5

log_message "Building application..."
npm run build 2>&1 | tee -a "$LOG_FILE"

log_message "Starting server..."
node server/server.js &
SERVER_PID=$!

# Wait for server to start
sleep 10

log_message "Starting kiosk mode..."
# Add GPU flags to reduce errors
chromium-browser \
    --kiosk \
    --no-sandbox \
    --disable-gpu \
    --disable-dev-shm-usage \
    --disable-software-rasterizer \
    --disable-extensions \
    --disable-plugins \
    --no-first-run \
    --disable-default-apps \
    --disable-infobars \
    --disable-features=TranslateUI \
    --autoplay-policy=no-user-gesture-required \
    http://localhost:3000 2>&1 | tee -a "$LOG_FILE" &

BROWSER_PID=$!

log_message "System started successfully. Server PID: $SERVER_PID, Browser PID: $BROWSER_PID"

# Keep script running
wait
