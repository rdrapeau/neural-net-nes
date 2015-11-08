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
        this.onStart= onStart;
        this.onTrainingEnd = onTrainingEnd;
        this.msPerFrame = 1 / frameRate * 1000;
        this.brain = new deepqlearn.Brain(5, 2);
    }

    public train() {
        this.onStart();
        this.numIterations++;
        this.update(this.onGetState());
    }

    private update(gameState) {
        console.log(gameState);
        if (gameState.status) {
            // Compute action
            var action = this.brain.forward([gameState.birdY - gameState.pipeY, gameState.pipeX]);
            this.onAction(action);

            setTimeout(() => {
                var gameState = this.onGetState();

                var reward = gameState.frames;
                if (!gameState.status) {
                    reward = -1000;
                } else if (gameState.pipeY) {
                    var distanceReward = 1.0 - Math.abs(gameState.pipeY - gameState.birdY) / 420.0;
                    reward += distanceReward;
                }

                console.log(reward);
                this.brain.backward(reward);
                this.update(gameState);
            }, this.msPerFrame * this.actionTime);
        } else if (this.numIterations < 10) {
            this.train();
        } else {
        	this.onTrainingEnd();
            // Done training
        }
    }

    public test() {
    	console.log("TEST");
    	this.brain.epsilon_test_time = 0.0; // don't make any more random choices
		this.brain.learning = false;
		this.onStart();
		var gameState = this.onGetState();
		this.performActionLoop(this.onGetState());
    }

    public performActionLoop(gameState) {
    	console.log(gameState);
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
