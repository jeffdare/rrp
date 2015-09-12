var gpio = require('rpi-gpio');

var read = false;
var count =0;
gpio.on('change', function(channel, value) {
	console.log('Channel ' + channel + ' value is now ' + value);
});
gpio.setup(18, gpio.DIR_IN, gpio.EDGE_BOTH);
