function App () {
	this.animationManager = null;
	this.audioManager = null;
	this.playlistManager = null;

	this.init = function () {
		this.audioManager = new AudioManager();
		this.animationManager = new AnimationManager();
		this.animationManager.init();
		this.animationManager.nextAnimation();
		this.playlistManager = new PlaylistManager();
	}

	this.loadPlaylist = function (filePath) {
		this.playlistManager.load(filePath);
		this.playlistManager.randomize();
	}

    this.setAnimation = function(animName) {
    	this.animationManager.setAnimation(animName);
    }

    this.nextAnimation = function() {
    	this.animationManager.nextAnimation();
    	this.randomizeAnimation();
    }

	this.playNextSong = function () {
		var nextSong = this.playlistManager.nextSong();
		this.audioManager.pauseMusic();
		this.audioManager.load(this.playlistManager.getAudioPath());
		this.animationManager.setAudioManager(this.audioManager);
		this.animationManager.loadFeatures(this.playlistManager.getFeaturesPath());
		this.animationManager.launch();
		this.audioManager.playMusic();
	}

	this.randomizeAnimation = function () {
		this.animationManager.randomize();
	}
}

$(document).ready(function() {
	var app = new App();
	app.init();
	app.loadPlaylist('playlist.json');
	app.playNextSong();

	function updateSongInfo() {
		$("#controls > #songInfo > #title").html(app.playlistManager.getTitle());
		$("#controls > #songInfo > #artist").html(app.playlistManager.getArtist());
	}

	updateSongInfo();
	$("#controls > #next").click(function() {
	  app.playNextSong();
	  updateSongInfo();
	});

	$("canvas").click(function() {
	  app.nextAnimation();
	});
});