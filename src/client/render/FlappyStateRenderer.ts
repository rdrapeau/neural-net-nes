import Constants = require('../../common/flappybird/Constants');
import FlappySimulator = require('../../common/flappybird/FlappySimulator')

class FlappyStateRenderer {
	private sim: FlappySimulator;

	private ctx;  // 2d canvas context
	private imgData;
	private width;
	private height;

	constructor(simulator: FlappySimulator, domId: string) {
		this.sim = simulator;

		// Construct canvas in dom element
		var canvasElem = <HTMLCanvasElement> document.getElementById(domId);
		this.width = Math.round(Constants.GAME_WIDTH * Constants.DOWN_SAMPLE_RATIO);
		this.height = Math.round((Constants.GAME_HEIGHT - Constants.GROUND_HEIGHT) * Constants.DOWN_SAMPLE_RATIO);
		canvasElem.width = this.width;
		canvasElem.height = this.height;

		this.ctx = canvasElem.getContext('2d');
		this.imgData = this.ctx.createImageData(this.width, this.height); // width x height
	}

	public renderState() {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.width, this.height);

		var state = this.sim.onGetState();
		
		// Not started, no reason to render
		if (!state) return;

		// convert the game state screen to ImageData
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				this.imgData.data[(y * (this.width) + x) * 4] = 300 - state.screen[y][x] * 200;
				this.imgData.data[(y * (this.width) + x) * 4 + 1] = 300 - state.screen[y][x] * 200;
				this.imgData.data[(y * (this.width) + x) * 4 + 2] = 300 - state.screen[y][x] * 200;
				this.imgData.data[(y * (this.width) + x) * 4 + 3] = 255; // opacity
			}
		}
		// now we can draw our imagedata onto the canvas
		this.ctx.putImageData(this.imgData, 0, 0);
	}
}

export = FlappyStateRenderer;