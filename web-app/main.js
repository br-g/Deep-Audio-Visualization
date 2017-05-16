function App () {
	this.animationManager = null;
	this.audioManager = null;

	this.loadAudio = function() {
		this.audioManager = new AudioManager();
		this.audioManager.loadAudio('audio/m1_mono.wav');
	}

	this.loadAnimation = function () {
		this.animationManager = new AnimationManager();
		this.animationManager.init();
		this.animationManager.setAnimation('particles');
		this.animationManager.loadFeatures('features/test1.json');
	}

	// Launches animation & music
	this.launch = function() {
		this.audioManager.playMusic();
		this.animationManager.launch();
	}
}

$(document).ready(function() {
	var app = new App();
	app.loadAudio();
	app.loadAnimation();
	app.launch();
});