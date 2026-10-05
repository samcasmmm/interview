# 🐳 Docker & Containerization Interview Master Guide (50 Questions)

> A comprehensive, production-grade guide containing **50 in-depth interview questions, internal architectural breakdowns, security best practices, and Dockerfile/Compose configurations** for modern software engineering and DevOps interviews.

---

## 📑 Table of Contents

- [1. Docker Fundamentals & Architecture (Q1–Q10)](#1-docker-fundamentals--architecture)
- [2. Dockerfile & Image Optimization (Q11–Q20)](#2-dockerfile--image-optimization)
- [3. Storage, Volumes & Persistence (Q21–Q27)](#3-storage-volumes--persistence)
- [4. Docker Networking & DNS (Q28–Q34)](#4-docker-networking--dns)
- [5. Docker Compose & Multi-Container Workflows (Q35–Q40)](#5-docker-compose--multi-container-workflows)
- [6. Container Security & Production Hardening (Q41–Q46)](#6-container-security--production-hardening)
- [7. Debugging, Monitoring & Performance (Q47–Q50)](#7-debugging-monitoring--performance)

---

# 🚀 50 In-Depth Interview Questions & Answers

---

### 1. Docker Fundamentals & Architecture

#### 1. What is Docker, and what problem does it solve in software development?
Docker is an open-source platform that packages applications and all their dependencies (runtime, system libraries, configuration files) into standardized units called **containers**.
- **Problem Solved**: Eliminates the classic *"it works on my machine"* bug by providing consistent, immutable runtime environments across local development, CI/CD pipelines, staging, and production.
- **Key Advantage**: Unlike hardware-virtualized VMs, containers share the host OS kernel, making them lightweight, fast to boot (milliseconds), and highly resource-efficient.

---

#### 2. What are the key architectural differences between a Virtual Machine (VM) and a Docker Container?

| Feature | Virtual Machine (VM) | Docker Container |
| :--- | :--- | :--- |
| **Architecture** | Runs a complete Guest OS on top of a Hypervisor (Type 1 or 2). | Shares the host Linux/Windows kernel directly. |
| **Resource Overhead** | Heavy (requires dedicated RAM/vCPU allocations per VM). | Extremely low (uses host resources dynamically). |
| **Startup Time** | Minutes (boots full operating system). | Milliseconds to seconds (starts a sandboxed process). |
| **Isolation** | Hardware-level virtualization (hypervisor). | Process-level isolation via Linux kernel primitives. |
| **Storage Footprint** | Gigabytes (10–50 GB per VM). | Megabytes (50–300 MB per image). |

---

#### 3. What Linux kernel primitives make Docker containerization possible?
Docker relies on two primary Linux kernel subsystems:
1. **Namespaces (Isolation)**: Isolates what a process can **see**.
   - `pid`: Process tree isolation (container PID 1 maps to a standard PID on the host).
   - `net`: Isolated network interfaces, routing tables, and port bindings.
   - `mnt`: Isolated filesystem mount points.
   - `ipc`: Inter-process communication isolation (shared memory, semaphores).
   - `uts`: Independent hostname and domain name.
   - `user`: Maps root UID 0 inside the container to an unprivileged UID on the host.
2. **Cgroups / Control Groups (Resource Metering & Throttling)**: Enforces limits on what a process can **use** (CPU cores, memory limits, swap, I/O bandwidth).

---

#### 4. Explain the difference between a Dockerfile, Docker Image, and Docker Container.
- **Dockerfile**: A plain-text declarative configuration script containing instructions (`FROM`, `RUN`, `COPY`, `CMD`) used by `docker build` to assemble an image.
- **Docker Image**: An immutable, read-only, layered snapshot containing the application binaries, dependencies, system libraries, and default metadata.
- **Docker Container**: A runnable, isolated runtime instance created from an image via `docker run`, adding a thin read-write container layer on top of the immutable image layers.

---

#### 5. Explain Docker Engine architecture: Client, Daemon (`dockerd`), `containerd`, and `runc`.
- **Docker CLI**: The client tool (`docker run`, `docker build`) that sends REST API commands to the daemon.
- **`dockerd`**: The Docker daemon managing images, networks, volumes, and API endpoints.
- **`containerd`**: The Open Container Initiative (OCI)-compliant container runtime manager that manages container lifecycle, image distribution, and snapshot storage.
- **`runc`**: A lightweight CLI tool used by `containerd` to directly interact with Linux kernel namespaces and cgroups to spawn the actual container process.
- **Shim (`containerd-shim`)**: Keeps container standard I/O and process tracking alive even if the Docker daemon restarts (daemon-less containers).

---

#### 6. What is the Union File System (UnionFS / OverlayFS) in Docker?
UnionFS is a file system service that allows multiple directories (called layers) to be overlaid on top of each other, appearing as a single unified directory structure.
- In Docker, **Overlay2** is the standard storage driver.
- Lower layers (image layers) are **read-only**.
- The top layer (container layer) is **read-write**.
- Uses **Copy-on-Write (CoW)**: When a container modifies a file from an underlying image layer, OverlayFS copies the file up to the writable container layer before applying changes.

---

#### 7. What happens under the hood when you execute `docker run -d -p 8080:80 nginx`?
1. **CLI Parsing**: The Docker CLI parses flags and translates the request into an HTTP REST call to `dockerd`.
2. **Image Resolution**: `dockerd` checks the local image cache for `nginx:latest`. If missing, it downloads image layers from Docker Hub.
3. **Layer Assembly**: `containerd` configures the OverlayFS graph driver and creates a read-write layer.
4. **Namespace & Cgroups Setup**: `runc` calls Linux kernel syscalls (`clone`, `unshare`) to isolate namespaces (`pid`, `net`, `mnt`) and sets memory/CPU limits.
5. **Bridge Networking**: `dockerd` assigns an internal IP (`172.17.0.x`) from `docker0` bridge and injects an `iptables` NAT port-forwarding rule (`0.0.0.0:8080 -> 172.17.0.x:80`).
6. **Execution**: Nginx starts as PID 1 within the isolated container namespace.

---

#### 8. What is the difference between `docker stop`, `docker kill`, and `docker pause`?
- **`docker stop <id>`**: Sends `SIGTERM` to the container process (PID 1), allowing a grace period (default 10s) for graceful shutdown (flushing buffers, closing DB pools). If it doesn't exit, it sends `SIGKILL`.
- **`docker kill <id>`**: Sends immediate `SIGKILL` (or a custom signal via `--signal`), instantly terminating the process without cleanup.
- **`docker pause <id>`**: Uses the Linux **cgroup freezer** subsystem to suspend all process execution threads in place without terminating them. `docker unpause` resumes execution instantly.

---

#### 9. What is PID 1 in a Docker container, and what is the "Zombie Reaping" problem?
In Linux, PID 1 (usually `systemd` or `init`) is responsible for adopting orphaned child processes and reaping their exit status when they terminate.
- When running Node.js or Python directly as PID 1 inside a container, they often lack built-in signal forwarding (`SIGINT`/`SIGTERM`) and zombie reaping logic.
- **Result**: Subprocesses spawned by the app that die become defunct/zombie processes, causing memory/PID leaks.
- **Solution**: Use lightweight init systems such as **Tini** or the Docker `--init` flag:
```bash
docker run --init -d my-node-app
```

---

#### 10. What is the difference between `ENTRYPOINT` and `CMD` in a Dockerfile?
- **`ENTRYPOINT`**: Specifies the fixed executable that should always run when the container starts.
- **`CMD`**: Provides default arguments passed to the `ENTRYPOINT` (or acts as the default command if `ENTRYPOINT` is omitted).
- **Overriding**:
  - `CMD` is easily overridden by arguments supplied at `docker run` (e.g., `docker run my-image npm test`).
  - `ENTRYPOINT` requires `--entrypoint` flag to override.

```dockerfile
# Exec Form (Preferred):
ENTRYPOINT ["node"]
CMD ["dist/server.js"]

# Running: `docker run my-app` executes -> `node dist/server.js`
# Running: `docker run my-app dist/worker.js` executes -> `node dist/worker.js`
```

---

### 2. Dockerfile & Image Optimization

#### 11. What is a Docker Multi-Stage Build and why is it essential for production?
Multi-stage builds allow you to define multiple `FROM` instructions within a single Dockerfile.
- **Advantage**: Artifacts (compiled binaries, minified bundles, production `node_modules`) are copied from temporary build stages into a clean, minimal runtime stage.
- **Result**: Image sizes drop from 1GB+ (with TypeScript compiler, build tools, SDKs) to ~50–150MB, stripping development dependencies and attack surfaces.

```dockerfile
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src
RUN npm run build

# Stage 2: Minimal runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

#### 12. How does Docker layer caching work, and how do you optimize instruction order?
Docker caches the result of each step in a Dockerfile. If a step's inputs haven't changed, Docker reuses the cached layer from previous builds.
- **Rule**: Place frequently changing instructions (e.g., `COPY . .`) as late as possible, and rarely changing instructions (e.g., system package installs, dependency manifests) as early as possible.

```dockerfile
# ❌ BAD: Invalidates cache on every single code change
COPY . .
RUN npm install

# ✅ GOOD: Reuses cached dependencies unless package.json changes
COPY package*.json ./
RUN npm ci
COPY . .
```

---

#### 13. What is `.dockerignore` and why is it critical?
The `.dockerignore` file prevents unnecessary, large, or sensitive files from being sent to the Docker daemon as the build context.
- **Benefits**: Accelerates build time, prevents secret leaks (`.env`), and prevents local `node_modules` (compiled for the host OS) from corrupting the container build.

```
# Example .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env*
dist
coverage
Dockerfile
.dockerignore
```

---

#### 14. What are the differences between Alpine, Debian/Ubuntu, and Distroless base images?
- **Alpine Linux (`node:alpine`)**: Uses `musl libc` and `BusyBox`. Extremely small (~5MB base). *Caveat*: Certain native C/C++ bindings (e.g., `bcrypt`, `sharp`, `grpc`) may compile slower or face compatibility issues with `musl`.
- **Debian / Ubuntu (`node:bookworm-slim`)**: Uses standard `glibc`. Highly compatible with native extensions, slightly larger (~70–120MB).
- **Distroless (`gcr.io/distroless/nodejs`)**: Contains **only** the application and its runtime dependencies. No shell (`/bin/sh`), no package managers (`apk`, `apt`), no utility commands. Offers the lowest security vulnerability surface.

---

#### 15. What is the difference between `ADD` and `COPY` instructions?
- **`COPY`**: Copies local files/directories from the build context directly into the container filesystem. Best practice for 95% of use cases.
- **`ADD`**: Does everything `COPY` does, plus:
  1. Auto-extracts local compressed archives (`tar.gz`, `tar.bz2`) into the destination directory.
  2. Downloads remote files from HTTP/HTTPS URLs (not recommended because it doesn't clean cache layers).

---

#### 16. What is the difference between the "Shell form" and "Exec form" for `RUN`, `CMD`, and `ENTRYPOINT`?
- **Shell Form (`CMD node server.js`)**: Executes the command inside `/bin/sh -c`.
  - *Problem*: The shell becomes PID 1 instead of your application, swallowing OS signals like `SIGTERM`.
- **Exec Form (`CMD ["node", "server.js"]`)**: Directly invokes the binary without spawning a subshell.
  - *Benefit*: Application runs as PID 1 and receives OS termination signals cleanly. Always prefer the **Exec form**.

---

#### 17. How do you reduce the number of image layers in a Dockerfile?
Every `RUN`, `COPY`, and `ADD` creates a new layer. To minimize layers and cleanup temporary cache files in the same layer:
```dockerfile
# Combine commands using && and delete package caches in the same RUN layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*
```

---

#### 18. What are BuildKit and Buildx, and what benefits do they provide?
- **BuildKit**: Docker's modern build engine replacing the legacy builder.
  - **Features**: Parallel stage execution, build cache mounts (`RUN --mount=type=cache,target=/root/.npm`), secret mounts during build (`--mount=type=secret`), and remote cache exporters.
- **Docker Buildx**: A CLI plugin extending Docker build capabilities to create multi-architecture images (e.g., `linux/amd64` and `linux/arm64` for Apple Silicon & AWS Graviton).

```bash
# Multi-arch build and push
docker buildx build --platform linux/amd64,linux/arm64 -t myrepo/app:v1 --push .
```

---

#### 19. What is the difference between `ARG` and `ENV` in a Dockerfile?
- **`ARG` (Build-time variable)**: Available only during image build time (`docker build --build-arg VERSION=1.0.0`). It is **not** persisted in the running container environment.
- **`ENV` (Runtime environment variable)**: Persists in both the image metadata and the running container environment (`docker run -e PORT=8080`).

---

#### 20. How do you implement a robust Docker `HEALTHCHECK`?
The `HEALTHCHECK` instruction tells Docker how to test a container to check that it is still working properly (e.g., not stuck in an infinite loop or deadlock).

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health/live || exit 1
```
- Status transitions: `starting` -> `healthy` -> `unhealthy`.
- Orchestrators (Docker Swarm, Kubernetes) use health checks to restart failing instances.

---

### 3. Storage, Volumes & Persistence

#### 21. What are the three primary types of storage mounts in Docker?
1. **Named Volumes**: Managed entirely by Docker in host storage (`/var/lib/docker/volumes/`). Ideal for databases (PostgreSQL, MySQL, MongoDB).
2. **Bind Mounts**: Maps an arbitrary directory or file on the host directly into the container (`-v /local/path:/container/path`). Ideal for local dev source code syncing.
3. **`tmpfs` Mounts**: Stored in host memory (RAM) only. Never written to the host disk or container writable layer. Ideal for sensitive secrets or fast ephemeral caches.

---

#### 22. How do you persist PostgreSQL or MySQL database data across container restarts?
Containers are ephemeral; all data in the writable container layer is lost if deleted. Data is persisted using Docker Named Volumes.

```bash
# Create persistent named volume
docker volume create pg_data

# Run PostgreSQL container attached to the volume
docker run -d \
  --name postgres-prod \
  -e POSTGRES_PASSWORD=secretpassword \
  -v pg_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine
```

---

#### 23. What is the difference between anonymous volumes and named volumes?
- **Anonymous Volume (`-v /var/lib/mysql/data`)**: Docker generates a random 64-character UUID hash as the name. Difficult to track and prone to becoming orphaned dangling volumes.
- **Named Volume (`-v my_db_data:/var/lib/mysql/data`)**: Explicitly named, easy to reference, backup, and share across multiple containers.

---

#### 24. How do you back up and restore data from a Docker Named Volume?
You can mount the volume alongside a host directory into a temporary container:

```bash
# Backup volume to a tar archive on the host
docker run --rm \
  -v pg_data:/data:ro \
  -v $(pwd):/backup \
  alpine tar -czvf /backup/pg_data_backup.tar.gz -C /data .

# Restore archive back into a new volume
docker run --rm \
  -v pg_data_new:/data \
  -v $(pwd):/backup \
  alpine sh -c "tar -xzvf /backup/pg_data_backup.tar.gz -C /data"
```

---

#### 25. What happens when a container writes to a file in an image layer vs a mounted volume?
- **Image Layer File**: Triggers **Copy-on-Write (CoW)** via OverlayFS. The file is copied to the top writable container layer. Performance has minor I/O latency overhead.
- **Mounted Volume**: Bypasses the UnionFS storage driver entirely. Writes directly to the host filesystem at native disk I/O speeds.

---

#### 26. How do you clean up dangling images, stopped containers, and unused volumes?
```bash
# Remove all stopped containers, unused networks, and dangling images
docker system prune

# Comprehensive cleanup (includes unused volumes and all unused images)
docker system prune -a --volumes -f
```

---

#### 27. What is a read-only container filesystem and why use it?
Running containers with a read-only root filesystem prevents malicious actors or compromised dependencies from writing binaries or tampering with system files:
```bash
docker run --read-only --tmpfs /tmp --tmpfs /run -d my-secure-app
```

---

### 4. Docker Networking & DNS

#### 28. What are the built-in Docker Network Drivers?
1. **`bridge` (Default)**: Creates a private software bridge (`docker0`) on the host. Containers get private IPs and communicate via NAT/port-forwarding.
2. **`host`**: Disables network isolation; the container shares the host's network stack and IP directly (maximum performance, no port mapping needed).
3. **`none`**: Completely disables all networking for the container (isolated compute/batch processing).
4. **`overlay`**: Enables multi-host networking across different Docker hosts in Docker Swarm or Kubernetes clusters.
5. **`macvlan`**: Assigns a direct MAC address to the container, making it appear as a physical device on the physical network.

---

#### 29. How does Docker's embedded DNS server work for container communication?
- On the **default bridge network**, containers can only communicate with each other using IP addresses (or legacy `--link`).
- On **user-defined bridge networks** (`docker network create my-net`), Docker runs an embedded DNS server at `127.0.0.11` that automatically resolves **container names** and **service aliases** to their internal IP addresses.

```bash
# Create custom network
docker network create backend-net

# Run Redis
docker run -d --name redis-server --network backend-net redis:alpine

# Node app can connect to "redis://redis-server:6379" directly by container name!
docker run -d --name api-service --network backend-net -p 3000:3000 my-api
```

---

#### 30. What is the difference between exposing a port (`EXPOSE`) and publishing a port (`-p` / `-P`)?
- **`EXPOSE 3000` (Dockerfile)**: Metadata documentation indicating which port the application listens on. It **does not** open or forward the port to the host machine.
- **`-p 8080:3000` (CLI)**: Actively publishes container port 3000 to host port 8080 by injecting `iptables` NAT forwarding rules.
- **`-P` (Publish All)**: Maps all exposed ports to random high-range ephemeral ports (e.g., `32768+`) on the host.

---

#### 31. How does Docker manipulate Linux `iptables` for port mapping?
When a container port is published (`-p 80:80`), Docker creates custom chains in `iptables` (called `DOCKER` and `DOCKER-USER`). It configures Network Address Translation (DNAT) rules so incoming packets on the host port are rewritten and forwarded to the container's private IP.

---

#### 32. How can two containers talk to each other across different hosts without Kubernetes?
1. **Docker Swarm Overlay Network**: Uses VXLAN tunnels (UDP port 4789) to encapsulate Layer 2 Ethernet frames over Layer 3 IP networks.
2. **WireGuard / VPN Mesh (Tailscale, Nebula)**: Containers join a secure software-defined encrypted mesh network.
3. **Host Port Forwarding + External Reverse Proxy (Nginx/HAProxy)**.

---

#### 33. Why shouldn't you run production workloads on the default `docker0` bridge network?
1. Lacks automatic container name DNS resolution.
2. All unassigned containers default to it, creating security risks (no isolation between unrelated containers).
3. Cannot configure fine-grained MTU or subnet rules dynamically.

---

#### 34. How do you inspect the IP address and network details of a running container?
```bash
# Format specific IP address
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name

# Inspect entire network topology
docker network inspect bridge
```

---

### 5. Docker Compose & Multi-Container Workflows

#### 35. What is Docker Compose and what are its primary use cases?
Docker Compose is a declarative YAML-based tool (`compose.yaml`) for defining, configuring, and orchestrating multi-container applications (e.g., API + PostgreSQL + Redis + Nginx) with single-command lifecycle management (`docker compose up -d`).

---

#### 36. Provide a production-ready `compose.yaml` with an API, PostgreSQL, Redis, and health checks.

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:password@postgres:5432/appdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    networks:
      - app-network

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redisdata:/data
    networks:
      - app-network

volumes:
  pgdata:
  redisdata:

networks:
  app-network:
    driver: bridge
```

---

#### 37. What is the difference between `depends_on` with and without `condition: service_healthy`?
- **Basic `depends_on`**: Only guarantees that the dependency container has **started** (i.e. process spawned). It does **not** wait for the database/service to finish initializing.
- **`depends_on` with `condition: service_healthy`**: Delays starting the dependent service until the upstream container passes its defined `healthcheck` probe (e.g., PostgreSQL is ready to accept socket connections).

---

#### 38. How do you override Compose configurations for Development vs Production?
Use multiple Compose files merged via `-f`:
```bash
# Starts using base compose.yaml + overrides from compose.prod.yaml
docker compose -f compose.yaml -f compose.prod.yaml up -d
```
- `compose.yaml`: Base services, networks, volumes.
- `compose.override.yaml` (auto-loaded): Dev volumes (bind mounts) and debug ports.
- `compose.prod.yaml`: Resource limits, restart policies, production secrets.

---

#### 39. What is the difference between `docker compose up`, `docker compose start`, and `docker compose run`?
- **`docker compose up`**: Builds, (re)creates, starts, and attaches to containers for all services defined in the configuration.
- **`docker compose start`**: Restarts already created, stopped containers without rebuilding or re-evaluating configuration changes.
- **`docker compose run service_name cmd`**: Spawns a one-off container for a specific service (e.g., `docker compose run api npm run migration:run`), mapping its volumes and network links.

---

#### 40. How do you scale a service horizontally using Docker Compose?
```bash
# Scale API service to 5 instances
docker compose up -d --scale api=5
```
*(Note: To avoid port conflicts on the host, the `api` service must either use random port ranges or be load-balanced behind an Nginx/Traefik reverse proxy).*

---

### 6. Container Security & Production Hardening

#### 41. Why is running containers as `root` dangerous, and how do you prevent it?
By default, container processes run as `root` (UID 0). If a vulnerability allows a container breakout, the attacker gains full `root` capabilities over the host kernel.
- **Remediation**:
  1. Create and switch to a non-privileged user in the Dockerfile:
  ```dockerfile
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser
  ```
  2. Enforce `USER` flag in CLI: `docker run --user 1001:1001 my-image`.
  3. Enable **Docker User Namespaces Remapping** (`userns-remap`) in `/etc/docker/daemon.json`.

---

#### 42. How do you scan Docker images for security vulnerabilities (CVEs)?
1. **Docker Scout**: `docker scout cves <image-name>`.
2. **Trivy (Aqua Security)**: `trivy image --severity HIGH,CRITICAL <image-name>`.
3. **Grype / Snyk / Clair**: Integrated directly into CI/CD pipelines to fail builds if unpatched critical CVEs are detected.

---

#### 43. What are Linux Capabilities and how should they be restricted in Docker?
Linux divides root privileges into distinct units called **Capabilities**. Docker drops dangerous capabilities by default, but you should drop all and whitelist only required ones:
```bash
# Drop all capabilities, add only capability to bind low ports (80/443)
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE my-secure-app
```

---

#### 44. How should production secrets (API keys, DB passwords) be passed to containers?
- ❌ **Never** hardcode in Dockerfile (`ENV DB_PASS=secret` remains visible in image layers via `docker history`).
- ❌ **Avoid** passing secrets in plain `docker run -e` command lines (visible in process lists `ps aux`).
- ✅ **Use**:
  1. BuildKit secret mounts for build time: `RUN --mount=type=secret,id=npmrc npm install`.
  2. Orchestrator secret managers (Kubernetes Secrets, AWS Secrets Manager, HashiCorp Vault).
  3. Docker Secrets (Swarm) mounted as files under `/run/secrets/`.

---

#### 45. What is the `--security-opt no-new-privileges` flag?
It prevents container processes from gaining additional privileges via `setuid` or `setgid` binaries (e.g., executing `sudo` inside a container to escalate privileges):
```bash
docker run --security-opt=no-new-privileges:true my-app
```

---

#### 46. What is Seccomp (Secure Computing Mode) and AppArmor in Docker?
- **Seccomp**: A Linux kernel security facility that filters and restricts the system calls (syscalls) a container can make to the host kernel (Docker applies a default seccomp profile blocking ~44 syscalls like `reboot`, `clock_settime`).
- **AppArmor / SELinux**: Mandatory Access Control (MAC) systems providing fine-grained restrictions on file paths, network access, and raw socket access.

---

### 7. Debugging, Monitoring & Performance

#### 47. How do you troubleshoot a crashing or deadlocked container?
1. Inspect exit code: `docker ps -a` (e.g., Exit Code `137` = Out of Memory `OOMKilled`, `139` = Segmentation Fault).
2. Fetch logs with timestamps: `docker logs --tail 100 -f <container_id>`.
3. Inspect low-level state and exit reasons: `docker inspect <container_id> | grep -i oomkilled`.
4. Run an ephemeral debugging shell inside the container network namespace:
   ```bash
   docker exec -it <container_id> sh
   ```

---

#### 48. How do you monitor container CPU, Memory, and I/O utilization in real-time?
```bash
# Live streaming stats for all running containers
docker stats

# Output:
# CONTAINER ID   NAME     CPU %   MEM USAGE / LIMIT     MEM %    NET I/O
# 8a1b2c3d4e5f   api      0.45%   180.2MiB / 1.952GiB   9.02%    1.2MB / 4.5MB
```

---

#### 49. How do you limit memory and CPU resources on a Docker container?
Without resource limits, a memory leak in one container can crash the entire host machine (OOM kernel panic).
```bash
docker run -d \
  --name api-service \
  --cpus="1.5" \
  --memory="512m" \
  --memory-swap="1g" \
  my-app
```
- `--memory="512m"`: Hard memory limit.
- `--memory-reservation="256m"`: Soft limit (warning threshold).
- `--cpus="1.5"`: Container can use at most 1.5 CPU cores per second.

---

#### 50. How does Docker logging work, and how do you prevent container log files from filling up host disk space?
By default, Docker uses the `json-file` logging driver, storing all `stdout`/`stderr` logs indefinitely in `/var/lib/docker/containers/<id>/<id>-json.log`.
- **Mitigation**: Configure log rotation in `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```
*(In enterprise production, replace `json-file` with centralized log shipping drivers like `fluentd`, `awslogs` for CloudWatch, or `syslog`).*
