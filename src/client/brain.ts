
var convnetjs = require('../vendor/convnetjs/convnet-min.js');
var deepqlearn = require('../vendor/convnetjs/deepqlearn.js');

var brain = new deepqlearn.Brain(3, 2);
var state = [Math.random(), Math.random(), Math.random()];
for(var k=0;k<100;k++) {
    var action = brain.forward(state); // returns index of chosen action
    var reward = action === 0 ? 1.0 : 0.0;
    brain.backward(reward); // <-- learning magic happens here
    state[Math.floor(Math.random()*3)] += Math.random()*2-0.5;
}
brain.epsilon_test_time = 0.0; // don't make any more random choices
brain.learning = false;

// get an optimal action from the learned policy
for (var i=0; i <= 10; i++) {
	var action = brain.forward([state[0] * i/10, state[1] * i/10, state[2] * i/10]);
	console.log(action);
}


