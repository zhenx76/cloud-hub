var when = require('when');
var switchControl = require('./device_switch');

module.exports = {
    init: function () {
        return when.resolve(null)
            .then(function() { switchControl.init(); });
    }
};