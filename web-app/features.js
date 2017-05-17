function Features () {
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
            _FPS = data['FPS'];
            _features = data['Features'];
          }
        });
        this.FPS = _FPS;
        this.features = _features;
    }

    // Get features at given time in the music.
    // Time in ms.
    this.get = function (elapsedTime) {
    	var frameIndex = Math.round(elapsedTime * this.FPS / 1000.0);
    	return this.features[frameIndex];
    }
}