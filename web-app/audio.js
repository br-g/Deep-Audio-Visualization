function Features (title, artist, FPS, features) {
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
    this.get = function (elapsedTime) {
    	var frameIndex = Math.round(elapsedTime * this.FPS / 1000.0);
    	return this.features[frameIndex];
    }
}

function AudioManager () {
    var audio = null;

    this.loadFeatures = function (filePath, callback) {
        $.getJSON(filePath)
    		.done(function(data) {
    		    console.log("Features successfully loaded");
    		    callback(new Features(data['Title'], data['Artist'], data['FPS'], data['Features']));
    		})
    		.fail(function() {
    			console.log( "Ajax error" );
    		});
    }

    this.loadMusic = function (filePath) {
        audio = new Audio(filePath);
    }

    this.playMusic = function () {
    	audio.play();
    }
}