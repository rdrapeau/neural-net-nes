var convnetjs = require('../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../vendor/convnetjs/deepqlearn.js');

class Brain {

    private brain;
    private adapter;

    // Previous state info for calculating rewards
    private previousState;
    private previousAction;

    // Used for switching back and forth between testing and training
    private oldEpsilonTestTime;

    constructor(gameAdapter) {
        this.brain = new deepqlearn.Brain(gameAdapter.stateSize, gameAdapter.numActions);
        this.adapter = gameAdapter;
        this.adapter.brain = this;

        this.oldEpsilonTestTime = this.brain.epsilon_test_time;
    }

    public train() {
        this.setupForTrain();
        var gameState = this.adapter.getGameState();
        if (!gameState) {
            // GameState is null
            return false;
        }

        // Check if there is a previous state to get a reward for
        if (this.previousState !== null && this.previousAction !== null) {
            var reward = this.adapter.getReward(this.previousState, this.previousAction, gameState);
            //console.log("BACKWARD: " + reward);
            this.brain.backward(reward);
        }

        // Perform the predicted action
        //console.log("FORWARD: ");
        //console.log(gameState.features);
        var action = this.brain.forward(gameState.features);
        this.adapter.onAction(action);

        // Update the previous states
        this.previousState = gameState;
        this.previousAction = action;
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
            return false;
        }

        var action = this.brain.forward(gameState.features);
        this.adapter.onAction(action);
    }

    private setupForTest() {
        this.brain.epsilon_test_time = 0.0; // Don't make any more random choices
        this.brain.learning = false;
    }

    private setupForTrain() {
        this.brain.epsilon_test_time = this.oldEpsilonTestTime;
        this.brain.learning = true;
    }

    public getBrainJSON() {
        return this.brain.value_net.toJSON();
    }

    public loadBrain(brainJSON) {
        this.brain.value_net.fromJSON(brainJSON);
    }
}

export = Brain;
