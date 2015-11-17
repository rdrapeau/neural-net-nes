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

console.log('Loading ' + file);
var brainString = fs.readFileSync(file);
brain.loadBrain(JSON.parse(brainString));
console.log('Loaded');

var maxScore = -1;
var minScore = 99999999999999;
var scoreSum = 0;
var gameCount = 0;

var flappyDQNTimer = new FlappyDQNTimer(
	flappySimulator,
	flappyAdapter,
	() => {
		brain.test();
	},
	() => {
		var score = flappySimulator.getScore();
		scoreSum += score;
		maxScore = Math.max(maxScore, score);
		minScore = Math.min(minScore, score);
		gameCount++;
	}
);

var n : number = Math.round(flappyAdapter.getTargetIterations() / 2.0);
console.log('Running tests for ' + n + ' iterations...');
for (var i = 0; i < n; i++) {
	flappyDQNTimer.frame();
}

var avgScore = scoreSum / gameCount;

// Print results
console.log('Number of games played: ' + gameCount);
console.log('Max Score: ' + maxScore);
console.log('Min Score: ' + minScore);
console.log('Avg Score: ' + avgScore);