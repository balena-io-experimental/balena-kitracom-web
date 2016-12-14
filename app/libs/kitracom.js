#!/bin/env node

{
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');
    const SerialPort = require('serialport');

    const debug = require('debug')('kitracom');
    let kitracom = function() {
        'use strict';
        if (!(this instanceof kitracom)) return new kitracom();

        this.leds = {
          1: {
            color: "000000",
            brightness: 0,
            enabled: 0
          },
          2: {
            color: "000000",
            brightness: 0,
            enabled: 0
          },
          3: {
            color: "000000",
            brightness: 0,
            enabled: 0
          },
          4: {
            color: "000000",
            brightness: 0,
            enabled: 0
          }
        };


        this.cmdPrefix = "$KITRA,";
        this.cmdEol = "\r\n";
        this.port = new SerialPort('/dev/ttySAC3', {
            autoOpen: false,
            baudRate: 115200,
            dataBits: 8,
            parity: "none",
            stopBits: 1,
            parser: SerialPort.parsers.readline('\n')
        });

        this.port.on('data', (data) => {
            debug("READ: ",data);
        });

        this.port.on('error', (err) => {
          this.emit(err);
        });
    };
    util.inherits(kitracom, EventEmitter);

    kitracom.prototype.start = function(cb) {
        "use strict";
        let self = this;
        self.port.open(function(err) {
            if (err) {
                return cb(err.message);
            }
            cb(null);
        });
    };

    kitracom.prototype.checksum = function(packet) {
        "use strict";
        let self = this;
        let checksum = 0;
        for (var i = 1; i < packet.length; i++) {
            checksum = checksum ^ packet.charCodeAt(i);
        }
        let hexsum = Number(checksum).toString(16).toUpperCase();
        if (hexsum.length < 2) {
            hexsum = ("00" + hexsum).slice(-2);
        }
        return hexsum;
    };

    kitracom.prototype.enableLed = function(id,cb) {
        "use strict";
        let self = this;
        let cmd = "581," + id + ",1";
        self.write(cmd, () => {
            if (parseInt(id) === 0) {
              for (var i = 1; i < 5; i++) {
                self.leds[i].enabled = 1;
              }
            } else {
              self.leds[id].enabled = 1;
            }
            cb();
        });
    };

    kitracom.prototype.setLed = function(id,hex,brightness,cb) {
        "use strict";
        let self = this;
        let cmd = "582," + id + ',' + hex + ',' + brightness + ',1';
        self.write(cmd, () => {
            if (parseInt(id) === 0) {
              for (var i = 1; i < 5; i++) {
                self.leds[i].color = hex;
                self.leds[i].brightness = brightness;
              }
            } else {
              self.leds[id].color = hex;
              self.leds[id].brightness = brightness;
            }
            cb();
        });
    };

    kitracom.prototype.getLed = function(id) {
        "use strict";
        let self = this;
        return self.leds[id];
    };

    kitracom.prototype.enableEnvironmental = function(sensor,cb) {
        "use strict";
        let self = this;
        let cmd = "5101,1,"+sensor;
        self.write(cmd, () => {
            cb();
        });
    };

    kitracom.prototype.readEnvironmental = function(sensor,cb) {
        "use strict";
        let self = this;
        let cmd = "5102,"+sensor;
        self.write(cmd, () => {
            cb();
        });
    };

    kitracom.prototype.startPollEnvironmental = function(sensor,cb) {
        "use strict";
        let self = this;
        let cmd = "5103,1,"+sensor;
        self.write(cmd, () => {
            cb();
        });
    };

    kitracom.prototype.stopPollEnvironmental = function(sensor,cb) {
        "use strict";
        let self = this;
        let cmd = "5103,0,"+sensor;
        self.write(cmd, () => {
            cb();
        });
    };

    kitracom.prototype.write = function(cmdRaw,cb) {
        "use strict";
        let self = this;
        let cmd = self.cmdPrefix + cmdRaw + "*" + self.checksum(self.cmdPrefix + cmdRaw) + self.cmdEol;
        debug("WRITE: ",cmd);
        self.port.write(new Buffer(cmd), () => {
            self.port.drain(cb);
        });
    };

    module.exports = kitracom();

}
