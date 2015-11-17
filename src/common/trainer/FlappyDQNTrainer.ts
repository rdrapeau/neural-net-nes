import FlappySimulator = require('../flappybird/FlappySimulator');
import FlappyAdapter = require('../adapter/FlappyAdapter');
import Trainer = require('./Trainer');

class FlappyDQNTrainer extends Trainer {
	private static FRAMES_PER_TICK = 6;

	private flappySimulator;
	private flappyAdapter;
	private frameCount;

    constructor(
        flappySimulator: FlappySimulator,
        flappyAdapter: FlappyAdapter,
        onTick: Function
    ) {
		super(onTick);
		this.frameCount = 0;
        this.flappySimulator = flappySimulator;
        this.flappyAdapter = flappyAdapter;
	}

    public loop() {
        // Always run the simulation
        if (!this.flappySimulator.isRunning()) {
            this.frameCount = 0;
            this.flappyAdapter.onGameStart();
        }

        var lastScore = this.flappySimulator.getScore();

        // Update the simulation
        this.flappySimulator.update();

        var scored = this.flappySimulator.getScore() - lastScore > 0;

        // Update the parent ticker
        this.frameCount++;

        // Update our brain if we have ticked over a threshold,
        // have died, or have scored.
        if (this.frameCount > FlappyDQNTrainer.FRAMES_PER_TICK ||
            this.flappySimulator.isDead() ||
            scored) {
            if (this.flappySimulator.isRunning()) {
                this.onTick();
            }
            this.frameCount = 0;
        }
    }
}

export = FlappyDQNTrainer;