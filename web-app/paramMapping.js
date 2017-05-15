// Represents an animation parameter (position, color, speed, ...)
var Parameter = function (name, minValue, maxValue) {
	this.name = name;
	this.minValue = minValue;
	this.maxValue = maxValue;
	
	// Scales input value ([0;1]) into [minValue;maxValue].
	this.scale = function (input) {
		return input * (this.maxValue - this.minValue) + this.minValue;
	}
}

// Represents a mapping from input features to animation parameters.
var ParamMapping = function(size, params, map) {
	this.size = size;
	this.params = params;
	this.map = map;

	this.randomize = function () {
		// Uses Fisher–Yates Shuffle
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
	this.doMap = function (features) {
		var parameters = [];
		if (features.length !== this.size) {
			console.log("Warning: features vector size and number of animation parameters are different.");
		}
		for (var i = 0; i < this.size; i++) {
			var m = {};
			m[this.params[i].name] = this.params[i].scale(features[map[i]]);
			parameters.push(m);
		}
		return parameters;
	}
}

// Loads parameters from AJAX and returns a mapping object.
function getParamMapping(paramFilePath, callback) {
	$.getJSON(paramFilePath)
		.done(function(data) {
		    console.log("Animation parameters successfully loaded");
		    var size = data['parameters'].length;
		    var params = [];
		    var map = [];
		    for (i = 0; i < size; i++) {
		    	params.push(new Parameter(
		    		data['parameters'][i]['name'],
		    		data['parameters'][i]['min'],
		    		data['parameters'][i]['max']));
		    	map.push(i);
		    }
		    callback(new ParamMapping(size, params, map))
		})
		.fail(function() {
			console.log("Ajax error while loading animation parameters.");
		});
}

/*getParamMapping('animations/particles/parameters.json', mappingLoaded);
function mappingLoaded(paramMapping) {
	for (var i = 0; i < 10; i++) {
		paramMapping.randomize();
		var m = paramMapping.doMap([0.2, 0.45, 0.99]);
		console.log(m);
	}
}*/

