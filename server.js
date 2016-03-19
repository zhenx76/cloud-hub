var when = require('when');
var express = require('express');
var api = require('./app/api');

var app = express();

module.exports = {
    init: function() {
        return when.resolve(null)
            .then(function() {
                api.init(app);

                return null;
            });
    },
    getServer: function() {
        return app;
    },
    start: function() {
        app.listen(3000);
    }
};