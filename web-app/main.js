/*var http = require("http");

http.createServer(function (request, response) {
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end('Hello World\n');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');*/

var nj = NumJS;
loadModel();

function loadModel() {
	model = new Net.CaffeModel(
		'models/autoencoder.prototxt',
		'weights/weights1'
		);

	model.load().then(function(){
		alert('ok')
	});
}