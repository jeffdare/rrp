var gpio = require('rpi-gpio');

var read = false;
var count =0;
gpio.on('change', function(channel, value) {
//	console.log('Channel ' + channel + ' value is now ' + value);
	if(channel === 16) {
		if(value === true)
			read = true;
		else if(value === false) {
			read = false;
			console.log("The number is :"+count);
			count = 0;
			
		}
	}	   
	else if(channel === 12){
		if(read && value === false)
			count++;
	}
});
gpio.setup(12, gpio.DIR_IN, gpio.EDGE_BOTH); 
gpio.setup(16, gpio.DIR_IN, gpio.EDGE_BOTH);
