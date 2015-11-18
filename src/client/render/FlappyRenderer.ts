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

	// score
	private static SCORE_WIDTH = 24;
	private static SCORE_HEIGHT = 36;
	private static DIGIT_GAP = 2;
	private static SCORE_0 = 'assets/font_big_0.png';
	private static SCORE_1 = 'assets/font_big_1.png';
	private static SCORE_2 = 'assets/font_big_2.png';
	private static SCORE_3 = 'assets/font_big_3.png';
	private static SCORE_4 = 'assets/font_big_4.png';
	private static SCORE_5 = 'assets/font_big_5.png';
	private static SCORE_6 = 'assets/font_big_6.png';
	private static SCORE_7 = 'assets/font_big_7.png';
	private static SCORE_8 = 'assets/font_big_8.png';
	private static SCORE_9 = 'assets/font_big_9.png';
	private score_digits = [];
	private digits;  // keep track of how many digits we have for placement

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
		// for some reason it doesn't like it when I load this in a loop
		fabric.util.loadImage(FlappyRenderer.SCORE_0, (img) => {
			this.score_digits[0] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_1, (img) => {
			this.score_digits[1] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_2, (img) => {
			this.score_digits[2] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_3, (img) => {
			this.score_digits[3] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_4, (img) => {
			this.score_digits[4] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_5, (img) => {
			this.score_digits[5] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_6, (img) => {
			this.score_digits[6] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_7, (img) => {
			this.score_digits[7] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_8, (img) => {
			this.score_digits[8] = img;
		});
		fabric.util.loadImage(FlappyRenderer.SCORE_9, (img) => {
			this.score_digits[9] = img;
		});
		this.digits = 1;
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

	private renderScore(score) {
		var digits_seen = 0;
		while (score >= 1) {
			var digit_width = FlappyRenderer.SCORE_WIDTH * this.digits + FlappyRenderer.DIGIT_GAP * (this.digits - 1);
			var right = Constants.GAME_WIDTH / 2 + digit_width / 2;
			this.canvas.add(new fabric.Image(this.score_digits[score % 10], {
				left: right - FlappyRenderer.SCORE_WIDTH - digits_seen * (FlappyRenderer.SCORE_WIDTH + FlappyRenderer.DIGIT_GAP),
				top: Constants.GAME_HEIGHT / 2 - FlappyRenderer.SCORE_HEIGHT / 2,
			}));
			digits_seen++;
			score = Math.floor(score / 10);
		}
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

		// draw score
		var score = Math.round(state.score);
		if (Math.floor(score / Math.pow(10, this.digits)) > 0) {
			this.digits++;
		}
		this.renderScore(Math.round(score));
	}
}

export = FlappyRenderer;