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

}


module.exports = NeuralNetwork;