var winston = require('winston');

exports.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ level : 'info' })
    ]
});
