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
				this.layers[i][j].displayWeights(); // displays weight for each neuron in a layer
			
			}
			console.log("");
		}
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
				// we are now inside the array containing neurons in a particular layer

				// this.layer[i][j] // this is an individual neuron in a particular layer
								// each neuron has 3 attributes, weights, deltaWeights and output

				var o = this.layer[i][j].output * 


			}



		}



	}

	// activation function - sigmoid

	sigmoid(x) {
		return 1 / (1 + Math.exp(-x));
	}

}


module.exports = NeuralNetwork;