var convnetjs = require('../../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../../vendor/convnetjs/deepqlearn.js');

import Brain = require('../Brain');
import FlappySimulator = require('../flappybird/FlappySimulator');

import Bird = require('../flappybird/Bird');
import Constants = require('../flappybird/Constants');

class FlappyAdapter {
    public brain : Brain = null; // a reference to the brain
    public convNetInstance = null; // a reference to the convnet brain

    private parameters;
    private sim: FlappySimulator;

    constructor(simulation: FlappySimulator, parameters) {
        this.sim = simulation;
        this.parameters = parameters;
    }

    public getBrainInstance() {
        if (this.convNetInstance) {
            return this.convNetInstance;
        }

        this.convNetInstance = new deepqlearn.Brain(
            this.parameters.featureCount,
            2,
            this.parameters.brain
        );

        return this.convNetInstance;
    }

    public getTargetIterations() {
        return this.parameters.brain.learning_steps_total;
    }

    public onGameStart() {
        this.sim.onAction(1);
        this.brain.onGameStart();
    }

    public getGameState() {
        var state = this.sim.onGetState();
        state['features'] = this.parameters.features(state);
        return state;
    }

    public getReward(gameState, action, newState) {
        return this.parameters.reward(gameState, action, newState);
    }

    public onAction(action) {
        this.sim.onAction(action);
    }
}

export = FlappyAdapter;
