function Animation(features) {
	var scene = null;
	var camera = null;
	var ctx = null;
	var anim = null;
	var renderer = null;
	var startTime = 0;

	this.init = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		ctx = {'scene': scene, 'camera': camera}
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
	}

	this.setMode = function(mode) {
		switch (mode) {
			case 'cube':
				anim = new Cube();
				break;
			default:
				console.log('Error: Unknow animation mode.');
		}
		if (anim) anim.init(ctx);
	}

	this.launch = function() {
		startTime = new Date().getTime();
		render();
	}

	function render() {
		requestAnimationFrame(render);
		renderer.render(ctx['scene'], ctx['camera']);
		anim.update(features.get(new Date().getTime() - startTime));
	}
};
