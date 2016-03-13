var when = require('when');
var thermostat = require('./device_thermostat');
var nest = require('./thermostat_nest');

module.exports = {
    init: function() {
        return when.resolve(null)
            .then(function() { return thermostat.init(); })
            .then(function() { return nest.init() });
    }
};