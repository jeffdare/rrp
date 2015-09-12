/*
 * mqtt client
 * sheduler
 * json file
 * audio play api
 * shell script
 * 
 * */

require ('shelljs/global');
var Bleacon = require('bleacon');
var Cloudant = require('cloudant');
var config = require('./game.json');
var omx = require('omxdirector');
var gpio = require('rpi-gpio');

gpio.setup(18, gpio.DIR_IN, gpio.EDGE_BOTH);

var rrpCloudantDB;

var store = [];

var numOfSteps = 0;
var step = 0;

var ringing = false;

function initialize (cb) {

	console.log("initialize called");

	var cloudantConfig = config.cloudantConfig;
	
	var cloudant = Cloudant({account:cloudantConfig.user, password:cloudantConfig.password});

	rrpCloudantDB = cloudant.db.use(cloudantConfig.dbName);

	rrpCloudantDB.find({selector:{gameId:'1'}}, function(er, result) {
		  if (er) {
		    throw er;
		  }

		  console.log('Found %d documents with gameId 1', result.docs.length);  

		  store = result.docs;
		  numOfSteps = result.docs.length;

		  for( var i =0 ; i<numOfSteps ; i++) {
		  	var clue = store[i];
		  	espeak_tts_conversion(clue.message, "./audio_files/"+i+".wav");
		  }
		  cb();
	});
}

var gameplay = function () {
	

	if(step < numOfSteps) {

		console.log("Clue number : "+step +" / "+numOfSteps);

		/*
		Clue contains : 
		stepId, triggerMechanism, triggerId, status, and message
		*/
		var clue = store[step];

		console.log(clue);

		switch (clue.triggerMechanism) {
			case 'beacon' : 
						console.log("Came in Beacon");
						Bleacon.startScanning(clue.triggerId[0], clue.triggerId[1] , clue.triggerId[2]);
						Bleacon.on('discover', function(bleacon) {
							console.log(bleacon.proximity)

							if(bleacon.proximity === "immediate") {

								console.log("Beacon Play file");
								
								if(omx.isPlaying())
									omx.stop();

								omx.play('./audio_files/ring.mp3', {audioOutput: 'local'});
								ringing = true;
								/*console.log('./audio_files/'+step+'.wav');
								omx.play('./audio_files/'+step+'.wav', {audioOutput: 'local'});
								Bleacon.stopScanning();
								step ++;
								gameplay();*/
							}
							
						});
						break;

			case 'time'  :
						console.log('time : '+clue.triggerId);
						setTimeout(function(stepNum) {
							console.log("Time Play file");
							/*omx.play('./audio_files/'+stepNum+'.wav', {audioOutput: 'local'});
							step ++;
							gameplay();*/


							omx.play('./audio_files/ring.mp3', {audioOutput: 'local'});
							ringing = true;

						},clue.triggerId*1000*60, step);

						break;

			case 'userDial' :
						console.log("USerdialled");
						step ++;
						gameplay();
						break;


			default : 
						console.log("Should not come here");
						break;

		}
	}

}

gpio.on('change', function(channel, value) {

	//18 is the listen off the hook
	if(channel === 18) {

		if(value === false && ringing) {

			if(omx.isPlaying())
				omx.stop();

			console.log('./audio_files/'+step+'.wav');
			omx.play('./audio_files/'+step+'.wav', {audioOutput: 'local'});
			Bleacon.stopScanning();
			step ++;
			ringing = false;
			gameplay();
		}
	}
	console.log('Channel ' + channel + ' value is now ' + value);
});


function espeak_tts_conversion(text_to_play,file_name){
	exec_cmd_conv='espeak -v en-us+f4 -g 8ms -s 170 -k 5 -a 200 -w '+ file_name + ' \"'+ text_to_play + '\" > /dev/null 2>&1 &';

	var espeak_process = exec( exec_cmd_conv, function(err, stdout, stderr) {
    		if (err) 
    			throw err;

    		console.log("Completed for "+file_name);
	});
}

initialize(gameplay);