// Represents an animation parameter (position, color, speed, ...)
var Parameter = function (name, avg, minValue, maxValue, step, _default, FPS) {
	this.name = name;
	this.avg = avg;
	this.minValue = minValue;
	this.maxValue = maxValue;
	this.step = step;
	this.default = _default;
	this.FPS = FPS;

	this.timeAcc = 0;
	this.curOutput = null;

	this.nbAccumulatedValues = 0;
	this.accumulatedValues = [];

	// Stores current frame value and returns value averaged over time.
	this.getAveragedValue = function (curVal) {
		var curDate = new Date().getTime();
		var minDate = curDate - (1.0 / this.FPS * 1000); 
		var sum = 0.0;
		var nbToRemove = 0;

		this.accumulatedValues.forEach (function (v) {
			if (v.date >= minDate) {
				sum += v.value;
			} else {
				nbToRemove ++;
			}
		});
		this.accumulatedValues.splice(0, nbToRemove);
		this.accumulatedValues.push({'date': curDate, 'value': curVal});
		this.nbAccumulatedValues -= (nbToRemove - 1);

		return (sum + curVal) / this.nbAccumulatedValues;
	}

	// Scales input value ([0;1]) into [minValue;maxValue].
	// Takes into account FPS limitation requirements.
	this.scale = function (input, timeElapsed) {

		// Computes mapped value
		var mappedValue = 0.0;
		input = Math.pow(input+0.5, 2) / 2.25; // quadratic mapping
		if (input < 0.5) {
			mappedValue = input * 2.0 * (this.minValue - this.avg) + this.avg;
		} else {
			mappedValue = (input - 0.5) * 2.0 * (this.maxValue - this.avg) + this.avg;
		}
		return Math.round(this.getAveragedValue(mappedValue) / step) * step;
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
		    		data['parameters'][i]['FPS'])
		    	);
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
		var parameters = [];
		if (features.length !== this.size) {
			console.log("Warning: features vector size and number of animation parameters are different.");
		}
		var parameters = {};
		for (var i = 0; i < this.size; i++) {
			parameters[this.params[i].name] = this.params[i].scale(features[this.map[i]], timeElapsed);
		}
		return parameters;
	}

	this.doMapDefault = function () {
		return this._default;
	}
}