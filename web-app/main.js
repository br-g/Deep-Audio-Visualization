function Music (title, artist, FPS, features) {
    this.title = title;
    this.artist = artist;
    this.FPS = FPS;
    this.features = features;

    this.toLog = function () {
    	console.log(this.title);
    	console.log(this.artist);
    	console.log(this.FPS);
    	console.log(this.features);
    }

    // Get features at given time in the music.
    // Time in ms.
    this.getFeatures = function (elapsedTime) {
    	var frameIndex = Math.round(elapsedTime * this.FPS / 1000.0);
    	console.log(frameIndex);
    	return this.features[frameIndex];
    }
}

var currentMusic = null;

function loadMusic (filePath, callback) {
	var music = null
    $.getJSON(filePath)
		.done(function(data) {
		    console.log("Features successfully loaded");
		    currentMusic = new Music(data['Title'], data['Artist'], data['FPS'], data['Features']);
		    callback();
		})
		.fail(function() {
			console.log( "Ajax error" );
		});
}

function playMusic () {
	var audio = new Audio('audio/m0_mono.wav');
	audio.play();
}

$( document ).ready(function() {
	loadMusic("features/test1.json", playMusic);
});