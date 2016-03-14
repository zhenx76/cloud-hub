var when = require('when');
var stewardAPI = require('./steward_api');
var stewardDevice = require('./steward_device');

module.exports = {
    init: function() {
        return when.resolve(null)
            .then(function() { return stewardAPI.init(); })
            .then(function() { return stewardDevice.init(); });
    },
    installDeviceMapping: stewardDevice.installDeviceMapping,
    findDeviceModel: stewardDevice.findDeviceModel,
    findAllDevices: stewardDevice.findAllDevices,
    enumerateDevices: stewardDevice.enumerateDevices,
    addEventListener: stewardDevice.addEventListener
};