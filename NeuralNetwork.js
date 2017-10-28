'use strict'; // to avoid JavaScript shananigans

var Neuron = require("./Neuron");
var seedrandom = require("seedrandom");
var rng = seedrandom("hello."); // seeded random numbers for debugging purposes

class NeuralNetwork {

	constructor(dimension, learningRate) {
		this.layers = []; // layers of neurons
		this.alpha = learningRate; // learning rate of the Neural Network
		this.generateLayers(dimension);
	}

	// generates the layers of a Neural Network
	generateLayers(dimension) {
		// error check to make sure the param is an array
		if (!Array.isArray(dimension)) {
			throw Error("Invalid dimensions provided");
		}
		for (var i = 0; i < dimension.length; ++i) {
			var layer = []
			for (var j = 0; j < dimension[i]; ++j) {
				if (i !== 0) { // this says that as long as the next layer is not
					// NOTE** - we are adding = 1 to number of neurons in the previous layer because we want an additional weight value which will be the bias
					layer.push(new Neuron(dimension[i - 1] + 1, rng)); // equal to the length - 1 layer, as length - 1 layer is the output layer of the ANN
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
		if (inputList.length !== this.layers[0].length || !Array.isArray(inputList)) { // either of these expression need to be true in order for the entire expression to evaluate to true
			throw Error("List of inputs does not match the Neural Network architecture");
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

				// since we loop through the weight values in the current layers neurons using the neuron numbers of the previous layer
				// as number of weights of a neuron in a current layer equals to the number of neurons in the previous layer we have to
				// add the bias term values ourselves

				// and bias weights always gets multiplied by 1
				this.layers[i][j].output += this.layers[i][j].weights[this.layers[i][j].weights.length - 1] * 1

				if (i !== this.layers.length - 1) {
					// individual neuron being activated upon exceeding the threshold value
					this.layers[i][j].output = this.sigmoid(this.layers[i][j].output);
				}
		
			} // looping over each neurons in a layer ends here

		} // looping over layers in a Neural Network ends here

	}

	// this is where the real magic happens
	backPropagate(targetList) {
		// s is essentially the output layer's index and our starting index for the loop
		var s = this.layers.length - 1;

		// error check to see if targetList array provided matches the outer layer size
		if (targetList.length !== this.layers[s].length || !Array.isArray(targetList)) { // either of these expressions need to be true in order for the entire expression to be true
			throw Error("Target list array size does not match the outputs");
		}

		// loops over the last layer which is the output layer and assigns delta error values to neurons
		for (var i = 0; i < this.layers[s].length; ++i) {
			// delta_e(theta) = (t - 0) * sigmoidPrime(output(theta))
			this.layers[s][i].deltaError = (targetList[i] - this.layers[s][i].output) * this.sigmoidPrime(this.layers[s][i].output);
		}

		// back propagation done using the deltaError rule to calculate dE/dW (differentiation of error with respect to the weight)

		// now we loop all the hidden layers starting backwards not including the input layer and calculate
		// the delta_e error values for the neurons in the hidden layer
		// delta_e(j) = sigma->error-k * weight-k->j

		// loop starts from the layer before the output layer till before the hidden layers start, which is next layer after the input layer
		for (var i = s - 1; i > 0; --i) {

			for (var j = 0; j < this.layers[i].length; ++j) {

				for (var k = 0; k < this.layers[i + 1].length; ++k) {
					// sums up the deltaError values of the current layer's neuron using the next layer's 
					// deltaError * weight at the kth index for the neuron with the jth index for the kth indexed neuron
					// each neuron in the current layer has exactly the same number of weights attached to it as the number of
					// neurons in the next layer
					this.layers[i][j].deltaError += this.layers[i + 1][k].deltaError * this.layers[i + 1][k].weights[j];

				} // looping over the neurons in the next layer ends here

				// delta_e(j) = (delta_e(k)) * sigmoidPrime(output(j))
				this.layers[i][j].deltaError = this.layers[i][j].deltaError * this.sigmoidPrime(this.layers[i][j].output);

			} // looping over the neurons in the current layer ends here

		} // looping over the hidden layers in a Neural Network ends here

		// using the deltaErrors we now perform stochastic gradient descent
		this.stochasticGD();

	}

	/*
		Loops over all the neurons in every layer except the input layer
		and applies the changes to the weights delta_e which are stored as in
		as delta_e attribute. This is the moment we have been waiting for
		dEj/dWi->j =  delta(j) * output-i, this is the formula to find the
		gradient and now we have all the pieces, we take the change in error value
		multiply times some learning rate and times with the output of the neuron in the
		previous layer for which the weight belongs to and update the weight.

		NOTE** - multiplying the delta error value with the output of the neuron in the previous
				 layer gives us the gradient of the cost function, also known as the rate of 
		 		 change of error in a Neural Network with respect to the weight of an individual
		 		 layer

		weightj += alpha * delta_e * outputi
		=> weightj += alpha * dEj/dWi->j

		We descend down the gradient at a rate and not all at once hence the name gradient
		descent, we descend down the gradient using the stochastic gradient descent meaning
		each change in weight value updates the weight immedietly in each epoch.
					
	*/
	stochasticGD() {
		for (var i = 1; i < this.layers.length; ++i) {

			for (var j = 0; j < this.layers[i].length; ++j) {

				// we loop over one less weight in the array of weights for a neuron
				// thats why we have-1 is because we don't want to include the bias weight here
				// as bias needs to get multiplied by the previous input value which will always be 1
				// NOTE** - Each weight can only have connection with one single neuron, therefore
				//          a weight in the kth layer can only be attached to a neuron in jth layer
				//          a NEURON in jth layer can be connected with many weights tho in the kth layer.
				//          Also weights in a neuron for a particular layers are the weights that connect to the previous
				//          layer's neurons, don't be mislead by the arrows in the diagrams, as weights in a layer are the
				//          weights that connect themselves to the neuron in the PREVIOUS LAYER.
				for (var k = 0; k < this.layers[i][j].weights.length - 1; ++k) {

					this.layers[i][j].weights[k] += this.alpha * this.layers[i][j].deltaError * this.layers[i - 1][k].output; // again self.layers[i - 1][k].output, k because each weight is destined to have only one input 
				
				} // looping over the weights in an individual neuron ends here
			
				// bias weight always gets multiplied by 1, because the input in the previous layer is still 1, so therefore we multiply it using 1 seperately
				this.layers[i][j].weights[this.layers[i][j].weights.length - 1] += this.alpha * this.layers[i][j].deltaError * 1

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