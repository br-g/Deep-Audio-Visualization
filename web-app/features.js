function Features () {
    this.sampleRate = null;
    this.features = null;

    this.load = function (filePath) {
        var _this = this;

        return $.ajax({
          url: filePath,
          dataType: 'json',
          async: true,
          success: function(data) {
            console.log("Features successfully loaded");
            _this.sampleRate = data['sampleRate'];
            _this.features = data['featuresData'];
          }
        });
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