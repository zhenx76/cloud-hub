var when = require('when');
var logger = require('./utility').logger;
var devices = require('./app/devices');

devices.init()
    .then(function() { devices.start(); });

process.stdin.resume();
process.on('SIGINT', function() {
    logger.error("Caught interrupt signal");
    process.exit();
});