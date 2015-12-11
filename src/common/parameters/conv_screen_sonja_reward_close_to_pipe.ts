import Bird = require('../flappybird/Bird');
import Pipe = require('../flappybird/Pipe');
import Constants = require('../flappybird/Constants');

var width = Math.round(Constants.GAME_WIDTH * Constants.DOWN_SAMPLE_RATIO);
var height = Math.round(Constants.DOWN_SAMPLE_RATIO * (Constants.GAME_HEIGHT - Constants.GROUND_HEIGHT));
var temporal_window = 2;
export = {
   "brain": {
      "tdtrainer_options": {
         "learning_rate": 0.001,
         "momentum": 0.0,
         "batch_size": 64,
         "l2_decay": 0.01
      },
      "temporal_window": temporal_window,
      "experience_size": 30000,
      "start_learn_threshold": 25000,
      "gamma": 0.8,
      "learning_steps_total": 1000000,
      "learning_steps_burnin": 25000,
      "epsilon_min": 0.05,
      "epsilon_test_time": 0.05,
      "width": width,
      "height": height,
      "layer_defs" : [
          { type: 'input', out_sx: width, out_sy: height, out_depth: temporal_window + 1 },
          { type: 'conv', sx: 5, filters: 8, stride: 1, pad: 2, activation: 'relu' },
          { type: 'pool', sx: 2, stride: 2 },
          { type: 'conv', sx: 3, filters: 8, stride: 1, pad: 1, activation: 'relu' },
          { type: 'pool', sx: 2, stride: 2 },
          { type: 'fc', num_neurons: 20, activation: 'relu' },
          { type: 'regression', num_neurons: 2 }
      ]
   },
   "featureCount" : width * height,
   "framesPerTick" : 5,

   "features": function(state) {
       return state.screen;
   },

   "reward": function(gameState, action, newState) {
      // Returns the reward given the game state, the action performed, and the new state
      if (newState.dead) {
         // We died, punish
         return -0.2;
      } else if (newState.score - gameState.score > 0) {
         // We scored, reward
         return 100.0;
      } else {
        // reward if bird is close to pipe gap
        var xDelta = gameState.bird.x - gameState.nextPipe.x;
        var yDelta = Math.abs(gameState.bird.y - gameState.nextPipe.y);
        if (xDelta > -12 && xDelta <= 0 && yDelta < Pipe.Y_GAP_WIDTH / 2 + 12) {
          return 1.0;
        } else {
          return 0.0;
        }
      }
   }
};
