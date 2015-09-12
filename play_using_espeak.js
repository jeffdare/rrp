
var exec = require('child_process').exec;

function espeak_tts_conversion(text_to_play,file_name){
	exec_cmd_conv='espeak -v en-us+f4 -g 8ms -s 170 -k 5 -a 200 -w '+ file_name+'.wav' + ' \"'+ text_to_play + '\" > /dev/null 2>&1 &';

	var espeak_process = exec( exec_cmd_conv, function(err, stdout, stderr) {
    		if (err) throw err;
    		console.log(stdout);
	});
}
function mplayer_play_file(file_name){	
	//exec_mplayer='mplayer ' + file_name+'.wav' + ' >/dev/null 2>&1 &';
	exec_mplayer='mplayer ' + file_name+'.wav' + ' ';
        var mplayer_process = exec( exec_mplayer, function(err, stdout, stderr) {
                if (err) throw err;
                console.log(stdout);
        });

}


espeak_tts_conversion("I see you’ve reached the crime scene. Someone here met an unfortunate end. Your first step is to mark the area where the body lies by taping it on the ground. Be creative. This is your crime story. When your body is ready, dial me back with the button below.","test");

mplayer_play_file("test");
