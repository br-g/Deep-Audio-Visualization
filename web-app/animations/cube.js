function Cube() {

	var geometry = null;
	var material = null;
	var cube = null;

	this.init = function (ctx) {
		geometry = new THREE.BoxGeometry( 1, 1, 1 );
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, material );
		ctx['scene'].add(cube);
		ctx['camera'].position.z = 5;
	}

	this.update = function (features) {
		console.log(features);
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
	}

}