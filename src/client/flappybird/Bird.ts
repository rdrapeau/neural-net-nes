import Constants = require('./Constants');
import Pipe = require('./Pipe');

class Bird {
	public static BIRD_WIDTH = 34;
	public static BIRD_HEIGHT = 24;
	public static FLAP_ACCELERATION = 4.6;

	public x;
	public y;
	public dy;

	constructor() {
		this.dy = 0;
		this.x = Constants.GAME_WIDTH / 3 - Bird.BIRD_WIDTH / 2;
		this.y = Constants.GAME_HEIGHT / 2 - Bird.BIRD_HEIGHT / 2;
	}

	// Returns if we died or not
	public update(pipes : Pipe[]): boolean {
		this.dy += Constants.GRAVITY;
		this.y += this.dy
		this.y = Math.max(0, this.y);

		// Ground collision check
		if (this.y - Bird.BIRD_HEIGHT >
			Constants.GAME_HEIGHT - Constants.GROUND_HEIGHT - Bird.BIRD_HEIGHT) {
			return true;
		}

		// Pipe collision check
		for (var i = 0; i < pipes.length; i++) {
			var pipe = pipes[i];
			if (this.x < pipe.x + Pipe.PIPE_WIDTH && this.x + Bird.BIRD_WIDTH > pipe.x) {
				// We are within X bounds of the pipe, check out the height
				var halfGap = Pipe.Y_GAP_WIDTH / 2;
				if (
					// Check bottom pipe
					this.y + Bird.BIRD_HEIGHT > pipe.y + halfGap || 
					// Check top pipe
					this.y < pipe.y - halfGap
				) {
					// We collided with a pipe
					return true;
				}
			}
		}


		return false;
	}

	public jump() {
		this.dy = -Bird.FLAP_ACCELERATION;
	}
}

export = Bird;