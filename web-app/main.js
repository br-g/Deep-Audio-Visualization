function App () {
	this.animationManager = null;
	this.audioManager = null;
	this.playlistManager = null;

	this.init = function () {
		this.audioManager = new AudioManager();
		this.animationManager = new AnimationManager();
		this.animationManager.init();
		this.setAnimation('particles');
		this.playlistManager = new PlaylistManager();
	}

	this.loadPlaylist = function (filePath) {
		this.playlistManager.load(filePath);
		this.playlistManager.randomize();
	}

    this.setAnimation = function(animName) {
    	this.animationManager.setAnimation(animName);
    }

	this.playNextSong = function () {
		var nextSong = this.playlistManager.nextSong();
		this.audioManager.load(this.playlistManager.getAudioPath());
		this.animationManager.loadFeatures(this.playlistManager.getFeaturesPath());
		this.audioManager.playMusic();
		this.animationManager.launch();
	}
}

$(document).ready(function() {
	var app = new App();
	app.init();
	app.loadPlaylist('playlist.json');
	app.playNextSong();
});