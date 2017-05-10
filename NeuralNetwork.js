'use strict'; // to avoid JavaScript shananigans

var Neuron = require("./Neuron");


class NeuralNetwork {

	// constructor will take a list which will define the architecture of the Neural Network
	// the list might look like this [1, 2, 2, 1], this means an input layer with 1 neuron
	// two hidden layers with 2 neurons each and an output layer with 1 neuron
	// the 0th index is the input layer and the length - 1 index is the output layer
	// node the value inside each index of a list contains the number of neurons it posseses
	constructor(architecture) {
		this.layers = [];
		this.generateLayers(architecture);
	}

	generateLayers(aList) {
		for (var i = 0; i < aList.length; ++i) {
			var layer = []

			for (var j = 0; j < aList[i]; ++j) {
				// each layer will contain the number specified in the index about of neurons
				// then each neurons will contain weights which is the value of the next layers
				// number of neurons, each neurons need n number of weights where n is equal to
				// the number of neurons in the next layer as each weight in one neuron connects
				// to n number of neurons in the other layer (1 neuron containing 4 weights to 
				// connect to 4 neurons in the next layer)

				// layer 0 -> checks layer 1
				// layer 1 -> checks layer 2
				// layer 2 -> checks layer 3
				// layer 3 -> checks layer 4 // boom layer 3 is the last layer

				if (i + 1 !== aList.length) { // this says that as long as the next layer is not
				
					layer.push(new Neuron(aList[i + 1])); // equal to the length - 1 layer, as length - 1 layer is the output layer of the ANN
				
				} else { // else if it is the outout layer then make an array of 0 neurons
				
					layer.push(new Neuron(0));
				
				}	
			}
			this.layers.push(layer);
		}
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
		console.log(this.layers[this.layers.length - 1]);
	}

	// feeds forward the inputs through the layer
	// must take a list of inputs which equals the first layer
	feedForward(inputList) {
		// one of the expression must be true in order for the entire expression to be
		// evaluated to true, either the inputList variable is not an array or
		// the inputLayer list does not have the same size/number of elements as the
		// as the array provided through the parameter of the function
		if (inputList.constructor !== Array || inputList.length != this.layers[0].length) {
			console.log("Input layer architecture error!");
			return;
		}




		// inputList contains a value or a bunch of values in each index of the list
		// these value(s) are the values of the first layer neurons, which are our input neurons

		for (var i = 0; i < inputList.length; ++i) {
			
			this.layers[0][i].output = inputList[i];

		}

		// the value from the input layer needs to be feed forwarded to the rest of the layers

		for (var i = 0; i < this.layers.length; ++i) {

			// goes through each layer and does the magic

			for (var j = 0; j < this.layers[i].length; ++j) {

				// add the feedForwarded values in each neuron and squash it and store it as your output
				// checks if we are in the input layer or not, if we are then skip this thing
				if (i !== 0) {
					var val = 0;

					for (var x = 0; x < this.layers[i][j].feedForwarded.length; ++x) {
						val += this.layers[i][j].feedForwarded[x];
						this.layers[i][j].feedForwarded = []; // empty out the array in preparation for the next iteration
					}

					var activated = this.sigmoid(val);

					this.layers[i][j].output = activated;

				}

				// we are now inside the array containing neurons in a particular layer

				// this.layer[i][j] // this is an individual neuron in a particular layer
								// each neuron has 3 attributes, weights, deltaWeights and output


				// loop over the weights in a single neuron
				for (var k = 0; k < this.layers[i][j].weights.length; ++k) {
					// contains the array of weights
					// the formula w * xi, where xi is the input value
					// this layer		

	
					if (i + 1 !== this.layers.length) {	

						// each weight is dedicated to each neuron in the other layer
						// so the weight * output is simply multiplied together and passed onto a neuron
						
						// number of neurons in the next layer is the same as number of weights in the current layer
						// therefore variable k can be used to iterate both weights in this layer and neurons in the other layer
						this.layers[i + 1][k].feedForwarded.push(this.layers[i][j].weights[k] * this.layers[i][j].output);


					}

				}
			}
		}
	}


	// this is where the real magic happens
	backPropagation() {

		// the loop has to be backwards as now we are starting from the last element

		// if the array is [1, 2, 3, 4], array starts off from [4, 3, 2, 1] 
		for (var i = this.layers.length - 2; i > -1; --i) {

			// this loop traverses each layer, and each layer contains array of neurons

		}	



	}

	// neurons weights and value is important, so we take the neuron itself
	dedw(error, neuron) {
		return error * (1 / (1 + Math.exp(-(this.sumWO(neuron))))) * (1 - (1 / (-(this.sumWO(neuron))))) * neuron.output
	}

	// sums up all the weight * output for an individual neuron
	// sigma of Wj * Oj jth layer neuron
	sumWO(neuron) {
		var val = 0;
		for (var i = 0; i < neuron.weights.length; ++i) {
			val += neuron.weights[i] * neuron.output;
		}
		return val;
	}


	// error function for the Neural Network

	// E = (t - o)^2
	// target value is the value that the Neural Network is suppose to output,
	// output value is the value that the Neural Network actually output

	// both arguments are in array form
	error(target, output) {
		// either of the expression needs to be true in order for the entire expression to be true
		if (target.constructor !== Array || output.constructor !== Array || target.length !== output.length) {
			console.log("Wrong data format, expected array and both must be of the same length");
			return;
		}

		var err = [];
		for (var i = 0; i < output.length; ++i) {
			err.push(Math.pow((target[i] - output[i]), 2));
		}
		return err;
	}

	// activation function - sigmoid

	sigmoid(x) {
		return 1 / (1 + Math.exp(-x));
	}

}


module.exports = NeuralNetwork;