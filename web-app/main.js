function App () {
	this.animationManager = null;
	this.audioManager = null;
	this.playlistManager = null;

	this.init = function () {
		this.audioManager = new AudioManager();
		this.animationManager = new AnimationManager();
		this.animationManager.init();
		this.playlistManager = new PlaylistManager();
		return this.animationManager.nextAnimation();
	}

	this.loadPlaylist = function (filePath) {
		var _this = this;

		return this.playlistManager.load(filePath)
			.then(function() {
				_this.playlistManager.randomize();
			});
	}

    this.setAnimation = function(animName) {
    	this.animationManager.setAnimation(animName);
    }

    this.nextAnimation = function() {
    	return this.animationManager.nextAnimation();
    }

	this.playNextSong = function () {
		var nextSong = this.playlistManager.nextSong();
		this.updateSongInfo();
		this.audioManager.pauseMusic();
		this.audioManager.load(this.playlistManager.getAudioPath());
		this.animationManager.setAudioManager(this.audioManager);

		var _this = this;
		return this.animationManager.loadFeatures(this.playlistManager.getFeaturesPath()).then(function() {
			_this.audioManager.playMusic();
		});
	}

	this.updateSongInfo = function () {
		$("#controls > #songInfo > #title").html(this.playlistManager.getTitle());
		$("#controls > #songInfo > #artist").html(this.playlistManager.getArtist());
	}
}

var app = new App();

$(document).ready(function() {
	setTimeout(hideStartMessage, 5000);

	app.init().then(function() {
		app.loadPlaylist('playlist.json').then(function() {
			app.playNextSong().then(function() {
				app.animationManager.launch();

				$("#controls > #next").click(function() {
					app.playNextSong();
				});

				$("canvas").click(function() {
					hideStartMessage();
				  	app.nextAnimation();
				});
			});
		});
	});
});

function hideStartMessage() {
	$("#startMessage").animate({
	    opacity: 0.0
	  }, 1400);
}