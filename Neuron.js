'use strict';

/*
	NOTE** - ouput neurons will contain no weight values and will be an empty list
*/

class Neuron {

	// node randomNum is a function that gets passed on by the Neural Network

	// takes in a number of neurons next layer has
	constructor(numNeuronsNL, randomNum) {
		this.weights = []; // array of weights
		this.output = 0; // this is the activated output value that a neuron holds		
		this.delta = 0; // contains the delta error value
		this.assignWeights(numNeuronsNL, randomNum);
	}

	assignWeights(size, randomNum) {
		for (var i = 0; i < size; ++i) {
			this.weights.push(randomNum());
		}
	}

	displayWeights() {
		console.log(this.weights);
	}

	// generates a random weight between -1 and 1
	randomW() {
		var r = Math.random();

		if (r > 0.5) {
			return -Math.random();
		} else {
			return Math.random();
		}
	}


}


module.exports = Neuron;