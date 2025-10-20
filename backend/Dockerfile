# Use Node.js 18 Alpine for smaller image
FROM node:18-alpine

# Install system dependencies needed for network scanning
RUN apk add --no-cache \
    nmap \
    iproute2 \
    net-tools \
    sudo

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user for security
RUN adduser -D -s /bin/sh botimon && \
    echo 'botimon ALL=(ALL) NOPASSWD: /usr/bin/nmap' >> /etc/sudoers && \
    mkdir -p /app/data && \
    chown -R botimon:botimon /app

# Switch to non-root user
USER botimon

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/devices', (res) => { process.exit(res.statusCode === 401 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
