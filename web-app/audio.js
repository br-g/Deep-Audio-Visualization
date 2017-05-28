function AudioManager () {
    this.audio = null;

    this.load = function (filePath) {
        this.audio = new Audio(filePath);
    }
    this.playMusic = function () {
    	this.audio.play();
    }
    this.pauseMusic = function () {
    	if (this.audio != null)
    		this.audio.pause();
    }
}