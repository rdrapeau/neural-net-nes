---
layout: post
title:  "Teaching Flappy to Fly"
date:   2015-11-10 14:44:40 -0700
---

Our initial goal for the midpoint milestone was to have learning implemented on the simplest NES game we could find, which was lifeforce. However, this game has quite a lot of complexity. The action space is 5 dimensional (forward, back, up, down, shoot), and the feature space would be the pixels of the game itself. We decided to start with flappy bird, because it only has 2 possible actions and we can extract much simpler features.

We are using the deep q learning implementation in the [ConvNetJS library](http://cs.stanford.edu/people/karpathy/convnetjs/) to train our bird to fly. The ConvNetJS q learning algorithm is based off of the deep q learning with experience replay algorithm described in the paper [Playing Atari with Deep Reinforcement Learning](https://www.cs.toronto.edu/~vmnih/docs/dqn.pdf).

Training an agent to learn flappy bird sounds simple, but we faced some challenges. At first we tried to use an existing javascript implementation of flappy bird, but it was too slow and did not fit nicely with how we wanted to hook up the brain and the game. We wrote a much cleaner version of flappy bird, eliminating unnecessary frills and including an option not to render the game to speed things up during training. 

The first task was to teach the agent to always flap. We tested the deep q learning algorithm on a model that rewarded an action of 1 and penalized an action of 0, and found that the results quickly converged and the agent learned to choose an action 1 over 0. This is exactly the behavior we desired from flappy. However, when we tried to carry this reward model over to flappy bird, our average Q learning loss quickly went from a very large number to infinity, and then to NaN. We eventually determined that the cause was the large numbers in our state space. They were causing the neural network to spiral out of control. Once we normalized our state space values, our bird was able to learn.

{% include image.html name="learning" type="gif" %}
{% include image.html name="flappy-flying" type="gif" %}

Our next step is experimenting with various reward models and state inputs to teach our agent to beat flappy bird.