function AnimationManager() {
	var ctx = null; // camera + scene
	var anim = null;
	var renderer = null;
	var features = null;
	var paramMapping = null;
	var lastRenderTime = 0;
	var curAnimName = null;
	var audioManager = null;

	var SYNC_CONSTANT = 200.0; // ms

	this.init = function() {
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
		ctx = {'scene': scene, 'camera': camera}
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
	}

	this.setAnimation = function(animName) {
		switch (animName) {
			case 'kaleidoscope':
				anim = new Kaleidoscope();
				break;
			case 'particles':
				anim = new Particles();
				break;
			case 'sphere':
				anim = new Sphere();
				break;
			default:
				console.log('Error: Unknow animation name.');
		}
		if (anim) {
			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
			ctx = {'scene': scene, 'camera': camera}
			anim.init(ctx, renderer);
		}
		loadParamMapping();
		this.curAnimName = animName;
		this.randomize();
	}

	this.setAudioManager = function(_audioManager) {
		audioManager = _audioManager;
	}

	this.nextAnimation = function() {
		if (this.curAnimName == null) {
			this.curAnimName = 'kaleidoscope';
		}
		switch (this.curAnimName) {
			case 'sphere':
				this.setAnimation('particles');
				break;
			case 'particles':
				this.setAnimation('kaleidoscope');
				break;
			case 'kaleidoscope':
				this.setAnimation('sphere');
				break;
			default:
				console.log('Error: Unknow animation name.');
		}
	}

	this.loadFeatures = function(filePath) {
		features = new Features();
		features.load(filePath);
	}

	this.onWindowResize = function() {
		ctx['camera'].aspect = window.innerWidth / window.innerHeight;
		ctx['camera'].updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function loadParamMapping() {
		paramMapping = new ParamMapping();
		paramMapping.load(anim.getPath() + '/parameters.json');
	}

	this.launch = function() {
		lastRenderTime = 0;
		renderAnimation();
	}

	this.randomize = function() {
		paramMapping.randomize();
	}

	function renderAnimation () {
		requestAnimationFrame(renderAnimation);
		renderer.render(ctx['scene'], ctx['camera']);
		var curTime = audioManager.getElapsedTime() * 1000.0;
		if (curTime > 0) {
			if (audioManager.ended()) {
				anim.update((curTime - lastRenderTime) / 1000.0, 
					paramMapping.doMapDefault(), 
					curTime - lastRenderTime);
				app.playNextSong();
			} else {
				anim.update((curTime - lastRenderTime) / 1000.0, 
					paramMapping.doMap(features.get(audioManager.getElapsedTime() * 1000.0 + SYNC_CONSTANT), 
					curTime - lastRenderTime));
			}
			lastRenderTime = curTime;
		}
	}
};
