var util = require('util');
var when = require('when');
var logger = require('winston');
var deviceRegistry = require('../device_registry');
var devices = require('../device');

var Thermostat = exports.Thermostat = function(model, info) {
    devices.Device.call(this, model, info);
};
util.inherits(Thermostat, devices.Device);

var options = {
    name: 'Thermostat',
    type: '/device/thermostat',
    whatami: '/device/climate',
    factory: Thermostat
};

exports.init = function () {
    return when.resolve(null)
        .then(function() {
            // Register the thermostat with device registry
            logger.info('register Thermostat device model');
            deviceRegistry.registerDeviceModel(options);
        });
};