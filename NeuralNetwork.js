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

	// generates the layers of a Neural Network
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
			throw Error("List of inputs does not match the Neural Network architecture");
			return;
		}

		// looping over the neurons in the first layer and assining
		// the inputs to the output of the neurons in the first layer

		for (var i = 0; i < this.layers[0].length; ++i) {
			this.layers[0][i].output = inputList[i];
		}

		// loop through each layer starting from the hidden layer
		for (var i = 1; i < this.layers.length; ++i) {

			for (var j = 0; j < this.layers[i].length; ++j) {
			
				// looping over neurons in the next layer
				for (var k = 0; k < this.layers[i - 1].length; ++k) {
					// NOTE** - index of neurons at the previous layer k is equal to the index of the weights in the current neuron and each weight is connected to a single neuron
			
					this.layers[i][j].output += this.layers[i - 1][k].output * this.layers[i][j].weights[k];

				} // looping over the neurons in the previous layer ends here

				// neurons being activated
				this.layers[i][j].output = this.sigmoid(this.layers[i][j].output);
		
			} // looping over each neurons in a layer ends here

		} // looping over layers in a Neural Network ends here

	}

	// this is where the real magic happens
	backPropagate(target) {
		// s is essentially the output layer's index and our starting index for the loop
		var s = this.layers.length - 1;

		// error check to see if target array provided matches the outer layer size
		if (target.length !== this.layers[s].length) {
			throw Error("Target array size does not match the outputs");
			return;
		}

		// loops over the last layer which is the output layer and assigns delta error values to neurons
		for (var i = 0; i < this.layers[s].length; ++i) {
			this.layers[s][i].deltaError = (target[i] - this.layers[s][i].output) * this.sigmoidPrime(this.layers[s][i].output);
		}

		// back propagation done using the deltaError rule to calculate dE/dW (differentiation of error with respect to the weight)

		// loop starts from the layer before the output layer till before the hidden layers end, which the next layer after the input layer
		for (var i = s - 1; i > 0; --i) {

			for (var j = 0; j < this.layers[i].length; ++j) {

				for (var k = 0; k < this.layers[i + 1].length; ++k) {
					// sums up the deltaError values of the current layer's neuron using the next layer's 
					// deltaError * weight at the kth index for the neuron with the jth index for the kth indexed neuron
					// each neuron in the current layer has exactly the same number of weights attached to it as the number of
					// neurons in the next layer
					this.layers[i][j].deltaError += this.layers[i + 1][k].deltaError * this.layers[i + 1][k].weights[j];

				} // looping over the neurons in the next layer ends here

				this.layers[i][j].deltaError = this.layers[i][j].deltaError * this.sigmoidPrime(this.layers[i][j].output);

			} // looping over the neurons in the current layer ends here

		} // looping over the hidden layers in a Neural Network ends here

		// using the deltaErrors we now perform stochastic gradient descent
		this.stochasticGD();

	}

	// uses stochastic gradient descent to update the weights in each layer in the Neural Network
	stochasticGD() {
		for (var i = 1; i < this.layers.length; ++i) {

			for (var j = 0; j < this.layers[i].length; ++j) {

				for (var k = 0; k < this.layers[i][j].weights.length; ++k) {
				
					this.layers[i][j].weights[k] += this.alpha * this.layers[i][j].deltaError * this.layers[i - 1][k].output; // again self.layers[i - 1][k].output, k because each weight is destined to have only one input 
				
				} // looping over the weights in an individual neuron ends here
	
			} // looping over neurons in a layer ends here

		} // looping over each layer in a Neural Network ends here

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

	// provides abstraction for querying the Neural Network
	query(inputList) {
		this.feedForward(inputList);
		var out = []
		// loop through the output neurons and grab the 
		// output value and store it in an array which gets returned
		for(var i = 0; i < this.layers[this.layers.length - 1].length; ++i) {
			out.push(this.layers[this.layers.length - 1][i].output);
		}
		return out;
	}

	// prints the entire Neural Network to the screen
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
	outputToString() {
		var str = ""
		for (var i = 0; i < this.layers[this.layers.length - 1].length; ++i) {
			str += "Output value " + (i + 1) + " --> " + this.layers[this.layers.length - 1][i].output.toFixed(2).toString() + " ";
		}
		return str;
	}

}


module.exports = NeuralNetwork;