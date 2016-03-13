var when = require('when');
var gateway = require('./device_gateway');
var nestCloud = require('./gateway_nest_cloud');

module.exports = {
    init: function() {
        return when.resolve(null)
            .then(function() { return gateway.init(); })
            .then(function() { return nestCloud.init()});
    }
};