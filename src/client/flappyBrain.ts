var convnetjs = require('../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../vendor/convnetjs/deepqlearn.js');
var game = require('../vendor/flappy/main.js');

// brain.epsilon_test_time = 0.0; // don't make any more random choices
// brain.learning = false;

class FlappyBrain {

    private onAction;
    private onGetState;
    private onStart;
    private brain;
    private numIterations = 0;

    constructor(onAction, onGetState, onStart) {
        this.onAction = onAction;
        this.onGetState = onGetState;
        this.onStart= onStart;
        this.brain = new deepqlearn.Brain(5, 2);
    }

    public train() {
        this.onStart()
        this.numIterations++;
        this.update(this.onGetState());
    }

    private update(gameState) {
        if (gameState.status) {
            // Compute action
            var action = this.brain.forward(gameState.data);
            this.onAction(action);

            setTimeout(() => {
                var gameState = this.onGetState();

                // Compute the reward
                var reward = 0;

                this.brain.backward(reward);
                this.update(gameState);
            }, 300);
        } else if (this.numIterations < 10) {
            this.train();
        }
    }

    public test() {

    }

    private saveBrain() {
        localStorage.setItem('trained_brain', JSON.stringify(this.brain.value_net.toJSON()));
    }
}
