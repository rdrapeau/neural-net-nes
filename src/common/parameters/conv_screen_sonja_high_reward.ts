import Bird = require('../flappybird/Bird');
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
      "experience_size": 20000,
      "start_learn_threshold": 20000,
      "gamma": 0.8,
      "learning_steps_total": 1000000,
      "learning_steps_burnin": 25000,
      "epsilon_min": 0.05,
      "epsilon_test_time": 0.5,
      "width": width,
      "height": height,
      "layer_defs" : [
          { type: 'input', out_sx: width, out_sy: height, out_depth: temporal_window + 1 },
          { type: 'conv', sx: 9, filters: 16, stride: 4, pad: 4, activation: 'relu' },
          { type: 'pool', sx: 2, stride: 2 },
          { type: 'conv', sx: 5, filters: 8, stride: 2, pad: 2, activation: 'relu' },
          { type: 'pool', sx: 4, stride: 4 },
          { type: 'conv', sx: 5, filters: 8, stride: 2, pad: 2, activation: 'relu' },
          { type: 'pool', sx: 4, stride: 4 },
          { type: 'fc', num_neurons: 20, activation: 'relu' },
          { type: 'regression', num_neurons: 2 }
      ]
   },
   "featureCount" : 1840,
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
         return 500.0;
      }

      return 0.0;
   }
};
