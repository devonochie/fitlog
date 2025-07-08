# Use the Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (assuming port 3000)
EXPOSE 5000

# Command to start the application
CMD ["npm", "start"]
