var nj = NumJS;
loadModel();

function loadModel() {
	model = new Net.CaffeModel(
		'models/autoencoder.prototxt',
		'weights/weights1/'
		);

	model.load().then(function(){
		
		var inputs = new Net.Vol(256, 1, 1, 0.0);
		for(var i = 0; i < 256; i++) {
			inputs.set(i, 0, 0, Math.random());
		}

		var outputs = model.forward(inputs);
		console.log(outputs);
	});
}