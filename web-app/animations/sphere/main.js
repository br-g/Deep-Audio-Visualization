/***************************************************/
/* Animation using the "Particulate.js" library.
/* Inspired from one of its example.
/*
/* https://particulatejs.org
/***************************************************/

function Sphere() {

	this.simulation = null;
	this.composer = null;
	this.lines = null;
	this.renderer = null;
	this.visParticles = null;
	this.visConnectors = null;
	this.bounds = null;
	this.distances = null;

	this.dots = null;
	this.texture = null;

	this.getPath = function () {
		return 'animations/sphere';
	}

	this.init = function (ctx, renderer) {

		//*********************/
		// Init scene
		//*********************/
		ctx['scene'].fog = new THREE.Fog(0x050505, 1, 200);
		//ctx['camera'] = new THREE.PerspectiveCamera(30, 1, 5, 3500);
		ctx['camera'].position.set(0, 50, -40);
		ctx['camera'].lookAt(ctx['scene'].position);


		//*********************/
		// Init simulation
		//*********************/
		var tris = 1000;
		var particles = tris * 3;
		var distance = 1.0;
		simulation = Particulate.ParticleSystem.create(particles, 2);

		this.bounds = Particulate.PointForce.create([0, 0, 0], {
			type : Particulate.Force.ATTRACTOR_REPULSOR,
			intensity : 0.05,
			radius : 15.0
		});

		var linkIndices = [];
		var visIndices = [];
		(function () {
		var a, b, c;
		for (var i = 2, il = particles; i < il; i ++) {
		  a = i;
		  b = a - 1;
		  c = a - 2;
		  linkIndices.push(a, b, b, c, c, a);
		  visIndices.push(a);
		}
		}());

		simulation.each(function (i) {
			simulation.setPosition(i,
			  (Math.random() - 0.5) * 10,
			  (Math.random() - 0.5) * 10,
			  (Math.random() - 0.5) * 10);
		});

		this.distances = Particulate.DistanceConstraint.create([distance * 0.5, distance], linkIndices);

		simulation.addConstraint(this.distances);
		simulation.addForce(this.bounds);

		(function relax() {
			for (var i = 0; i < 50; i ++) {
			  this.simulation.tick(1);
			}
		}());

		this.simulation = simulation;


		//*********************/
		// Init visualization
		//*********************/
		var vertices = new THREE.BufferAttribute(this.simulation.positions, 3);
		var indices = new THREE.BufferAttribute(new Uint16Array(visIndices), 1);

		// Particles
		this.texture = THREE.ImageUtils.loadTexture(this.getPath() + '/particle.png');
		this.dots = new THREE.BufferGeometry();
		this.dots.addAttribute('position', vertices);

		this.visParticles = new THREE.PointCloud(this.dots,
			new THREE.PointCloudMaterial({
			  color : "hsl(220, 50%, 50%)",
			  blending : THREE.AdditiveBlending,
			  transparent : true,
			  map : this.texture,
			  size : 1.0,
			  opacity : 0.7
			}));

		// Connections
		this.lines = new THREE.BufferGeometry();
		this.lines.addAttribute('position', vertices);
		this.lines.addAttribute('index', indices);

		this.visConnectors = new THREE.Line(this.lines,
			new THREE.LineBasicMaterial({
			  blending : THREE.AdditiveBlending,
			  transparent : true,
			  color : "hsl(220, 50%, 50%)",
			  linewidth : 1,
			  opacity : 0.7
			}));

		ctx['scene'].add(this.visParticles);
		ctx['scene'].add(this.visConnectors);


		//*********************/
		// Init renderer
		//*********************/
		renderer.autoClear = false;
		renderer.setClearColor(0x050505, 1);
		

		//*********************/
		// Init post FX
		//*********************/
		this.composer = new THREE.EffectComposer(renderer);
		var renderScene = new THREE.RenderPass(ctx['scene'], ctx['camera']);
		var bloom = new THREE.BloomPass(2.0);
		var copy = new THREE.ShaderPass(THREE.CopyShader);

		copy.renderToScreen = true;

		this.composer.addPass(renderScene);
		this.composer.addPass(bloom);
		this.composer.addPass(copy);
	}

	this.updateDefault = function () {
		this.composer.render(0.1);
		this.simulation.tick(0.5);
		this.lines.attributes.position.needsUpdate = true;
	}

	this.update = function (timeDelta, parameters) {

		var colorString = "hsl(" + parameters.hue + ", " + parameters.saturation + "%, " + parameters.lightness + "%)"
		this.visParticles.material.color = new THREE.Color( colorString );
		this.visConnectors.material.color = new THREE.Color( colorString );

		this.visConnectors.material.opacity = parameters.opacity;
		this.visParticles.material.opacity = parameters.opacity;

		this.visParticles.material.size = parameters.size;

		this.distances.setDistance(parameters.edgesDistance);
		this.simulation.setWeights(parameters.particlesWeight);

		this.composer.render(0.1);
		this.simulation.tick(0.5);
		this.lines.attributes.position.needsUpdate = true;
	}
}