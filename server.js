const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000
const server = http.createServer(app)
require('events').EventEmitter.prototype._maxListeners = 100;

server.listen(port)
