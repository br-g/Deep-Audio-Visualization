function Features () {
    this.sampleRate = null;
    this.features = null;

    this.load = function (filePath) {
        var _title, _artist, _sampleRate, _features;
        $.ajax({
          url: filePath,
          dataType: 'json',
          async: false,
          success: function(data) {
            console.log("Features successfully loaded");
            _sampleRate = data['sampleRate'];
            _features = data['featuresData'];
          }
        });
        this.sampleRate = _sampleRate;
        this.features = _features;
    }

    // Get features at given time in the music.
    // Time in ms.
    this.get = function (elapsedTime) {
    	var frameIndex = Math.round(elapsedTime * this.sampleRate / 1000.0);
      var frame = {}
      for (var b in this.features) {
        frame[b] = this.features[b][frameIndex];
      }
    	return /*this.features["blur" + blur][frameIndex]*/ frame;
    }
}