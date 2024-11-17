# Use an official Python image to build and run the Django app
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Django
RUN pip install django
RUN apt update && apt install libpcap0.8-dev -y && apt install tcpdump -y && apt install iproute2 -y

# Install additional Python dependencies (if you have a requirements.txt)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || true

# Copy the rest of the application code
COPY . .

# Expose the Django development server port
EXPOSE 3060

# Command to run the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:3060"]
