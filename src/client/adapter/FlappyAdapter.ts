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
        // return this.sim.onGetState();
        return {
            features: [1]
        };
    }

    public getReward(gameState, action, newState) {
        console.log(action);
        // Returns the reward given the game state, the action performed, and the new state
        return action ? 1 : -1;
    }

    public onAction(action) {
        this.sim.onAction(action);
    }
}

export = FlappyAdapter;
