'use strict';

var Neuron = require("./Neuron.js"); // when importing a personal module always use "./" dot slash to indicate home directory
var NeuralNetwork = require("./NeuralNetwork.js");

function main() {

	var nn = new NeuralNetwork([1, 4, 4, 1], 0.5);

	var epochs = 800000

	for (var i = 0; i < epochs; ++i) {
		if (i % 10000 === 0) {
			console.log("On " + i + "th epoch...");
		}
		nn.train([9], [0]);
		nn.train([9], [0]);		
		nn.train([3], [1]);
		nn.train([3], [1]);	
		nn.train([4], [1]);
		nn.train([4], [1]);		
	}

	console.log(nn.query([9]));

	console.log(nn.query([3]));

	console.log(nn.query([4]));

}

if (!module.parent) {
	main();
}
