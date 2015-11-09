import FlappySimulator = require('../flappybird/FlappySimulator');

class FlappyAdapter {
    public stateSize = 1; // Size of the state vector passed to the NN
    public numActions = 2; // Number of possible actions from the NN
    public waitTime = 0; // Time in ms to wait after performing an action to get the next state
    public numIterations = 10000; // Number of training samples to use before stopping (not games)
    public brain = null; // a reference to the brain
    public onTrainingDone; // A function to call when the brain is done training and wants to test

    private sim: FlappySimulator;

    constructor(simulation: FlappySimulator, onTrainingDone) {
        this.sim = simulation;
        this.onTrainingDone = onTrainingDone;
    }

    public onGameStart() {
        this.sim.onAction(1);
        this.brain.onGameStart();
    }

    public getGameState() {
        return this.sim.onGetState();
    }

    public getReward(gameState, action, newState) {
        // Returns the reward given the game state, the action performed, and the new state
        return action ? 1 : -1;
    }

    public onAction(action) {
        this.sim.onAction(action);
    }

    public onDoneTrain(json) {
        console.log(JSON.stringify(json));
        this.onTrainingDone();
    }
}

export = FlappyAdapter;
