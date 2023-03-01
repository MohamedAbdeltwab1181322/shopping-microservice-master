FROM node:16

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Installing dockerize which can test and wait on the availability of a TCP host and port.
ENV DOCKERIZE_VERSION v0.6.1

RUN apt-get update && apt-get install -y wget

# RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
#     && rm dockerize-linux-amd64-v0.6.1.tar.gz

# Copying all the files from your file system to container file system
COPY package.json /usr/src/app/
    
# Install all dependencies && Knex
RUN npm install

# Copy other files too
COPY . .

# Expose the port
EXPOSE 3001

# Command to run app when intantiate an image
CMD ["npm","start"]
