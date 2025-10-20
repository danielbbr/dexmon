#!/bin/bash

# botimon Docker Management Script

set -e

# colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # no color

# function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# function to create data directory
setup_data_dir() {
    if [ ! -d "./data" ]; then
        print_status "Creating data directory for persistence..."
        mkdir -p ./data
        chmod 755 ./data
    else
        print_status "Data directory already exists"
    fi
}

# function to create .env file if it doesn't exist
setup_env() {
    if [ ! -f ".env" ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_warning "Please review and update .env file with your settings"
    fi
}

# function to build and start services
start() {
    print_status "Starting botimon..."
    check_docker
    setup_data_dir
    setup_env
    
    print_status "Building and starting containers..."
    docker compose up -d --build
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    print_status "botimon is running!"
}

# function to stop services
stop() {
    print_status "Stopping botimon..."
    docker compose down
    print_status "botimon stopped."
}

# function to restart services
restart() {
    print_status "Restarting botimon..."
    setup_data_dir
    docker compose restart
    print_status "botimon restarted."
}

# function to view logs
logs() {
    docker compose logs -f
}

# function to show status
status() {
    print_status "botimon Status:"
    docker compose ps
}

# function to clean up
clean() {
    print_warning "This will remove all containers, images, and data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up..."
        docker compose down -v --rmi all
        rm -rf ./data
        print_status "Cleanup completed."
    else
        print_status "Cleanup cancelled."
    fi
}

# function to show help
help() {
    echo "botimon Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start botimon services"
    echo "  stop      Stop botimon services"
    echo "  restart   Restart botimon services"
    echo "  logs      View logs"
    echo "  status    Show service status"
    echo "  clean     Remove all containers and data"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start the application"
    echo "  $0 logs     # View logs"
}

# main script logic
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        help
        exit 1
        ;;
esac
