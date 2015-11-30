import Constants = require('./Constants');
import Bird = require('./Bird');
import Pipe = require('./Pipe');

class FlappySimulator {
	private started;

	private frames;

	private bird: Bird;
	private pipes: Pipe[];
	private died;
	private score;

	constructor() {
		this.reset();
	}

	public onAction(action) {
		if (action == 1) {
			// Click
			if (this.started) {
				// If we started this means jump
				this.jump();
			} else {
				// Otherwise this means start
				this.start();
			}
		}
	}

	private getNextPipeState() {
		for (var i = 0; i < this.pipes.length; i++) {
			if (this.pipes[i].x + Pipe.PIPE_WIDTH > this.bird.x) {
				return {
					x: this.pipes[i].x,
					y: this.pipes[i].y
				};
			}
		}

		return {
			x: this.pipes[0].x,
			y: this.pipes[0].y
		};
	}

	public onGetState() {
		return this.started ? {
			pipes: this.pipes.map((pipe) => {
				return { x: pipe.x, y: pipe.y };
			}),
			nextPipe: this.getNextPipeState(),
			bird: {
				x: this.bird.x,
				y: this.bird.y,
				dy: this.bird.dy
			},
			frames : this.frames,
			score : this.score,
			dead : this.died,
            screen : this.getScreenState()
		} : null;
	}

    private getScreenState() {
        // create full matrix of blank space (0)
        var screen = [];
        var downSampledWidth = Math.round(Constants.DOWN_SAMPLE_RATIO * Constants.GAME_WIDTH);
        var downSampledHeight = Math.round(Constants.DOWN_SAMPLE_RATIO * Constants.GAME_HEIGHT);
        var pixelSkip = Math.floor(1 / (Constants.DOWN_SAMPLE_RATIO));


		var halfGap = Math.floor(Pipe.Y_GAP_WIDTH / 2);
        for (var y: number = 0; y < downSampledWidth; y++) {
            screen[y] = [];
            for (var x: number = 0; x < downSampledWidth; x++) {
				var centerX = pixelSkip * x;
				var centerY = pixelSkip * y;

                // Initially set to blank
				screen[y][x] = Constants.EMPTY_SPACE;

                // Check if this pixel is in bounds of the bird
                if (centerX > this.bird.x && centerX < this.bird.x + Bird.BIRD_WIDTH &&
                	centerY > this.bird.y && centerY < this.bird.y + Bird.BIRD_HEIGHT) {
                	// Bird, set it to bird
					screen[y][x] = Constants.BIRD_SPACE;
					continue;
                }

                for (var i = 0; i < this.pipes.length; i++) {
					var pipe = this.pipes[i];
                	if (centerX > pipe.x && centerX < pipe.x + Pipe.PIPE_WIDTH &&
                		(centerY > pipe.y + halfGap || centerY < pipe.y - halfGap)) {
						screen[y][x] = Constants.PIPE_SPACE;
						break;
                	}
                }
            }
        }

        return screen;
    }

	public update() {
		if (!this.started) {
			return;
		}
		// We haven't died. Update the simulation
		if (!this.died) {
			// Update pipes
			var i = 0;
			while (i < this.pipes.length) {
				if (this.pipes[i].update()) {
					// Remove the pipe, since it went
					// off screen. We don't need to increment
					// the iteration since removing moves us
					// forwar relatively
					this.pipes.splice(i, 1);
				} else {
					// Score pipes the bird passes
					if (!this.pipes[i].scored &&
						this.pipes[i].x + Pipe.PIPE_WIDTH < this.bird.x) {
						this.score++;
						this.pipes[i].scored = true;
					}
					i++;
				}
			}

			// if the last pipe is a threshold away from the right,
			// make a new pipe
			if (this.pipes[this.pipes.length - 1].isPastNewMarker()) {
				this.addPipe();
			}

			// Update bird
			if (this.bird.update(this.pipes)) {
				// Allow one more tick of dead
				this.died = true;
			}
		} else {
			// We died, so we should reset the simulation
			this.reset();
		}
		this.frames++;
	}

	public isRunning() {
		return this.started;
	}

	public isDead() {
		return this.died;
	}

	public getScore() {
		return this.score;
	}

	private reset() {
		// Garbage collector will get the bird and pipes
		this.started = false;
		this.died = false;
		this.score = 0;
		this.bird = null;
		this.pipes = [];
		this.frames = 0;
	}

	private start() {
		this.bird = new Bird();
		this.addPipe();
		this.started = true;
	}

	private jump() {
		this.bird.jump();
	}

	private addPipe() {
		if (this.pipes.length == 0) {
			this.pipes.push(new Pipe());
		} else {
			this.pipes.push(
				new Pipe(this.pipes[this.pipes.length - 1])
			);
		}
	}
}

export = FlappySimulator;
