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
        // options for the Temporal Difference learner that trains the above net
        // by backpropping the temporal difference learning rule.
        var tdtrainer_options = { learning_rate: 0.001, momentum: 0.0, batch_size: 64, l2_decay: 0.01 };
        var opt : any = {};
        opt.temporal_window = 10;
        opt.experience_size = 15000;
        opt.start_learn_threshold = 5000;
        opt.gamma = 0.8;
        opt.learning_steps_total = 450000;
        opt.learning_steps_burnin = 15000;
        opt.epsilon_min = 0.05;
        opt.epsilon_test_time = 0.05;
        opt.hidden_layer_sizes = [15, 15];
        opt.tdtrainer_options = tdtrainer_options;

        this.brain = new deepqlearn.Brain(gameAdapter.stateSize, gameAdapter.numActions, opt);
        this.adapter = gameAdapter;
        this.adapter.brain = this;

        this.oldEpsilonTestTime = this.brain.epsilon_test_time;
    }

    public train() {
        this.setupForTrain();
        var gameState = this.adapter.getGameState();
        if (gameState === null) {
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
