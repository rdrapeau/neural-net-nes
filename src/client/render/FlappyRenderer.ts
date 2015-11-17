var fabric = require('fabric-browserify').fabric;

import Constants = require('../../common/flappybird/Constants');
import Bird = require('../../common/flappybird/Bird');
import Pipe = require('../../common/flappybird/Pipe');
import FlappySimulator = require('../../common/flappybird/FlappySimulator')

class FlappyRenderer {
	// pipe
	private static IMG_PIPE_BODY = 'assets/pipe.png';
	private static IMG_PIPE_TOP = 'assets/pipe-down.png';
	private static IMG_PIPE_BOTTOM = 'assets/pipe-up.png';
	private pipeBody;
	private pipeTop;
	private pipeBottom;

	// ground
	private static GROUND_WIDTH = 336;
	private static IMG_GROUND = 'assets/land.png';
	private ground;
	private groundX;

	// sky
	private static SKY_WIDTH = 276;
	private static SKY_HEIGHT = 109;
	private static IMG_SKY = 'assets/sky.png';
	private sky;

	// flappy bird
	private static IMG_BIRD = 'assets/bird.png';
	private bird;

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
		fabric.util.loadImage(FlappyRenderer.IMG_GROUND, (img) => {
			this.ground = img;
		});
		fabric.util.loadImage(FlappyRenderer.IMG_SKY, (img) => {
			this.sky = img;
		});
		fabric.util.loadImage(FlappyRenderer.IMG_BIRD, (img) => {
			this.bird = img;
		});
		this.groundX = 0;
	}

	private renderGround() {
		this.canvas.add(new fabric.Image(this.ground, {
			left: this.groundX,
			top: Constants.GAME_HEIGHT - Constants.GROUND_HEIGHT
		}));

		this.canvas.add(new fabric.Image(this.ground, {
			left: this.groundX + FlappyRenderer.GROUND_WIDTH,
			top: Constants.GAME_HEIGHT - Constants.GROUND_HEIGHT
		}));

		this.groundX -= Pipe.PIPE_SPEED;
		if (this.groundX <= -FlappyRenderer.GROUND_WIDTH) {
			this.groundX = 0;
		}
	}

	private renderSky() {
		this.canvas.add(new fabric.Image(this.sky, {
			left: 0,
			top: Constants.GAME_HEIGHT - Constants.GROUND_HEIGHT - FlappyRenderer.SKY_HEIGHT
		}));

		this.canvas.add(new fabric.Image(this.sky, {
			left: FlappyRenderer.SKY_WIDTH,
			top: Constants.GAME_HEIGHT - Constants.GROUND_HEIGHT - FlappyRenderer.SKY_HEIGHT
		}));
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
			height: (Constants.GAME_HEIGHT - (pipe.y + (Pipe.Y_GAP_WIDTH / 2))) - Constants.GROUND_HEIGHT
		}));
		// Bottom pipe (cap)
		this.canvas.add(new fabric.Image(this.pipeBottom, {
			left: pipe.x,
			top: pipe.y + (Pipe.Y_GAP_WIDTH / 2)
		}));
	}

	private renderBird(bird) {
		// Draw flappy bird
		this.canvas.add(new fabric.Image(this.bird, {
			left: bird.x,
			top: bird.y,
			width: Bird.BIRD_WIDTH,
			height: Bird.BIRD_HEIGHT * 4,
			clipTo: function(ctx) {
				ctx.rect(
					-Bird.BIRD_WIDTH / 2,
					-(Bird.BIRD_HEIGHT * 2),
					Bird.BIRD_WIDTH,
					Bird.BIRD_HEIGHT
				);
			}
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
			fill: '#4ec0ca',
			width: Constants.GAME_WIDTH,
			height: Constants.GAME_HEIGHT
		}));

		// draw sky
		this.renderSky();

		// Draw bird
		this.renderBird(state.bird);

		// Draw pipes
		for (var i = 0; i < state.pipes.length; i++) {
			this.renderPipe(state.pipes[i]);
		}

		// draw ground
		this.renderGround();
	}
}

export = FlappyRenderer;