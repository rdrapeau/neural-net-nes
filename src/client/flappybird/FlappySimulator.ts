import Bird = require('./Bird');
import Pipe = require('./Pipe');

class FlappySimulator {
	private started;

	private frames;

	private bird: Bird;
	private pipes: Pipe[];

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

	public onGetState() {
		return this.started ? {
			pipes: this.pipes.map((pipe) => {
				return { x: pipe.x, y: pipe.y };
			}),
			bird: {
				x: this.bird.x,
				y: this.bird.y,
				dy: this.bird.dy
			},
			frames : this.frames
		} : null;
	}

	public update() {
		if (this.started) {
			// Update pipes
			var i = 0;
			while (i < this.pipes.length) {
				if (this.pipes[i].update()) {
					// Remove the pipe
					this.pipes.splice(i, 1);
				} else {
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
				this.reset();
			}

			this.frames++;
		}
	}

	public isRunning() {
		return this.started;
	}

	private reset() {
		// Garbage collector will get the bird and pipes
		this.started = false;
		this.bird = null;
		this.pipes = [];
		this.frames = 0;
	}

	private start() {
		console.log('Game started');
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