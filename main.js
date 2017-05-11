'use strict';

var Neuron = require("./Neuron.js"); // when importing a personal module always use "./" dot slash to indicate home directory
var NeuralNetwork = require("./NeuralNetwork.js");

function main() {

	var data = trainingData();

	var nn = new NeuralNetwork([1, 2, 1], 0.01);

	nn.feedForward([10]);
	nn.backPropagation([1]);

	nn.displayLayers();

}

function trainingData() {

	var data = [];

	for (var i = 0; i < 10; ++i) {
		var pair = [];
		pair.push(i);

		if (i % 2 == 0) {
			pair.push(1);
		} else {
			pair.push(0);
		}

		data.push(pair);

	}

	return data;

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
