function AudioManager () {
    this.audio = null;

    this.load = function (filePath) {
        this.audio = new Audio(filePath);
    }

    this.playMusic = function () {
    	this.audio.play();
    }
}