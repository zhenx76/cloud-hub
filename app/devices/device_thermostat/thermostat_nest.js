var util = require('util');
var when = require('when');
var logger = require('../../../utility').logger;
var deviceRegistry = require('../device_registry');
var thermostat = require ('./device_thermostat');

var NestControl = exports.NestControl = function(model, info) {
    thermostat.Thermostat.call(this, model, info);
};
util.inherits(NestControl, thermostat.Thermostat);

var options = {
    name: 'Nest',
    type: '/device/thermostat/nest',
    whatami: '/device/climate/nest/control',
    gateway: '/device/gateway/nest-cloud',
    factory: NestControl
};

exports.init = function () {
    return when.resolve(null)
        .then(function() {
            // Register the nest cloud service with device registry
            logger.info('register Nest Control device model');
            deviceRegistry.registerDeviceModel(options);
        });
};