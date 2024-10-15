# Use an official Node.js image to build and run the React app
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first (optional)
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code (in case you modify after creation)
COPY . .

# Expose the development port for React
EXPOSE 3000

# Command to start the React app
CMD ["npm", "start"]
