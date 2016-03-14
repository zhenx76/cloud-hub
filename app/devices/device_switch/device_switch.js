var util = require('util');
var when = require('when');
var logger = require('../../../utility').logger;
var deviceRegistry = require('../device_registry');
var devices = require('../device');

var Switch = exports.Switch = function(model, info) {
    devices.Device.call(this, model, info);
};
util.inherits(Switch, devices.Device);

var options = {
    name: 'Smart Switch',
    type: '/device/switch',
    factory: Switch
};

exports.init = function () {
    return when.resolve(null)
        .then(function() {
            // Register the switch with device registry
            logger.info('register Switch device model');
            deviceRegistry.registerDeviceModel(options);
        });
};