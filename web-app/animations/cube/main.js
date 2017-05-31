function Cube() {
	var mesh = null;
	
	this.getPath = function (ctx) {
		return 'animations/cube';
	}

	this.init = function (ctx) {
		ctx['camera'].position.z = 500;

		ctx['scene'].fog = new THREE.Fog( 0x000000, 1, 15000 );

		var light = new THREE.PointLight( 0xff2200 );
		light.position.set(100, 100, 100);
		ctx['scene'].add(light);
		var light = new THREE.AmbientLight(0x111111);
		ctx['scene'].add(light);

		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, morphTargets: true } );

		// construct 8 blend shapes
		for ( var i = 0; i < 8; i ++ ) {
			var vertices = [];
			for ( var v = 0; v < geometry.vertices.length; v ++ ) {
				vertices.push( geometry.vertices[ v ].clone() );
				if ( v === i ) {
					vertices[ vertices.length - 1 ].x *= 2;
					vertices[ vertices.length - 1 ].y *= 2;
					vertices[ vertices.length - 1 ].z *= 2;
				}
			}
			geometry.morphTargets.push( { name: "target" + i, vertices: vertices } );
		}
		mesh = new THREE.Mesh(geometry, material);
		ctx['scene'].add(mesh);
	}

	this.update = function (timeDelta, parameters) {
		mesh.rotation.y += parameters.rotation;
		mesh.morphTargetInfluences[0] = parameters.influence1;
		mesh.morphTargetInfluences[1] = parameters.influence2;
		mesh.morphTargetInfluences[2] = parameters.influence3;
		mesh.morphTargetInfluences[3] = parameters.influence4;
		mesh.morphTargetInfluences[4] = parameters.influence5;
		mesh.morphTargetInfluences[5] = parameters.influence6;
		mesh.morphTargetInfluences[6] = parameters.influence7;
		mesh.morphTargetInfluences[7] = parameters.influence8;
	}
}