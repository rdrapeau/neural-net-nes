var convnetjs = require('../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../vendor/convnetjs/deepqlearn.js');

class Brain {

    private brain;
    private adapter;
    private remainingIterations;

    constructor(gameAdapter) {
        this.brain = new deepqlearn.Brain(gameAdapter.stateSize, gameAdapter.numActions);
        this.remainingIterations = gameAdapter.numIterations;
        this.adapter = gameAdapter;
    }

    public train(onDoneTrain) {
        this.adapter.onGameStart();
        var initState = this.adapter.getGameState();
        this.trainUpdate(initState, onDoneTrain);
    }

    private trainUpdate(gameState, onDoneTrain) {
        if (gameState.status) { // Alive
            // Get and perform action
            var action = this.brain.forward(gameState.features);
            this.adapter.onAction(action);
            this.remainingIterations--;

            // Loop with the game time (adapter.waitTime)
            setTimeout(() => {
                // Grab the new state and the reward
                var newState = this.adapter.getGameState();
                var reward = this.adapter.getReward(gameState, action, newState);

                // Train the NN on this reward
                this.brain.backward(reward);

                // Loop back with our new state
                this.trainUpdate(newState, onDoneTrain);
            }, this.adapter.waitTime);
        } else if (this.remainingIterations > 0) { // Dead and keep training
            this.train(onDoneTrain);
        } else { // Done training
            onDoneTrain();
        }
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
}

export = Brain;
