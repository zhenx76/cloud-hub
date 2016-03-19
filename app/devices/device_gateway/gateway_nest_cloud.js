var util = require('util');
var when = require('when');
var logger = require('../../../utility').logger;
var deviceRegistry = require('../device_registry');
var gateway = require ('./device_gateway');

var NestCloud = exports.NestCloud = function(model, info) {
    gateway.Gateway.call(this, model, info);
};
util.inherits(NestCloud, gateway.Gateway);

NestCloud.prototype.getProperties = function() {
    var result = NestCloud.super_.prototype.getProperties.call(this);
    result.gateway.type = 'cloud';

    // Don't send username and password
    if (result.info.hasOwnProperty('info')) {
        delete result.info.info;
    }

    return result;
};

var options = {
    name: 'Nest Cloud Service',
    type: '/device/gateway/nest-cloud',
    whatami: '/device/gateway/nest/cloud',
    factory: NestCloud
};

exports.init = function () {
    return when.resolve(null)
        .then(function() {
            // Register the nest cloud service with device registry
            logger.info('register Nest Cloud device model');
            deviceRegistry.registerDeviceModel(options);
        });
};