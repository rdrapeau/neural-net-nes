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
        this.brain = new deepqlearn.Brain(5, 2);
    }

    public train() {
        this.onStart()
        this.numIterations++;
        console.log('Iteration:' + this.numIterations);
        this.update(this.onGetState());
    }

    private update(gameState) {
        console.log(gameState);
        if (gameState.status) {
            // Compute action
            var action = this.brain.forward([gameState.birdY]);
            this.onAction(action);

            setTimeout(() => {
                var gameState = this.onGetState();

                // Compute the reward
                var reward = 1 - gameState.birdY / 420.0;
                console.log('Reward:' + reward);

                this.brain.backward(reward);
                this.update(gameState);
            }, this.msPerFrame * this.actionTime);
        } else if (this.numIterations < 10000) {
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
		var gameState = this.onGetState();
		this.performActionLoop(this.onGetState());
    }

    public performActionLoop(gameState) {
    	var action = this.brain.forward(gameState);
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
