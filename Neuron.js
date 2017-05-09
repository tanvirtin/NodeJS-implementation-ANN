'use strict';

class Neuron {

	// takes in a number of neurons next layer has
	constructor(numNeuronsNL) {
		this.weights = []; // array of weights
		for (var i = 0; i < numNeuronsNL; ++i) {
			this.weights.push(this.randomW());
		}
		this.deltaWeights = []; // array of weight value changes
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