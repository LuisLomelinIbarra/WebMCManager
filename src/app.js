const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const authentication = require('./authentication')

const app = express(feathers())

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    
    directives: {
      'default-src':  ["'self'", 'http://fonts.gstatic.com'],
      'font-src': ["'self'" , 'fonts.gstatic.com' , 'fonts.googleapis.com'],
      'connect-src': ["'self'", 'ws:'],
      'script-src' : ["'self'", 'cdnjs.cloudflare.com', 'unpkg.com', 'socket.io'],
      'img-src': ["'self'", 'fonts.googleapis.com'],
      'style-src': ["'self'", 'fonts.googleapis.com'],
      'form-action' : "'none'", 
      'frame-ancestors' : "'none'"
    },
  },
}))
/*
app.use((req, res, next) => {
  res.header('Content-Security-Policy', `default-src 'self' http://fonts.gstatic.com; font-src 'self' fonts.gstatic.com http://fonts.googleapis.com; connect-src 'self'; script-src 'self' cdnjs.cloudflare.com unpkg.com socket.io; img-src 'self' https://fonts.googleapis.com; style-src 'self' https://fonts.googleapis.com http://fonts.googleapis.com; form-action 'none'; frame-ancestors 'none';`);
  next();
});
*/
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
app.configure(authentication)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))




app.hooks(appHooks)

module.exports = app
