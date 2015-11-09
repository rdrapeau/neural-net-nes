var Brain = require('./Brain');

class GameAdapterTest {

    public stateSize = 1; // Size of the state vector passed to the NN
    public numActions = 2; // Number of possible actions from the NN
    public waitTime = 0; // Time in ms to wait after performing an action to get the next state
    public numIterations = 10000; // Number of training samples to use before stopping (not games)

    public onGameStart() {
        // Starts a new game
    }

    public getGameState() {
        return {
            status: true, // Dead or alive
            features: [Math.random()], // Feature for the NN
        };
    }

    public getReward(gameState, action, newState) {
        // Returns the reward given the game state, the action performed, and the new state
        return action ? 1 : -1;
    }

    public onAction(action) {
        // Use the given action in the game... etc
        return;
    }
}

function onDoneTrain() {
    console.log('Done training.');
    brain.test(onDoneTest);
}

function onDoneTest() {
    console.log('Done testing.');
}

var adapter = new GameAdapterTest();
var brain = new Brain(adapter);

brain.train(onDoneTrain);
