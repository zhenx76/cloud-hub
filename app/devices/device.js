var util = require('util');
var events = require('events');
var when = require('when');
var logger = require('winston');
var deviceManager = require('../../steward');
var deviceRegistry = require('./device_registry');

var rootDeviceModel = exports.rootDeviceModel = {};
var deviceInstances = {};

var Device = exports.Device = function(model, info) {
    this.deviceModel = model;
    this.deviceInfo = info;
    this.deviceType = info.deviceType;
    this.deviceID = info.deviceID;
};
util.inherits(Device, events.EventEmitter);

function addDevice(info) {
    if (!deviceInstances.hasOwnProperty(info.deviceID) || !deviceInstances[info.deviceID]) {
        var deviceModel = deviceRegistry.findDeviceModelByType(info.deviceType);
        if (deviceModel) {
            // Index device instance by ID
            deviceInstances[info.deviceID] = new (deviceModel.factory)(deviceModel, info);
            logger.info('added device instance ' + info.deviceType + ' at ' + info.deviceID);
        }
    }
}

var options = {
    name: 'Smart Thing',
    type: '/device',
    factory: Device
};

exports.init = function () {
    return when.resolve(null)
        .then(function() {
            // Register the root device model with device registry
            logger.info("register root device model");
            rootDeviceModel = deviceRegistry.registerDeviceModel(options);
        });
};

exports.enumerate = function() {
    deviceManager.findAllDevices()
        .then(function() {
            deviceManager.enumerateDevices(function (info) {
                addDevice(info);
            });
        });
};
