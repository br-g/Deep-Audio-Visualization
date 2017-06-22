/***************************************************/
/* Original animation from Charlie Hoey
/* http://charliehoey.com
/***************************************************/

function Particles() {
	var options;
	var tick = 0;
	var particleSystem;

	this.getPath = function () {
		return 'animations/particles';
	}

	this.init = function (camera, scene, renderer) {
		camera.position.z = 34;
		particleSystem = new THREE.GPUParticleSystem({
			maxParticles: 250000
		});
		scene.add(particleSystem);

		options = {
			horizontalSpeed: 0.8,
			verticalSpeed: 0.4,
			color: 0xaa88ff
		};
	}

	this.updateDefault = function () {
		tick += 0.02; // in sec
		particleSystem.update(tick);
	}

	this.update = function (timeDelta, parameters) {
		tick += timeDelta; // in sec
		parameters.position = new THREE.Vector3();
		parameters.position.x = Math.sin(tick * options.horizontalSpeed) * 20;
		parameters.position.y = Math.sin(tick * options.verticalSpeed) * 10;
		parameters.position.z = Math.sin(tick * options.horizontalSpeed + options.verticalSpeed) * 5;

		var colorString = "hsl(" + parameters.hue + ", " + parameters.saturation + "%, " + parameters.lightness + "%)"
		parameters.color = colorString;

		parameters.sizeRandomness = 2.0;
		parameters.colorRandomness = 0.2;

		for (var x = 0; x < parameters.spawnRate * timeDelta; x++) {
			particleSystem.spawnParticle(parameters);
		}
		particleSystem.update(tick);
	}
}