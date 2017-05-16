function Features () {
    this.title = null;
    this.artist = null;
    this.FPS = null;
    this.features = null;

    this.load = function (filePath) {
        var _title, _artist, _FPS, _features;
        $.ajax({
          url: filePath,
          dataType: 'json',
          async: false,
          success: function(data) {
            console.log("Features successfully loaded");
            _title = data['Title'];
            _artist = data['Artist'];
            _FPS = data['FPS'];
            _features = data['Features'];
          }
        });
        this.title = _title;
        this.artist = _artist;
        this.FPS = _FPS;
        this.features = _features;
    }

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