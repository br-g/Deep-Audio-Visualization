// Represents an animation parameter (position, color, speed, ...)
var Parameter = function (name, avg, minValue, maxValue, step, _default, blur, FPS) {
	this.name = name;
	this.avg = avg;
	this.minValue = minValue;
	this.maxValue = maxValue;
	this.step = step;
	this.default = _default;
	this.blur = blur;
	this.FPS = FPS;

	this.lastOutputValue = -1;
	this.lastChangeTime = 0;

	// Scales input value ([0;1]) into [minValue;maxValue].
	// Takes into account FPS limitation requirements.
	this.scale = function (input, timeElapsed) {

		var curTime = new Date().getTime();

		if (this.lastOutputValue != -1 && (curTime - this.lastChangeTime < 0.5 * 1.0/this.FPS * 1000 || (this.FPS != -1 && Math.random() * 60.0 / this.FPS * 0.5 > 1.0))) {
			return this.lastOutputValue;
		}
		else {
			lastChangeTime = curTime;

			// Computes mapped value
			var mappedValue = 0.0;

			if (input < 0.5) {
				mappedValue = input * 2.0 * (this.minValue - this.avg) + this.avg;
			} else {
				mappedValue = (input - 0.5) * 2.0 * (this.maxValue - this.avg) + this.avg;
			}
			//var res = this.getAveragedValue(mappedValue);
			if (step != -1) {
				mappedValue = Math.round(mappedValue / step) * step;
			}
			this.lastOutputValue = mappedValue
			return mappedValue;
		}
	}
}

// Represents a mapping from input features to animation parameters.
var ParamMapping = function(size, params, map) {
	this.size = 0;
	this.params = null;
	this.map = null;

	// Loads parameters from AJAX.
	this.load = function (filePath) {
		var size = 0;
		var params = null;
		var map = null;
	    $.ajax({
	      url: filePath,
	      dataType: 'json',
	      async: false,
	      success: function(data) {
	        console.log("Animation parameters successfully loaded");
		    size = data['parameters'].length;
		    params = [];
		    map = [];
		    for (i = 0; i < size; i++) {
		    	params.push(new Parameter(
		    		data['parameters'][i]['name'],
		    		data['parameters'][i]['avg'],
		    		data['parameters'][i]['min'],
		    		data['parameters'][i]['max'],
		    		data['parameters'][i]['step'],
		    		data['parameters'][i]['default'],
		    		data['parameters'][i]['blur'],
		    		data['parameters'][i]['FPS']
		    	));
		    	map.push(i);
		    }
	      }
	    });
	    this.size = size;
	    this.params = params;
	    this.map = map;
	}

	this.randomize = function () {
		// Uses Fisher–Yates shuffle
		var currentIndex = this.map.length;
		while (currentIndex > 0) {
			var randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			var tmp = this.map[currentIndex];
			this.map[currentIndex] = this.map[randomIndex];
			this.map[randomIndex] = tmp;
		}
	}

	// Given some input features, provides a suitable mapping for the animation parameters.
	this.doMap = function (features, timeElapsed) {
		if (features["blur1"].length !== this.size) {
			console.log("Warning: features vector size and number of animation parameters are different.");
		}
		var parameters = {};
		for (var i = 0; i < this.size; i++) {
			parameters[this.params[i].name] = this.params[i].scale(features["blur" + this.params[i].blur][this.map[i]], timeElapsed);
		}
		return parameters;
	}

	this.doMapDefault = function () {
		var parameters = {};
		for (var i = 0; i < this.size; i++) {
			parameters[this.params[i].name] = this.params[i].default;
		}
		return parameters;
	}
}