'use strict';

var Neuron = require("./Neuron.js"); // when importing a personal module always use "./" dot slash to indicate home directory
var NeuralNetwork = require("./NeuralNetwork.js");

function main() {

	var nn = new NeuralNetwork([1, 10, 1], 0.5);

	var epochs = 800000

	for (var i = 0; i < epochs; ++i) {
		nn.train([9], [0]);
		nn.train([9], [0]);		
		nn.train([3], [1]);
		nn.train([3], [1]);		
		nn.train([4], [0]);
		nn.train([4], [0]);		
	}

	nn.feedForward([9]);
	console.log("For 9");
	nn.displayOutput();


	nn.feedForward([3]);
	console.log("For 3");
	nn.displayOutput();

	nn.feedForward([4]);
	console.log("For 4");
	nn.displayOutput();


}

/*
	The expression below is equal to saying

	if __name__ == "__main__":
		main()

	in Python

*/

if (!module.parent) {
	main();
}
