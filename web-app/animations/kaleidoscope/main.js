/**
 * Animation from felixturner - http://airtight.cc
 */

function Kaleidoscope() {

	this.rgbParams;
	this.rgbPass;
	this.kaleidoParams;
	this.kaleidoPass;
	this.composer;
	this.cubeHolder;
	

	this.getPath = function (ctx) {
		return 'animations/kaleidoscope';
	}

	this.init = function (ctx, renderer) {
		ctx['camera'] = new THREE.PerspectiveCamera(50, 1.0, 0.1, 10000);
		ctx['camera'].position.z = 1000;

		//init object to hold cubes and rotate
		this.cubeHolder = new THREE.Object3D();
		ctx['scene'].add(this.cubeHolder);

		//add light
		var light = new THREE.PointLight(0xFFFFFF, 1);
		light.position = new THREE.Vector3(1000, 1000, 1000);
		ctx['scene'].add(light);

		//use lambert material to get greyscale shadows
		var material = new THREE.MeshLambertMaterial();

		//create cubes
		var geometry = new THREE.CubeGeometry(100, 100, 100);
		var spread = 2000;
		for(var j = 0; j < 100; j++) {
			var cube = new THREE.Mesh(geometry, material);
			//randomize size, posn + rotation
			cube.scale.x = cube.scale.y = cube.scale.z = Math.random() * 3 + .05;
			this.cubeHolder.add(cube);
			cube.position.x = Math.random() * spread - spread / 2;
			cube.position.y = Math.random() * spread - spread / 2;
			cube.position.z = Math.random() * spread - spread / 2;
			cube.rotation.x = Math.random() * 2 * Math.PI - Math.PI;
			cube.rotation.y = Math.random() * 2 * Math.PI - Math.PI;
			cube.rotation.z = Math.random() * 2 * Math.PI - Math.PI;
		}

		//POST PROCESSING
		//Create Shader Passes
		//render pass renders scene into effects composer
		var renderPass = new THREE.RenderPass( ctx['scene'], ctx['camera'] );
		this.rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
		this.kaleidoPass = new THREE.ShaderPass( THREE.KaleidoShader );

		//Add Shader Passes to Composer
		//order is important
		this.composer = new THREE.EffectComposer( renderer);
		this.composer.addPass( renderPass );
		this.composer.addPass( this.kaleidoPass );
		this.composer.addPass( this.rgbPass );

		//set last pass in composer chain to renderToScreen
		this.rgbPass.renderToScreen = true;

		this.rgbPass.uniforms[ "angle" ].value = 0.0*3.1416;
		this.rgbPass.uniforms[ "amount" ].value = 0.005;
		this.kaleidoPass.uniforms[ "sides" ].value = 12;
		this.kaleidoPass.uniforms[ "angle" ].value = 0.0*3.1416;
	}

	this.updateDefault = function () {
		this.cubeHolder.rotation.y += 0.002;
		this.cubeHolder.rotation.x += 0.002;
		this.composer.render(0.1);
	}

	this.update = function (timeDelta, parameters) {
		this.cubeHolder.rotation.y += parameters.rotationY;
		this.cubeHolder.rotation.x += parameters.rotationX;
		this.rgbPass.uniforms[ "angle" ].value = parameters.angleRGB*3.1416;
		this.rgbPass.uniforms[ "amount" ].value = parameters.amount;
		this.kaleidoPass.uniforms[ "sides" ].value = parameters.sides;
		this.composer.render(0.1);
	}
}