FROM ubuntu:22.04

# Set the working directory
WORKDIR /usr/src/app

# Install core dependencies
RUN apt update && apt install -y \
    python3 python3-pip python-is-python3 \
    libpcap0.8-dev tcpdump iproute2 nmap wget gnupg curl

# Optional: CUDA support block — skipped on non-NVIDIA systems
# Users with NVIDIA GPUs can uncomment and install CUDA locally, OR use `--gpus` flag with Docker runtime
# (Recommend NOT bundling it inside the Docker image if cross-platform is a concern)

# Install Python packages
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt || true

# Copy application code
COPY . .

# Expose Django dev port
EXPOSE 3060

# Run Django dev server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:3060"]
