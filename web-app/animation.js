function AnimationManager() {
	var ctx = null; // camera + scene
	var anim = null;
	var renderer = null;
	var features = null;
	var paramMapping = null;
	var startTime = 0;
	var lastRenderTime = 0;

	this.init = function() {
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		ctx = {'scene': scene, 'camera': camera}
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
	}

	this.setAnimation = function(animName) {
		switch (animName) {
			case 'cube':
				anim = new Cube();
				break;
			case 'particles':
				anim = new Particles();
				break;
			default:
				console.log('Error: Unknow animation name.');
		}
		if (anim) anim.init(ctx);
		loadParamMapping();
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
		startTime = new Date().getTime();
		lastRenderTime = startTime;
		renderAnimation();
	}

	this.randomize = function() {
		paramMapping.randomize();
	}

	function renderAnimation () {
		requestAnimationFrame(renderAnimation);
		renderer.render(ctx['scene'], ctx['camera']);
		var curTime = new Date().getTime();
		console.log(features.get(curTime - startTime))
		anim.update((curTime - lastRenderTime) / 1000.0, paramMapping.doMap(features.get(curTime - startTime)));
		lastRenderTime = curTime;
	}
};
