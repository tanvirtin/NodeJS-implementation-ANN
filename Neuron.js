'use strict';
class Neuron {

	// node randomNum is a function that gets passed on by the Neural Network

	constructor(numNeuronsNL, randomNum) {
		this.weights = []; // array of weights which connects this layer's neurons to the previous layer's neurons
		this.output = 0; // this is the activated output value that a neuron holds		
		this.deltaError = 0; // contains the delta error value
		this.assignWeights(numNeuronsNL, randomNum);
	}

	assignWeights(size, randomNum) {
		for (var i = 0; i < size; ++i) {
			this.weights.push(randomNum());
		}
	}

}


module.exports = Neuron;