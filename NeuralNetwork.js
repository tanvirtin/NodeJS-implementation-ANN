'use strict'; // to avoid JavaScript shananigans

var Neuron = require("./Neuron");


class NeuralNetwork {

	// constructor will take a list which will define the architecture of the Neural Network
	// the list might look like this [1, 2, 2, 1], this means an input layer with 1 neuron
	// two hidden layers with 2 neurons each and an output layer with 1 neuron
	// the 0th index is the input layer and the length - 1 index is the output layer
	// node the value inside each index of a list contains the number of neurons it posseses
	constructor(architecture, learningRate) {
		this.layers = []; // layers of neurons
		this.alpha = learningRate; // learning rate of the Neural Network
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

					// looping over feedForwarded array
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

				// loop over the weight array in a single neuron
				for (var k = 0; k < this.layers[i][j].weights.length; ++k) {		
	
					if (i + 1 !== this.layers.length) {	
						// each weight is dedicated to each neuron in the other layer
						// so the weight * output is simply multiplied together and passed onto a neuron
						
						// number of neurons in the next layer is the same as number of weights in the current layer
						// therefore variable k can be used to iterate both weights in this layer and neurons in the other layer
						this.layers[i + 1][k].feedForwarded.push(this.layers[i][j].weights[k] * this.layers[i][j].output);

					}
				}
				// neuron loop ends here
			}
		// layer loop ends here
		}
	}


	// this is where the real magic happens
	backPropagation(target) {
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

		// distribute the error array to the output neurons by looping over it

		for (var i = 0; i < this.layers[s].length ; ++i) {
			this.layers[s][i].error = err[i];
		}

		// error distributed proportionaly through the network
		this.distributeErrors();

		// looping over layers starting from the last layer
		for (var i = s; i > -1; --i) {
			// each kth neuron is like a Rick, a Rick which has a morty connected to it
			// in the other layer, which is jth layer, in other words i - 1 th layer
			// in our case, each morty has a unique Rick and can have only one Rick
			// but one Rick has many many Mortys in the layer before it

			// looping over the neurons in the jth layer
			for (var j = 0; j < this.layers[i].length; ++j) {


				if (i - 1 > -1) {

					// loops over the neurons in the kth layer, not to be confused with looping variable k
					// in other words looping over the neurons in the layer before current layer
					for (var k = 0; k < this.layers[i - 1].length; ++k) {
														// error - neuron error   // ok - kth layer neuron output   // oj - jth layer neuron output
						var deltaW = this.dEdW(this.layers[i - 1][k].error, this.layers[i][j].output, this.layers[i - 1][k].output);

						// we got the weights that we need to change now

						// the next step is to do stochastic gradient descent by taking part of this
						// weight change value and adding it to the actual weight value

						// again each weight has one neuron, so jth weight in a particular neuron in a particular layer 
						// would be responsible for the jth neuron in the next layer
						this.stochasticGD(this.layers[i - 1][k], j, deltaW);

					}


				}


			}


		}




	}

	////////////////////////////////////////////////////
	// Part - 1 - calculate the error from the output //
	///////////////////////////////////////////////////

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

	/////////////////////////////////////////////////////////////////////////////
	// Part - 2 - distribute the error proportionaly through the Neural Network//
	////////////////////////////////////////////////////////////////////////////

	distributeErrors() {
		var s = this.layers.length - 1;

		// start from the output layer
		for (var i = s; i > -1; --i) {

			// go through each neuron in the layer
			for (var j = 0; j < this.layers[i].length; ++j) {

				var ratioDenominator = 0;

				// ratioDenominator allocates the the weight denominator 
				// to find out the ratio of weight distribution 
	
				// makes sure we don't go below 0th index, we must stop at the 0th index
				if (i - 1 > -1) {

					for (var k = 0; k < this.layers[i - 1].length; ++k) {

						// since number of neurons in the next layer is equal to the
						// weights in the previous layer we can access weight index
						ratioDenominator += this.layers[i - 1][k].weights[j];

					} // iteration of the neurons in the previous layer ends here

					// first loop gathered the denominator
					// the next loop will apply the error using the ratio
					for (var k = 0; k < this.layers[i - 1].length; ++k) {

						// loops over each neuron and adds to existing error, same principle followed as the loop above it regarding the kth index
						this.layers[i - 1][k].error += ((this.layers[i - 1][k].weights[j] * this.layers[i][j].error) / ratioDenominator);

					}
				
				}

			} // looping over neurons in each layer ends here

		} // looping over the layer ends here

	}

	///////////////////////////////////////////////////////////////////////////
	// Part - 3 - calculate the gradient through which we do gradient descent//
	///////////////////////////////////////////////////////////////////////////

	// Note** - dEdW = dEdO * dOdW
	// dEdW is the error with respect to the weight which is basically just 2 * (t - E)
	// d0dW is the one giant expression that we deal below later

	// dEdW is the rate of change of the error with respect to the weights, this is what
	// we substract away in the gradient descent

	// Part - 3 - a

	// ok is the output value of the current layer k
	// oj is the output value of the previous layer neuron which contributed to ok
	// don't get confused its just its own personal output value
	dEdW(err, ok, oj) {
		return this.dEdO(err) * this.dOdW(ok, oj);
	}

	// Part - 3 - b

	// differentiation of the error in terms of the output --> -(tk - ok)
	// tk is the target value for the kth layer and ok is the output value for the kth layer

	dEdO(err) {
		return -(err)
	}

	// differentiation of the ouput with respect to the weights of the neuron
	
	// Part - 3 - c

	dOdW(ok, oj) {
		return ok * (1 - ok) * oj
	}

	//////////////////////////////////////////////////////////////////////////////////////
	// Part - 4 - stochastically descents down the gradient by taking a step towards it//
	////////////////////////////////////////////////////////////////////////////////////

	stochasticGD(neuron, index, deltaW) {

		neuron.weights[index] += (deltaW * this.alpha);

	}


	// activation function - sigmoid

	sigmoid(x) {
		return 1 / (1 + Math.exp(-x));
	}

}


module.exports = NeuralNetwork;