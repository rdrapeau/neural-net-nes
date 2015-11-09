import Constants = require('./Constants');

class Pipe {
	public static PIPE_SPEED = 1.9;
	public static PIPE_WIDTH = 52;
	public static CAP_HEIGHT = 26;
	public static Y_DELTA = 300;
	public static Y_MIN = 180;
	public static X_GAP_WIDTH = 2.4 * Pipe.PIPE_WIDTH;
	public static Y_GAP_WIDTH = 120;

	public x;
	public y;

	constructor(lastPipe ?: Pipe) {
		if (lastPipe) {
			// Compute a y delta
			var yDelta = ((Math.random() * Pipe.Y_DELTA * 2.0) - Pipe.Y_DELTA);
			this.y = lastPipe.y + yDelta;

			// clamp it
			this.y = Math.min(this.y, Constants.GAME_HEIGHT - Pipe.Y_MIN);
			this.y = Math.max(this.y, Pipe.Y_MIN);
		} else {
			// first pipe
			this.y = Constants.GAME_HEIGHT / 2;
		}

		this.x = Constants.GAME_WIDTH + Pipe.PIPE_WIDTH;
	}

	// Returns true if we should remove the pipe
	public update(): boolean {
		this.x -= Pipe.PIPE_SPEED;
		return this.isExpired();
	}

	public isPastNewMarker() {
		return this.x < Constants.GAME_WIDTH - Pipe.X_GAP_WIDTH;
	}

	private isExpired() {
		return this.x < -Pipe.PIPE_WIDTH;
	}
}

export = Pipe;