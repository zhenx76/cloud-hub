var util = require('util');
var logger = require('../utility').logger;

var listeners = [];

exports.processConsoleEvents = function (message) {
    for (var event in message) {
        if (!message.hasOwnProperty(event) || !message[event]) continue;

        switch (event) {
            case '.updates':
                var data = message[event];
                if (!util.isArray(data)) {
                    data = [data];
                }

                for (var i = 0; i < data.length; i++) {
                    var info = data[i];
                    if (!info) continue;

                    for (var j = 0; j < listeners.length; j++) {
                        if (listeners[j]) {
                            // Notify the event listener
                            listeners[j](info);
                        }
                    }
                }
                break;

            case 'steward':
            case 'manage':
            case 'notice':
            case 'server':
            case 'discovery':
            case 'gateway':
            default:
                // Ignore all other messages
                logger.debug('ignore ' + event + ' messages from steward');
        }
    }
};

exports.addEventListener = function(cb) {
    listeners.push(cb);
};