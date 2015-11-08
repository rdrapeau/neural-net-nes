var convnetjs = require('../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../vendor/convnetjs/deepqlearn.js');
var game = require('../vendor/flappy/main.js');

class FlappyBrain {

    private onAction;
    private onGetState;
    private onStart;
    private onTrainingEnd;
    private brain;
    private msPerFrame;
    private actionTime = 18.2;
    private numIterations = 0;

    constructor(onAction, onGetState, onStart, onTrainingEnd, frameRate) {
        this.onAction = onAction;
        this.onGetState = onGetState;
        this.onStart = onStart;
        this.onTrainingEnd = onTrainingEnd;
        this.msPerFrame = 1.0 / frameRate * 1000.0;
        var num_inputs = 4;  // alive or dead (status), birdX, birdY, pipeY
        var num_actions = 2;  // flap or don't flap
        var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
		var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;

		// the value function network computes a value of taking any of the possible actions
		// given an input state. Here we specify one explicitly the hard way
		// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
		// to just insert simple relu hidden layers.
		var layer_defs = [];
		layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
		layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
		layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
		layer_defs.push({type:'regression', num_neurons:num_actions});

		// options for the Temporal Difference learner that trains the above net
		// by backpropping the temporal difference learning rule.
		var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};

		var opt = {
			temporal_window : temporal_window,
			experience_size : 3000,  //corresponds to the max brain.experience.length can be
			start_learn_threshold : 200,
			gamma : 1.0, // ???
			learning_steps_total : 1000,
			learning_steps_burnin : 100,
			epsilon_min : 0.0, // purely deterministic by end
			epsilon_test_time : 0.0, // purely determinisitic during test
			layer_defs : layer_defs,
			tdtrainer_options : tdtrainer_options
		};
        this.brain = new deepqlearn.Brain(num_inputs, num_actions, opt);
    }

    public train() {
        this.onStart()
        this.numIterations++;
        console.log('Iteration:' + this.numIterations);
        this.update(this.onGetState());
    }

    private update(gameState) {
    	console.log(gameState);
        if (gameState !== null) {
            // Compute action
            var action = this.brain.forward([gameState.status, gameState.birdY, gameState.pipeY, gameState.pipeX]);
            this.onAction(action);
            setTimeout(() => {
                var gameState = this.onGetState();
                var reward = action ? 1 : 0;
                this.brain.backward(reward);
                this.update(gameState);
            }, this.msPerFrame * this.actionTime);
        } else if (this.numIterations < 100) {
            this.train();
        } else {
        	// this.onTrainingEnd();
            // Done training
        }
    }

    public test() {
    	this.brain.epsilon_test_time = 0.0; // don't make any more random choices
		this.brain.learning = false;
		this.onStart();
		this.performActionLoop(this.onGetState());
    }

    public performActionLoop(gameState) {
    	var action = this.brain.forward(gameState);
    	console.log(action);
		this.onAction(action);
		if (gameState.status) {
	    	setTimeout(() => {
	            var gameState = this.onGetState();
	            this.performActionLoop(gameState);
	        }, this.msPerFrame * this.actionTime);
    	}
    }

    public saveBrain() {
        localStorage.setItem('trained_brain', JSON.stringify(this.brain.value_net.toJSON()));
    }
}

export = FlappyBrain;
