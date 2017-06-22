function AnimationManager() {
	var camera = null;
	var scene = null;
	var anim = null;
	var renderer = null;
	var features = null;
	var paramMapping = null;
	var lastRenderTime = 0;
	var curAnimName = null;
	var audioManager = null;

	var SYNC_CONSTANT = 260.0; // ms

	this.init = function() {
		this.createSceneAndCamera();
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
	}

	this.createSceneAndCamera = function () {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
	}

	this.setAnimation = function(animName) {
		switch (animName) {
			case 'kaleidoscope':
				anim = new Kaleidoscope();
				break;
			case 'particles':
				anim = new Particles();
				break;
			case 'lights':
				anim = new Lights();
				break;
			default:
				console.log('Error: Unknow animation name.');
		}
		if (anim) {
			this.createSceneAndCamera();
			anim.init(camera, scene, renderer);
		}

		var _this = this;
		return loadParamMapping().then(function () {
			_this.curAnimName = animName;
			_this.randomize();
		});
	}

	this.setAudioManager = function(_audioManager) {
		audioManager = _audioManager;
	}

	this.nextAnimation = function() {
		if (this.curAnimName == null) {
			this.curAnimName = 'particles';
		}
		switch (this.curAnimName) {
			case 'particles':
				return this.setAnimation('lights');
			case 'lights':
				return this.setAnimation('kaleidoscope');
			case 'kaleidoscope':
				return this.setAnimation('particles');
			default:
				console.log('Error: Unknow animation name.');
		}
	}

	this.loadFeatures = function(filePath) {
		features = new Features();
		return features.load(filePath);
	}

	this.onWindowResize = function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function loadParamMapping() {
		paramMapping = new ParamMapping();
		return paramMapping.load(anim.getPath() + '/parameters.json');
	}

	this.launch = function() {
		lastRenderTime = 0;
		renderAnimation();
	}

	this.randomize = function() {
		paramMapping.randomize();
	}

	window.addEventListener('resize', function () {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});

	function renderAnimation () {
		requestAnimationFrame(renderAnimation);
		renderer.render(scene, camera);
		var curTime = audioManager.getElapsedTime() * 1000.0;

		if (audioManager.ended()) {
			app.playNextSong();
		}
		if (curTime <= 0) {
			anim.updateDefault();
		} else {
			var curParameters = paramMapping.doMap(features.get(audioManager.getElapsedTime() * 1000.0 + SYNC_CONSTANT));
			if (curParameters == null || curParameters == undefined) {
				anim.updateDefault();
			} else {
				anim.update((curTime - lastRenderTime) / 1000.0, 
					curParameters, 
					curTime - lastRenderTime);
			}
		}
		lastRenderTime = curTime;
	}
};
