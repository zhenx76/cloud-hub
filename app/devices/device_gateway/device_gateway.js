var util = require('util');
var when = require('when');
var logger = require('winston');
var deviceRegistry = require('../device_registry');
var devices = require('../device');

var Gateway = exports.Gateway = function(model, info) {
    devices.Device.call(this, model, info);
};
util.inherits(Gateway, devices.Device);

var options = {
    name: 'Device Gateway',
    type: '/device/gateway',
    factory: Gateway
};

exports.init = function () {
    return when.resolve(null)
        .then(function() {
            // Register the gateway with device registry
            logger.info('register Gateway device model');
            deviceRegistry.registerDeviceModel(options);
        });
};