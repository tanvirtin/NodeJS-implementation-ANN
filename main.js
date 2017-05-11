'use strict';

var Neuron = require("./Neuron.js"); // when importing a personal module always use "./" dot slash to indicate home directory
var NeuralNetwork = require("./NeuralNetwork.js");

function main() {

	var nn = new NeuralNetwork([2, 2, 1], 0.2);

	var epochs = 10000;

	var x = [[0, 0], [0, 1], [1, 0], [1, 1]];
    
    var y = [[0], [1], [1], [0]];



	for (var i = 0; i < epochs; ++i) {
	
		// when math.floor is done you can never actually hit 4, even 3.99 will be rounded off to 3	
		var randIndex = Math.floor(Math.random() * 4);

		nn.feedForward(x[randIndex]);
		nn.backPropagate(y[randIndex]);

	}

	var result = []
	for (var i = 0; i < x.length; ++i) {
		nn.feedForward[i];
		result.push(nn.getOutput());
	}

	console.log(result);

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
