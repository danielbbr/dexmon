#!/bin/bash
# setup.sh

# install dependencies
npm install

# ensure nmap is installed
if ! command -v nmap &> /dev/null; then
    echo "installing nmap..."
    sudo apt-get update
    sudo apt-get install -y nmap
fi

# allow node to run nmap without password
echo "adding sudo permissions for nmap..."
echo "$USER ALL=(ALL) NOPASSWD: $(which nmap)" | sudo tee -a /etc/sudoers.d/botimon

echo "setup complete. run 'npm start' to start the server"