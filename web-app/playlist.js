function PlaylistManager () {
	this.list = null;
	this.pointer = -1;

    this.randomize = function () {
		// Uses Fisher–Yates shuffle
		var currentIndex = this.list.length;
		while (currentIndex > 0) {
			var randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			var tmp = this.list[currentIndex];
			this.list[currentIndex] = this.list[randomIndex];
			this.list[randomIndex] = tmp;
		}
	}

	this.load = function (filePath) {
		var _this = this;

    	return $.ajax({
	      url: filePath,
	      dataType: 'json',
	      async: true,
	      success: function(data) {
	        console.log("Sample songs successfully loaded");
		    _this.list = data['playlist'];
	      }
	    });
    }

	this.nextSong = function () {
		this.pointer = (this.pointer + 1) % this.list.length;
	}

	this.getFeaturesPath = function () {
		return this.list[this.pointer]['featuresFilePath'];
	}

	this.getAudioPath = function () {
		return this.list[this.pointer]['audioFilePath'];
	}

	this.getTitle = function () {
		return this.list[this.pointer]['title'];
	}

	this.getArtist = function () {
		return this.list[this.pointer]['artist'];
	}
}