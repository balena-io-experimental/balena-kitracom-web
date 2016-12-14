#!/bin/env node

{
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');
    const express = require('express');
    const serveStatic = require('serve-static');
    const compression = require('compression');
    const path = require('path');
    const mime = require('mime');
    const debug = require('debug')('server');
    const bodyParser = require("body-parser");
    const _ = require('lodash');
    const app = express();

    let errorHandler = function(err, req, res, next) {
        'use strict';
        res.status(500);
        res.render('error', {
            error: err
        });
    };
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(function(req, res, next) {
        'use strict';
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(errorHandler);

    // declaring server
    let server = function() {
        "use strict";
        if (!(this instanceof server)) return new server();
        this.port = (process.env.WEB_SERVER_PORT == null) ? 80 : process.env.WEB_SERVER_PORT;
    };
    util.inherits(server, EventEmitter);



    server.prototype.start = function(callback) {
        'use strict';
        let self = this;

        app.use(serveStatic('/usr/src/app/public', {
            'index': ['index.html']
        }));

        app.post('/v1/leds/:id/:hex/:brightness', (req, res) => {

            if (!req.params.id) {
                return res.status(400).send('Bad Request');
            }
            self.emit("setLed", {
                "id": req.params.id,
                "hex": req.params.hex,
                "brightness": req.params.brightness
            });
            res.status(200).send('OK');
        });

        app.get('/v1/leds/:id', (req, res) => {
            self.emit("getLed", {
              id: req.params.id,
              res: res
            });
        });

        app.get('/v1/accelerometer', (req, res) => {

            let accelerometer = {
                "x": 0,
                "y": 0,
                "z": 0
            };
            self.emit("accelerometer", accelerometer);
            res.status(200).send(accelerometer);
        });

        app.get('/v1/barometer', (req, res) => {

            let barometer = {
                "t": 0,
                "p": 0,
                "a": 0
            };
            self.emit("barometer", barometer);
            res.status(200).send(barometer);
        });

        app.get('/v1/gyroscope', (req, res) => {

            let gyroscope = {
                "x": 0,
                "y": 0,
                "z": 0
            };
            self.emit("gyroscope", gyroscope);
            res.status(200).send(gyroscope);
        });

        app.listen(self.port, (req, res) => {
            callback();
        });

    };

    module.exports = server();
}
