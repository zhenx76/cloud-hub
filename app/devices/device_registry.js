var when = require('when');
var logger = require('../../utility').logger;
var deviceManager = require('../../steward');

var deviceModels = {};

var DeviceModel = function(options) {
    this.deviceModelType = options.type;
    this.deviceModelName = options.name;
    this.factory = options.factory;

    // The following would be generated as part of the registration process
    this.children = [];
    this.deviceModelInfo = {};
    this.gatewayDeviceModel = {};
};

DeviceModel.prototype.getProperties = function() {
    var result = {};
    result.name = this.deviceModelName;
    result.type = this.deviceModelType;

    if (this.children.length) {
        result.children = [];
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (typeof child.getProperties !== 'undefined') {
                result.children.push(child.getProperties());
            }
        }
    }

    return result;
};

function findDeviceModelByType(type) {
    var path = type.split('/');
    var deviceModel = deviceModels;

    for (var i = 1; i < path.length; i++) {
        if (!deviceModel.hasOwnProperty(path[i]) || !deviceModel[path[i]]) {
            return null;
        }
        deviceModel = deviceModel[path[i]];
    }
    return deviceModel;
}

function registerDeviceModel(options) {
    // The device type string used here could be different than the underlying device manager.
    // Install the mapping tables to device manager
    var whatami = (options.hasOwnProperty('whatami') && options.whatami) ? options.whatami : options.type;
    deviceManager.installDeviceMapping(whatami, options.type);

    var deviceModel = new DeviceModel(options);

    // locate parent device model
    var path = deviceModel.deviceModelType.split('/');
    var suffix = path[path.length - 1];
    if (suffix == 'device') {
        // It's the root device
        deviceModels = deviceModel;
        deviceModels[suffix] = deviceModel;
    } else {
        var parentType = deviceModel.deviceModelType.slice(0, -(suffix.length + 1));
        var parentDeviceModel = findDeviceModelByType(parentType);
        if (typeof parentDeviceModel === 'undefined' || !parentDeviceModel) {
            // parent device doesn't exist
            return null;
        }

        // build tree structure
        parentDeviceModel[suffix] = deviceModel;
        parentDeviceModel.children.push(deviceModel);
    }

    var info = deviceManager.findDeviceModel(deviceModel.deviceModelType);
    if (typeof info !== 'undefined' && info) {
        // link device model with device info from steward
        deviceModel.deviceModelInfo = info;

        // link gateway device mode if any
        if (typeof options.gateway !== 'undefined' && options.gateway) {
            var gatewayDeviceModel = findDeviceModelByType(options.gateway);
            if (typeof gatewayDeviceModel !== 'undefined' && gatewayDeviceModel) {
                deviceModel.gatewayDeviceModel = gatewayDeviceModel;
            }
        }
    }

    return deviceModel;
}

module.exports = {
    init: function () {
        logger.info('device registry initialized');
        return when.resolve(null);
    },
    registerDeviceModel: registerDeviceModel,
    findDeviceModelByType: findDeviceModelByType,
    getAllDeviceModels: function() {
        return deviceModels.getProperties();
    },
    getDeviceModel: function(path) {
        var deviceModel = findDeviceModelByType(path);
        if (typeof deviceModel === 'undefined' || !deviceModel) {
            return {'error' : 'invalid device model path name: ' + path};
        } else {
            return deviceModel.getProperties();
        }
    }
};