/// <reference path="../common/def/node.d.ts"/>

var FlappySimulator = require('../common/flappybird/FlappySimulator');
var FlappyAdapter = require('../common/adapter/FlappyAdapter');
var FlappyDQNTimer = require('../common/timer/FlappyDQNTimer');
var Brain = require('../common/Brain');

var fs = require('fs');

if (process.argv.length < 4) {
	throw 'Invalid number of arguments';
}

var parameterFile = process.argv[2];
var outFile = process.argv[3];
var Parameters = require(parameterFile);

var flappySimulator = new FlappySimulator();
var flappyAdapter = new FlappyAdapter(flappySimulator, Parameters);
var brain = new Brain(flappyAdapter);

var count = 0;
var flappyDQNTimer = new FlappyDQNTimer(
	Parameters.framesPerTick,
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

var n : number = flappyAdapter.getTargetIterations();
while (brain.brain.age < n) {
	flappyDQNTimer.frame();
}

if (outFile) {
	fs.writeFile(outFile, JSON.stringify(brain.getBrainJSON()), function(err) {
	    if (err) {
	        return console.log(err);
	    }

		console.log("The Brain was saved to " + outFile);
	}); 
} else {
	console.log(JSON.stringify(brain.getBrainJSON()));
}
