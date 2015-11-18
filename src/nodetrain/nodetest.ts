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
var inFile = process.argv[3];
var brainString = fs.readFileSync(inFile);
var Parameters = require(parameterFile);

var flappySimulator = new FlappySimulator();
var flappyAdapter = new FlappyAdapter(flappySimulator, Parameters);
var brain = new Brain(flappyAdapter);
brain.loadBrain(JSON.parse(brainString));

var maxScore = -1;
var minScore = 99999999999999;
var scoreSum = 0;
var gameCount = 0;

var flappyDQNTimer = new FlappyDQNTimer(
	Parameters.framesPerTick,
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