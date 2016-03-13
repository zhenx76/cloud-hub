var when = require('when');
var deviceManager = require('../../steward');
var deviceRegistry = require('./device_registry');
var devices = require('./device');
var gateway = require('./device_gateway');
var thermostat = require('./device_thermostat');
var switchControl = require('./device_switch');

module.exports = {
    init: function () {
        // DO NOT change the init sequence
        return when.resolve(null)
            .then(function() { return deviceManager.init(); })
            .then(function() { return deviceRegistry.init(); })
            .then(function() { return devices.init(); })
            .then(function() { return gateway.init(); })
            .then(function() { return thermostat.init(); })
            .then(function() { return switchControl.init(); });
    },
    start: function () {
        return when.resolve(null)
            .then(function() {
                devices.enumerate();
            });
    }
};