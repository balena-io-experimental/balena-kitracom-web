{
    const fs = require('fs');
    const chalk = require('chalk');
    const kitracom = require(__dirname + '/libs/kitracom.js');
    const supervisor = require(__dirname + '/libs/supervisor.js');
    const server = require(__dirname + '/libs/server.js');
    let LEDtoggle = 0;


    kitracom.start(() => {
        "use strict";
        kitracom.enableLed(0, () => {
            kitracom.setLed(0, "000000", 0, () => {
                console.log('LEDS enabled');
                // Pressure
                kitracom.enableEnvironmental(1,()=>{
                  console.log('Environmental sensor enabled: pressure');
                  kitracom.readEnvironmental(1,()=>{
                    console.log('Subscribed to pressure');
                  });
                });

                // Temperature
                kitracom.enableEnvironmental(2,()=>{
                  console.log('Environmental sensor enabled: temperature');
                  kitracom.readEnvironmental(2,()=>{
                    console.log('Subscribed to temperature');
                  });
                });

                // Humidity
                kitracom.enableEnvironmental(3,()=>{
                  console.log('Environmental sensor enabled: humidity');
                  kitracom.readEnvironmental(3,()=>{
                    console.log('Subscribed to humidity');
                  });
                });
            });
        });
    });

    supervisor.start(500, () => {
        "use strict";
        supervisor.on('status', (status) => {
            console.log(chalk.white('Supervisor status update: ' + status));
            switch (status) {
                case "Idle":
                    // #1b5e20
                    kitracom.setLed(2, "1b5e20", 10, () => {
                        console.log('LED 2 (status) set to #1b5e20 (Idle)');
                    });
                    break;
                case "Installing":
                    // #ff8f00
                    kitracom.setLed(2, "ff8f00", 10, () => {
                        console.log('LED 2 (status) set to #ff8f00 (Installing)');
                    });
                    break;
                case "Downloading":
                    // #1a237e
                    kitracom.setLed(2, "1a237e", 10, () => {
                        console.log('LED 2 (status) set to #1a237e (Downloading)');
                    });
                    break;
                case "Starting":
                    // #ff8f00
                    kitracom.setLed(2, "ff8f00", 10, () => {
                        console.log('LED 2 (status) set to #ff8f00 (Starting)');
                    });
                    break;
                case "Stopping":
                    // #ff8f00
                    kitracom.setLed(2, "ff8f00", 10, () => {
                        console.log('LED 2 (status) set to #ff8f00 (Stopping)');
                    });
                    break;
            }
        });
    });

    server.start(() => {
        "use strict";
        server.on('setLed', (data) => {
            console.log(chalk.magenta('new LED request received! applying...'));
            kitracom.setLed(data.id, data.hex, data.brightness, () => {
                console.log('LED ' + data.id + ' set to ' + data.hex + ' color with ' + data.brightness + '% brightness');
            });
        });
        server.on('getLed', (obj) => {
          if (parseInt(obj.id) === 0) {
            let ledsobj = [];
            for (var i = 1; i < 5; i++) {
              ledsobj.push(kitracom.getLed(i));
            }
            obj.res.status(200).send(ledsobj);
          } else {
            obj.res.status(200).send(kitracom.getLed(obj.id));
          }
        });
    });

    kitracom.on('error', (err) => {
        "use strict";
        console.log(err);
    });
}
