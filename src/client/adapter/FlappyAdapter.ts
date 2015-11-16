import FlappySimulator = require('../flappybird/FlappySimulator');

import Bird = require('../flappybird/Bird');
import Constants = require('../flappybird/Constants');

class FlappyAdapter {
    public stateSize = 4; // Size of the state vector passed to the NN
    public numActions = 2; // Number of possible actions from the NN
    public brain = null; // a reference to the brain

    private sim: FlappySimulator;

    constructor(simulation: FlappySimulator) {
        this.sim = simulation;
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
            (bird.y - (Bird.BIRD_HEIGHT / 2) - pipe.y) / Constants.GAME_HEIGHT,
            bird.y / Constants.GAME_HEIGHT,
            bird.dy / Constants.GAME_HEIGHT
        ];

        return state;
    }

    public getReward(gameState, action, newState) {
        // Returns the reward given the game state, the action performed, and the new state
        if (newState.dead) {
            // We died, punish
            return -0.2;
        } else if (newState.score - gameState.score > 0) {
            console.log("SCORE!");
            // We scored, reward
            return 1000.0;
        }

        return 0.0;
    }

    public onAction(action) {
        this.sim.onAction(action);
    }
}

export = FlappyAdapter;
