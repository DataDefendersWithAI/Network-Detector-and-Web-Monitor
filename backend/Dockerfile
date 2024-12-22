# Use an official CUDA image to build and run the Django app
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Python and other dependencies
RUN apt update && apt install -y python3 python3-pip python-is-python3 libpcap0.8-dev tcpdump iproute2 nmap

# Install Django
RUN pip3 install django

# Install additional Python dependencies (if you have a requirements.txt)
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt || true

# Copy the rest of the application code
COPY . .

# Expose the Django development server port
EXPOSE 3060

# Command to run the Django server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:3060"]
