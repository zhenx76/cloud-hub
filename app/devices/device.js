var util = require('util');
var events = require('events');
var when = require('when');
var logger = require('../../utility').logger;
var deviceManager = require('../../steward');
var deviceRegistry = require('./device_registry');

var rootDeviceModel = exports.rootDeviceModel = {};
var deviceInstances = {};

var Device = exports.Device = function(model, info) {
    this.deviceModel = model;
    this.deviceInfo = info;
    this.deviceType = info.deviceType;
    this.deviceID = info.deviceID;

    this.on('update', this.onUpdateDevice);
};
util.inherits(Device, events.EventEmitter);

Device.prototype.getProperties = function() {
    var result = {
        'id': this.deviceID,
        'type': this.deviceType,
        'name': this.deviceModel.deviceModelName
    };

    // Device instance specific properties
    result.info = {};
    var redundantProps = ['name', 'whatami', 'deviceID', 'deviceType'];
    for (var prop in this.deviceInfo) {
        if (this.deviceInfo.hasOwnProperty(prop) &&
            (redundantProps.indexOf(prop) == -1)) {
            result.info[prop] = this.deviceInfo[prop];
        }
    }

    return result;
};

Device.prototype.onUpdateDevice = function (info) {
    logger.info('update device ' + this.deviceID);
    this.deviceInfo = info;
};

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

function updateDevice(info) {
    if (!deviceInstances.hasOwnProperty(info.deviceID) || !deviceInstances[info.deviceID]) {
        logger.info('ignore unrecognized or un-enumerated device instance '
            + info.deviceID + ' of type ' + info.deviceType);
    } else {
        var device = deviceInstances[info.deviceID];
        device.emit('update', info);
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

            // Subscribe to device manager event
            deviceManager.addEventListener(updateDevice);
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

exports.getAllDevices = function() {
    var result = [];
    for (var deviceID in deviceInstances) {
        if (deviceInstances.hasOwnProperty(deviceID)) {
            var device = deviceInstances[deviceID];
            result.push(device.getProperties());
        }
    }
    return {'devices' : result};
};

exports.getDevice = function(id) {
    try {
        var device = deviceInstances['device/' + id];
        return device.getProperties();
    } catch(ex) {
        return {'error' : 'invalid device id: device/' + id};
    }
};