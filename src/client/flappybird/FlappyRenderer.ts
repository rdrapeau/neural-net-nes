var fabric = require('fabric-browserify').fabric;

import Constants = require('./Constants');
import Bird = require('./Bird');
import Pipe = require('./Pipe');
import FlappySimulator = require('./FlappySimulator')

class FlappyRenderer {
	private sim: FlappySimulator;

	private canvas;

	constructor(simulator : FlappySimulator, domId: string) {
		this.sim = simulator;


		// Construct canvas in dom element
		this.canvas = new fabric.Canvas(domId);
	}

	public render() {
		// Clear the canvas
		this.canvas.clear();

		var state = this.sim.onGetState();
		// Not started, no reason to render
		if (!state) return;

		// Draw flappy bird
		this.canvas.add(new fabric.Rect({
			left: state.bird.x,
			top: state.bird.y,
			fill: 'red',
			width: Bird.BIRD_WIDTH,
			height: Bird.BIRD_HEIGHT
		}));

		// Draw pipes
		for (var i = 0; i < state.pipes.length; i++) {
			var pipe = state.pipes[i];

			// Top pipe
			this.canvas.add(new fabric.Rect({
				left: pipe.x,
				top: 0,
				fill: 'green',
				width: Pipe.PIPE_WIDTH,
				height: pipe.y - (Pipe.Y_GAP_WIDTH / 2)
			}));

			// Bottom pipe
			this.canvas.add(new fabric.Rect({
				left: pipe.x,
				top: pipe.y + (Pipe.Y_GAP_WIDTH / 2),
				fill: 'green',
				width: Pipe.PIPE_WIDTH,
				height: Constants.GAME_HEIGHT - (pipe.y - (Pipe.Y_GAP_WIDTH / 2))
			}));
		}
	}
}

export = FlappyRenderer;