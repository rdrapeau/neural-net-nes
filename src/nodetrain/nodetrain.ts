/// <reference path="../common/def/node.d.ts"/>

var FlappySimulator = require('../common/flappybird/FlappySimulator');
var FlappyAdapter = require('../common/adapter/FlappyAdapter');
var FlappyDQNTrainer = require('../common/trainer/FlappyDQNTrainer');
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
var flappyDQNTrainer = new FlappyDQNTrainer(
	flappySimulator,
	flappyAdapter,
	() => {
		brain.train();
		if (flappyDQNTrainer.getTicks() % 1000 === 0) {
			console.log("Iteration: " + flappyDQNTrainer.getTicks());
			console.log("smooth - ish reward:" + brain.brain.average_reward_window.get_average());
		}
	}
);


var n = flappyAdapter.getTargetIterations();
for (var i = 0; i < n * 12; i++) {
	flappyDQNTrainer.loop();
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
