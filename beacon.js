var Bleacon = require('bleacon');

Bleacon.startScanning('b9407f30f5f8466eaff925556b57fe6d');


Bleacon.on('discover', function(bleacon) {
	//console.log("Major: %s Prox : %s",bleacon.major,bleacon.proximity);

	console.log(bleacon);
});



Bleacon.on('discover', function(bleacon) {

	if(bleacon.proximity === "immediate") {
		var id = bleacon.uuid+bleacon.major+bleacon.minor;
		console.log("FOund "+id);

		for(var i = 0 ; i < store.length ; i++) {
			
			if(store[i].triggerMechanism === "beacon" && !store[i].status && store[i].triggerId === id){
				console.log("FOund");
				for(index in store[i].message)
					rrp_audio_play(store[i].message[index]);
				store[i].status = true;
			}
		}
	}
	
});
