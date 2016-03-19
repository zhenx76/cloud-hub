var express = require('express');
var bodyParser = require('body-parser');
var devicesAPI = require('./devices');

var router = express.Router();
router.use(bodyParser());

module.exports = {
    init: function(app) {
        router.route('/registry/devices')
            .get(function(req, res) {
                devicesAPI.getAllDeviceModels(req, res);
            });

        router.route(/^\/(registry\/device(\/|$)).*$/)
            .get(function(req, res) {
                devicesAPI.getDeviceModel(req, res);
            });

        router.route('/devices')
            .get(function(req, res) {
                devicesAPI.getAllDevices(req, res);
            });

        router.route('/device/:id')
            .get(function(req, res) {
                devicesAPI.getDevice(req, res);
            });

        app.use('/api/v1', router);
    }
};
