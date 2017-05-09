'use strict';

var Neuron = require("./Neuron.js"); // when importing a personal module always use "./" dot slash to indicate home directory
var NeuralNetwork = require("./NeuralNetwork.js");

function main() {

	var nn = new NeuralNetwork([1, 2, 2, 1]);

	//nn.displayLayers();

	nn.feedForward([22]);

}


/*
	The expression below is equal to saying

	if __name__ == "__main__":
		main()

	in Python

*/

if (!module.parent) 
	main();