function Particles() {
	var options;
	var tick = 0;
	var particleSystem;

	this.getPath = function (ctx) {
		return 'animations/particles';
	}

	this.init = function (ctx) {
		ctx['camera'].position.z = 100;
		particleSystem = new THREE.GPUParticleSystem({
			maxParticles: 250000
		});
		ctx['scene'].add(particleSystem);

		options = {
			spawnRate: 15000,
			horizontalSpeed: 1.5,
			verticalSpeed: 1.33
		};
	}

	this.update = function (timeDelta, parameters) {
		tick += timeDelta; // in sec

		parameters.position = new THREE.Vector3();
		parameters.position.x = Math.sin(tick * options.horizontalSpeed) * 20;
		parameters.position.y = Math.sin(tick * options.verticalSpeed) * 10;
		parameters.position.z = Math.sin(tick * options.horizontalSpeed + options.verticalSpeed) * 5;

		for (var x = 0; x < options.spawnRate * timeDelta; x++) {
			particleSystem.spawnParticle(parameters);
		}
		particleSystem.update(tick);
	}
}