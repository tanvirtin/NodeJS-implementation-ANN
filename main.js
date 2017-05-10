'use strict';

var Neuron = require("./Neuron.js"); // when importing a personal module always use "./" dot slash to indicate home directory
var NeuralNetwork = require("./NeuralNetwork.js");

function main() {

	var nn = new NeuralNetwork([1, 4, 4, 4, 4, 1]);

	for (var i = 0; i < 60000; ++i)
		nn.feedForward([22]);

	nn.displayOutput();


}


/*
	The expression below is equal to saying

	if __name__ == "__main__":
		main()

	in Python

*/

if (!module.parent) 
	main();