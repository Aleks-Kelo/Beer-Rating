# Use an official MongoDB image as a parent image
FROM mongo:latest

# Copy the MongoDB initialization script to the container
COPY init-mongo.js /docker-entrypoint-initdb.d/

# Expose the MongoDB port
EXPOSE 27017