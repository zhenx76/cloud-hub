var express = require('express');
var logger = require('../../utility').logger;
var devices = require('../devices');

exports.getAllDeviceModels = function(req, res) {
    res.json(devices.getAllDeviceModels());
};

exports.getDeviceModel = function(req, res) {
    try {
        var urlParts = req.url.split('/');
        var parsedParts = [];
        for (var i = 0; i < urlParts.length; i++) {
            if (urlParts[i]) {
                parsedParts.push(urlParts[i]);
            }
        }
        var path = parsedParts.join('/');
        res.json(devices.getDeviceModel(path));
    } catch (ex) {
        logger.warn('invalid request' + req.toString());
        res.status(404)
            .send('Device model not found');
    }
};

exports.getAllDevices = function(req, res) {
    res.json(devices.getAllDevices());
};

exports.getDevice = function(req, res) {
    try {
        var id = req.params.id;
        res.json(devices.getDevice(id));
    } catch (ex) {
        logger.warn('invalid request' + req.toString());
        res.status(404)
            .send('Device not found');
    }
};
