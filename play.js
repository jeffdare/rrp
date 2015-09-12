var omx = require('omxdirector');
omx.on('play', function(){
	console.log("playing");
	var play = omx.getStatus();
	omx.volup();
	omx.volup();
	console.log(play);
});
omx.play('test.mp3', {audioOutput: 'local'});
