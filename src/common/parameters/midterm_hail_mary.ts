import Bird = require('../flappybird/Bird');
import Constants = require('../flappybird/Constants');

export = {
   "brain": {
      "tdtrainer_options": {
         "learning_rate": 0.001,
         "momentum": 0.0,
         "batch_size": 64,
         "l2_decay": 0.01
      },
      "temporal_window": 0,
      "experience_size": 20000,
      "start_learn_threshold": 10000,
      "gamma": 0.8,
      "learning_steps_total": 1000000,
      "learning_steps_burnin": 20000,
      "epsilon_min": 0.05,
      "epsilon_test_time": 0.05,
      "hidden_layer_sizes": [30, 30]
   },
   "featureCount" : 2,
   "framesPerTick" : 6,

   "features": function(state) {
      var bird = state.bird;
      var pipe = state.nextPipe;

      return [
         Math.abs(pipe.x - bird.x) / Constants.GAME_WIDTH,
         (bird.y - (Bird.BIRD_HEIGHT / 2) - pipe.y) / Constants.GAME_HEIGHT,
         bird.dy / Constants.GAME_HEIGHT
      ];
   },

   "reward": function(gameState, action, newState) {
      // Returns the reward given the game state, the action performed, and the new state
      if (newState.dead) {
         // We died, punish
         return -0.2;
      } else if (newState.score - gameState.score > 0) {
         // We scored, reward
         return 100.0;
      }

      return 0.0;
   }
};
