$( document ).ready(function() {

	audioManager = new AudioManager();
	audioManager.loadFeatures('features/test1.json', featuresLoaded);

});

function featuresLoaded(features) {

	audioManager.loadMusic('audio/m1_mono.wav');

	// Creates and launches animation
	animation = new Animation(features);
	animation.init();
	animation.setMode('cube');

	// Launches animation & music
	animation.launch();
	audioManager.playMusic();
}