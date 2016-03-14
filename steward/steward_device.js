var when = require('when');
var util = require('util');
var logger = require('../utility').logger;
var steward = require('./steward_api');
var steward_event = require('./steward_event');

var actors = {};
var devices = {};

var deviceTypeMappings = {};
var deviceTypeReverseMappings = {};

function clone(o) {
    var prop, result;

    if ((!o) || ((typeof o) !== 'object')) return o;

    result = util.isArray(o) ? [] : {};
    for (prop in o) if (o.hasOwnProperty(prop)) result[prop] = clone(o[prop]);
    return result;
}

function listAllActors() {
    return steward.listActors()
        .then(function(result) {
            for (var what in result.actors) {
                if (!result.actors.hasOwnProperty(what))
                    continue;

                // create a mapping table between device type and device model object
                actors[what] = clone(result.actors[what]);
            }
    });
}

function listAllDevices() {
    return steward.listAllDevices()
        .then(function(result) {
            for (var deviceID in result.devices) {
                if (!result.devices.hasOwnProperty(deviceID))
                    continue;

                var info = clone(result.devices[deviceID]);

                if (!info.hasOwnProperty('deviceID'))
                    info.deviceID = deviceID;

                if (deviceTypeMappings.hasOwnProperty(info.whatami))
                    info.deviceType = deviceTypeMappings[info.whatami];
                else
                    info.deviceType = info.whatami;

                devices[deviceID] = info;
            }
        });
}

function listDevice(id) {
    var deviceID = 'device/' + id;
    if (devices.hasOwnProperty(deviceID)) {
        // If device instance is already enumerated
        return when.resolve(devices[deviceID]);
    } else {
        // Enumerate this device instance
        return steward.listDevice(id)
            .then(function (result) {
                var device = result.devices[deviceID];
                devices[deviceID] = device;
                return device;
            });
    }
}

module.exports = {
    init: function() {
        return listAllActors();
    },
    installDeviceMapping: function(whatami, deviceType) {
        deviceTypeMappings[whatami] = deviceType;
        deviceTypeReverseMappings[deviceType] = whatami;
    },
    findDeviceModel: function(deviceType) {
        return actors[deviceTypeReverseMappings[deviceType]];
    },
    findAllDevices: listAllDevices,
    enumerateDevices: function(cb) {
        for (var deviceID in devices) {
            if (devices.hasOwnProperty(deviceID)) {
                var device = devices[deviceID];
                if (device) {
                    cb(device);
                }
            }
        }
    },
    findDevice: function (id) {
        return listDevice(id);
    },
    addEventListener: function(cb) {
        steward_event.addEventListener(function(update) {
            try {
                var info = clone(update);
                var deviceID = info.whoami;

                if (!info.hasOwnProperty('deviceID'))
                    info.deviceID = deviceID;

                if (deviceTypeMappings.hasOwnProperty(info.whatami))
                    info.deviceType = deviceTypeMappings[info.whatami];
                else
                    info.deviceType = info.whatami;

                cb(info);

            } catch (e) {
                logger.error(e);
            }
        });
    }
};
