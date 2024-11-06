# Use an official Python image to build and run the Django app
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Django
RUN pip install django

# Install additional Python dependencies (if you have a requirements.txt)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || true

# Copy the rest of the application code
COPY . .

# Expose the Django development server port
EXPOSE 8000

# Command to run the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
