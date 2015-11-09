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

            // Check if there is a previous state to get a reward for
            if (previousState || previousAction) {
                var reward = this.adapter.getReward(previousState, previousAction, gameState);
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

    public test(onDoneTest) {
        this.setupForTest();
        this.adapter.onGameStart();
        var initState = this.adapter.getGameState();
        this.testUpdate(initState, onDoneTest);
    }

    private testUpdate(gameState, onDoneTest) {
        if (gameState.status) { // Alive
            // Perform the predicted action
            var action = this.brain.forward(gameState.features);
            this.adapter.onAction(action);

            setTimeout(() => {
                // Get the state from performing the action and update again
                var newState = this.adapter.getGameState();
                this.testUpdate(newState, onDoneTest);
            }, this.adapter.waitTime);
        } else { // Dead - Game is over
            onDoneTest();
        }
    }

    private setupForTest() {
        this.brain.epsilon_test_time = 0.0; // Don't make any more random choices
        this.brain.learning = false;
    }

    public getBrainJSON() {
        return this.brain.value_net.toJSON());
    }
}

export = Brain;
