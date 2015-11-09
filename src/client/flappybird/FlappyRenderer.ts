var fabric = require('fabric-browserify').fabric;

import Constants = require('./Constants');
import Bird = require('./Bird');
import Pipe = require('./Pipe');
import FlappySimulator = require('./FlappySimulator')

class FlappyRenderer {
	// pipe
	private static IMG_PIPE_BODY = 'assets/pipe.png';
	private static IMG_PIPE_TOP = 'assets/pipe-down.png';
	private static IMG_PIPE_BOTTOM = 'assets/pipe-up.png';
	private pipeBody;
	private pipeTop;
	private pipeBottom;

	private sim: FlappySimulator;

	private canvas;

	constructor(simulator : FlappySimulator, domId: string) {
		this.sim = simulator;


		// Construct canvas in dom element
		this.canvas = new fabric.Canvas(domId);

		// Load media
		fabric.util.loadImage(FlappyRenderer.IMG_PIPE_BODY, (img) => {
			this.pipeBody = new fabric.Pattern({
				source: img,
				repeat: 'repeat-y'
			});
		});
		fabric.util.loadImage(FlappyRenderer.IMG_PIPE_TOP, (img) => {
			this.pipeTop = img;
		});
		fabric.util.loadImage(FlappyRenderer.IMG_PIPE_BOTTOM, (img) => {
			this.pipeBottom = img;
		});
	}

	private renderPipe(pipe) {
		// Top pipe (fill)
		this.canvas.add(new fabric.Rect({
			left: pipe.x,
			top: 0,
			fill: this.pipeBody,
			width: Pipe.PIPE_WIDTH,
			height: pipe.y - (Pipe.Y_GAP_WIDTH / 2)
		}));
		// Top pipe (cap)
		this.canvas.add(new fabric.Image(this.pipeTop, {
			left: pipe.x,
			top: pipe.y - (Pipe.Y_GAP_WIDTH / 2) - Pipe.CAP_HEIGHT
		}));

		// Bottom pipe (fill)
		this.canvas.add(new fabric.Rect({
			left: pipe.x,
			top: pipe.y + (Pipe.Y_GAP_WIDTH / 2),
			fill: this.pipeBody,
			width: Pipe.PIPE_WIDTH,
			height: Constants.GAME_HEIGHT - (pipe.y - (Pipe.Y_GAP_WIDTH / 2))
		}));
		// Bottom pipe (cap)
		this.canvas.add(new fabric.Image(this.pipeBottom, {
			left: pipe.x,
			top: pipe.y + (Pipe.Y_GAP_WIDTH / 2)
		}));
	}

	private renderBird(bird) {
		// Draw flappy bird
		this.canvas.add(new fabric.Rect({
			left: bird.x,
			top: bird.y,
			fill: 'red',
			width: Bird.BIRD_WIDTH,
			height: Bird.BIRD_HEIGHT
		}));
	}

	public render() {
		// Clear the canvas
		this.canvas.clear();

		var state = this.sim.onGetState();
		// Not started, no reason to render
		if (!state) return;

		// draw background
		this.canvas.add(new fabric.Rect({
			left: 0,
			top: 0,
			fill: 'cyan',
			width: Constants.GAME_WIDTH,
			height: Constants.GAME_HEIGHT
		}));

		// Draw bird
		this.renderBird(state.bird);

		// Draw pipes
		for (var i = 0; i < state.pipes.length; i++) {
			this.renderPipe(state.pipes[i]);
		}
	}
}

export = FlappyRenderer;