var convnetjs = require('../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../vendor/convnetjs/deepqlearn.js');

class Brain {

    private brain;
    private adapter;
    private remainingIterations;

    // Previous state info for calculating rewards
    private previousState;
    private previousAction;

    constructor(gameAdapter) {
        this.brain = new deepqlearn.Brain(gameAdapter.stateSize, gameAdapter.numActions);
        this.remainingIterations = gameAdapter.numIterations;
        this.adapter = gameAdapter;
        this.adapter.brain = this;
    }

    public train() {
        if (this.remainingIterations > 0) {
            this.remainingIterations--;
            var gameState = this.adapter.getGameState();
            if (!gameState) {
                // GameState is null
                return;
            }

            // Check if there is a previous state to get a reward for
            if (this.previousState && this.previousAction) {
                var reward = this.adapter.getReward(this.previousState, this.previousAction, gameState);
                this.brain.backward(reward);
            }

            // Perform the predicted action
            var action = this.brain.forward(gameState.features);
            this.adapter.onAction(action);

            // Update the previous states
            this.previousState = gameState;
            this.previousAction = action;
        } else {
            // Done training so send back our brain data
            this.adapter.onDoneTrain(this.getBrainJSON());
        }
    }

    // Called when a new game starts
    public onGameStart() {
        this.previousState = null;
        this.previousAction = null;
    }

    public test() {
        this.setupForTest();
        var gameState = this.adapter.getGameState();
        if (!gameState) {
            return;
        }

        var action = this.brain.forward(gameState.features);
        this.adapter.onAction(action);
    }

    private setupForTest() {
        this.brain.epsilon_test_time = 0.0; // Don't make any more random choices
        this.brain.learning = false;
    }

    public getBrainJSON() {
        return this.brain.value_net.toJSON();
    }

    public loadBrain(brainJSON) {
        this.brain.value_net.fromJSON(brainJSON);
    }
}

export = Brain;
