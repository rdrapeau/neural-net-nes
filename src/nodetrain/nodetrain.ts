/// <reference path="../common/def/node.d.ts"/>

var FlappySimulator = require('../common/flappybird/FlappySimulator');
var FlappyAdapter = require('../common/adapter/FlappyAdapter');
var FlappyDQNTimer = require('../common/timer/FlappyDQNTimer');
var Brain = require('../common/Brain');

var fs = require('fs');

var flappySimulator = new FlappySimulator();
var flappyAdapter = new FlappyAdapter(flappySimulator);

var brain = new Brain(flappyAdapter);

if (process.argv.length < 2) {
	throw 'Invalid number of arguments';
}

var file = process.argv[2] || null;

var count = 0;
var flappyDQNTimer = new FlappyDQNTimer(
	flappySimulator,
	flappyAdapter,
	() => {
		brain.train();
		if (flappyDQNTimer.getTicks() % 1000 === 0) {
			console.log("Iteration: " + flappyDQNTimer.getTicks());
			console.log("smooth - ish reward:" + brain.brain.average_reward_window.get_average());
		}
	}
);


var n = flappyAdapter.getTargetIterations();
for (var i = 0; i < n * FlappyDQNTimer.FRAMES_PER_TICK; i++) {
	flappyDQNTimer.frame();
}

if (file) {
	fs.writeFile(file, JSON.stringify(brain.getBrainJSON()), function(err) {
	    if (err) {
	        return console.log(err);
	    }

	    console.log("The Brain was saved to " + file);
	}); 
} else {
	console.log(JSON.stringify(brain.getBrainJSON()));
}
