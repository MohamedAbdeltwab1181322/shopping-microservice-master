'use strict';

const http = require('http');

const port = process.env.APP_PORT || '3001';

const app = require('./app');

app.set('port', port);

const server = http.createServer(app)

server.listen(port);

server.on('error', (error) => {
    console.error('error found', error)
});

server.on('listening', () => {
    console.log('Server running at ', port)
});