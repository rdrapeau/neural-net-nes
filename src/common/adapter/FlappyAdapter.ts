var convnetjs = require('../../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../../vendor/convnetjs/deepqlearn.js');

import Brain = require('../Brain');
import FlappySimulator = require('../flappybird/FlappySimulator');

import Bird = require('../flappybird/Bird');
import Constants = require('../flappybird/Constants');

class FlappyAdapter {
    public stateSize = 2; // Size of the state vector passed to the NN
    public numActions = 2; // Number of possible actions from the NN
    public brain : Brain = null; // a reference to the brain
    public brainInstance = null; // a reference to the convnet brain
    public totalIterations = 1000000;

    private sim: FlappySimulator;

    constructor(simulation: FlappySimulator) {
        this.sim = simulation;
    }

    public getBrainInstance() {
        if (this.brainInstance) {
            return this.brainInstance;
        }

        var tdtrainer_options = { learning_rate: 0.001, momentum: 0.0, batch_size: 64, l2_decay: 0.01 };
        var opt: any = {};
        opt.temporal_window = 10;
        opt.experience_size = 15000;
        opt.start_learn_threshold = 25000;
        opt.gamma = 0.8;
        opt.learning_steps_total = this.totalIterations;
        opt.learning_steps_burnin = 15000;
        opt.epsilon_min = 0.05;
        opt.epsilon_test_time = 0.05;
        opt.hidden_layer_sizes = [35, 35];
        opt.tdtrainer_options = tdtrainer_options;

        this.brainInstance = new deepqlearn.Brain(this.stateSize, this.numActions, opt);

        return this.brainInstance;
    }

    public getTargetIterations() {
        return this.totalIterations;
    }

    public onGameStart() {
        this.sim.onAction(1);
        this.brain.onGameStart();
    }

    public getGameState() {
        var state = this.sim.onGetState();
        var bird = state.bird;
        var pipe = state.nextPipe;
        state['features'] = [
            Math.abs(pipe.x - bird.x) / Constants.GAME_WIDTH,
            (bird.y - (Bird.BIRD_HEIGHT / 2) - pipe.y) / Constants.GAME_HEIGHT
        ];

        return state;
    }

    public getReward(gameState, action, newState) {
        // Returns the reward given the game state, the action performed, and the new state
        if (newState.dead) {
            // We died, punish
            return -0.2;
        } else if (newState.score - gameState.score > 0) {
            // We scored, reward
            return 100.0;
        }

        return 0.0;
    }

    public onAction(action) {
        this.sim.onAction(action);
    }
}

export = FlappyAdapter;
