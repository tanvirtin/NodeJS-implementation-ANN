'use strict'; // to avoid JavaScript shananigans

var Neuron = require("./Neuron");
var seedrandom = require("seedrandom");
var rng = seedrandom("hello."); // seeded random numbers for debugging purposes

class NeuralNetwork {

	constructor(architecture, learningRate) {
		this.layers = []; // layers of neurons
		this.alpha = learningRate; // learning rate of the Neural Network
		this.generateLayers(architecture);
	}

	generateLayers(aList) {
		for (var i = 0; i < aList.length; ++i) {
			var layer = []

			for (var j = 0; j < aList[i]; ++j) {
				if (i !== 0) { // this says that as long as the next layer is not

					layer.push(new Neuron(aList[i - 1], rng)); // equal to the length - 1 layer, as length - 1 layer is the output layer of the ANN
				
				} else { // else if it is the outout layer then make an array of 0 neurons
				
					layer.push(new Neuron(0, rng));
				
				}	
			}
			this.layers.push(layer);
		}
	}

	// feeds forward the inputs through the layer
	// must take a list of inputs which equals the first layer
	feedForward(inputList) {
		
		// simple error check
		if (inputList.length !== this.layers[0].length) {
			console.log("List of inputs does not match the Neural Network architecture");
			return;
		}

		// looping over the neurons in the first layer and assining
		// the inputs to the output of the neurons in the first layer

		for (var i = 0; i < this.layers[0].length; ++i) {
			this.layers[0][i].output = inputList[i];
		}

		// loop through each layer
		for (var i = 0; i < this.layers.length; ++i) {

			for (var j = 0; j < this.layers[i].length; ++j) {

				// bounds checking to make sure we don't go over the output layer
				if (i + 1 !== this.layers.length) { // we are accessing i + 1 thats why we check if i + 1 is not more than length itself
													// because if we are at the last index it will be this.layers.length - 1, so plus that would be equal to length which is index out of bounds

					// looping over neurons in the next layer
					for (var k = 0; k < this.layers[i + 1].length; ++k) {
						// multiply this.layers[i][j].output * this.layers[i][k].weight[j]
						// add it to the this.layers[i][k] th neuron in the next layer

						this.layers[i + 1][k].output += this.layers[i][j].output * this.layers[i + 1][k].weights[j];


					} // looping over the neurons in the next layer ends here

				} 

			} // looping over each neurons in a layer ends here

			// same check again
			if (i + 1 !== this.layers.length) {

				// the neurons need to be activated after all the previous 
				// layer data has been feed forwarded into the neurons
				for (var k = 0; k < this.layers[i + 1].length; ++k) {

					this.layers[i + 1][k].output = this.sigmoid(this.layers[i + 1][k].output);

				} // looping over neurons end here

			}


		} // looping over layers in a Neural Network ends here

	}


	// this is where the real magic happens
	backPropagate(target) {
		// s is essentially the output layer's index and our starting index for the loop
		var s = this.layers.length - 1;

		// error check to see if target array provided matches the outer layer size
		if (target.length !== this.layers[s].length) {
			console.log("Target array size does not match the outputs");
			return;
		}

		// extract the output and store it in an output array
		
		var o = [];

		for (var i = 0; i < this.layers[s].length; ++i) {
			o.push(this.layers[s][i].output);
		}

		// now the error needs to be calculated for the output layer then back propagated

		var err = this.error(target, o); // containts all the error values in an array

		// loops over the last layer which is the output layer and assigns error values to neurons
		for (var i = 0; i < this.layers[s].length; ++i) {
			this.layers[s][i].delta = err[i] * this.sigmoidPrime(this.layers[s][i].output);
		}

		// back propagation done using the delta rule to calculate dE/dW (differentiation of error with respect to the weight)

		// loop starts from the layer before the output layer till before the hidden layers end, which the next layer after the input layer
		for (var i = s - 1; i > 0; --i) {

			for (var j = 0; j < this.layers[i].length; ++j) {

				if (i + 1 !== this.layers.length) {
				
					for (var k = 0; k < this.layers[i + 1].length; ++k) {
						// sums up the delta values of the current layer's neuron using the next layer's 
						// delta * weight at the kth index for the neuron with the jth index for the kth indexed neuron
						// each neuron in the current layer has exactly the same number of weights attached to it as the number of
						// neurons in the next layer
						this.layers[i][j].delta += this.layers[i + 1][k].delta * this.layers[i + 1][k].weights[j];


					} // looping over the neurons in the next layer ends here

				}


			} // looping over the neurons in the current layer ends here

			// loops over the neurons in the layer and multiplies the derivative of the activation function and the deltas
			for (var j = 0; j < this.layers[i].length - 1; ++j) {
			
				this.layers[i][j].delta = this.layers[i][j].delta * this.sigmoidPrime(this.layers[i][j].output);

			} // looping over the neurons in a layer ends here



		} // looping over the hidden layers in a Neural Network ends here


		// using the deltas we now perform stochastic gradient descent
		this.stochasticGD();

	}


	stochasticGD() {

		for (var i = 1; i < this.layers.length; ++i) {

			for (var j = 0; j < this.layers[i].length; ++j) {

				for (var k = 0; k < this.layers[i][j].weights.length; ++k) {
				
					this.layers[i][j].weights[k] += this.alpha * this.layers[i][j].delta * this.layers[i - 1][k].output;
				
				} // looping over the weights in an individual neuron ends here

			
			} // looping over neurons in a layer ends here

		} // looping over each layer in a Neural Network ends here

	}


	// both arguments are in array form
	error(target, output) {
		// either of the expression needs to be true in order for the entire expression to be true
		if (target.constructor !== Array || output.constructor !== Array || target.length !== output.length) {
			console.log("Wrong data format, expected array and both must be of the same length");
			return;
		}

		var err = [];
		for (var i = 0; i < output.length; ++i) {
			err.push(target[i] - output[i]);
		}
		return err;
	}

	// activation function - sigmoid
	sigmoid(x) {
		return 1 / (1 + Math.exp(-x));
	}

	// the derivative of the sigmoid function (activation function)
	sigmoidPrime(x) {
		return x * (1.0 - x);
	}

	// one function to both feedForward and backPropagate
	train(inputList, outputList) {
		this.feedForward(inputList);
		this.backPropagate(outputList);
	}


	displayLayers() {
		for (var i = 0; i < this.layers.length; ++i) {
			console.log("Layer " + (i + 1));
			for (var j = 0; j < this.layers[i].length; ++j) {
				// displayWeights() already console.logs, so no need to do console.log(this.layers[i][j].displayWeights()) thats dumb...
				console.log(this.layers[i][j]); // displays weight for each neuron in a layer
			
			}
			console.log("");
		}
	}


	// displays the output layer
	displayOutput() {
		for (var i = 0; i < this.layers[this.layers.length - 1].length; ++i) {
			console.log("Output value " + (i + 1) + " --> " + this.layers[this.layers.length - 1][i].output.toFixed(2).toString());
		}
	}

	getOutput() {
		var out = []
		// loop through the output neurons and grab the 
		// output value and store it in an array which gets returned

		for(var i = 0; i < this.layers[this.layers.length - 1].length; ++i) {
			out.push(this.layers[this.layers.length - 1][i].output);
		}

		return out;
	}


	getErrors() {
		var err = []
		for (var i = 0; i < this.layers[this.layesr.length - 1].length; ++i) {
			err.push(this.layers[this.layers.length - 1][i].error);
		}

	}

}


module.exports = NeuralNetwork;