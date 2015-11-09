import FlappySimulator = require('../flappybird/FlappySimulator');

class FlappyAdapter {
    public stateSize = 1; // Size of the state vector passed to the NN
    public numActions = 2; // Number of possible actions from the NN
    public numIterations = 10000; // Number of training samples to use before stopping (not games)
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
        var pipe = state.pipes[0];

        return {
            features: [Math.abs(pipe.x - bird.x), bird.y - pipe.y]
        };
    }

    public getReward(gameState, action, newState) {
        // Returns the reward given the game state, the action performed, and the new state
        if (newState.dead) {
            console.log('dead');
            return -1000;
        }

        return 1;
    }

    public onAction(action) {
        this.sim.onAction(action);
    }
}

export = FlappyAdapter;
