# dexmon

a network device monitoring browser app for local networks. scan and manage devices connected to your local network.

## features

- scan local network devices using nmap
- identify device vendors by mac address
- persistent data storage

## quick start

```bash
# start the application
sudo ./dexmon.sh start

# view all options
./dexmon.sh --help
```

## requirements

- docker and docker compose
- sudo access for network scanning

## configuration

copy `env.example` to `.env` and adjust settings as needed:

```bash
cp env.example .env
```
## development

the application consists of:

- `backend/` - Node.js api server with SQLite database.
- `frontend/` - React frontend with Vite
- `docker-compose.yml` - container orchestration
- `dexmon.sh` - management script
