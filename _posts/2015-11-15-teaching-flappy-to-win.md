---
layout: post
title:  "Teaching Flappy to Win"
date:   2015-11-15 14:44:40 -0700
---

At the end of our last post, we had managed to teach our bird to always flap. This simple goal took us quite a few hours of fiddling with the q learning and neural network parameters to realize what was causing it to fail (our state values were too large). Training the bird to beat the game is a much more complicated task that took us many more hours of experimentation. In this post we outline several failures, and a few successes. 

We started out by training our bird using the default options set by the ConvnetJS library. The properties are outlined below:
{% highlight js %}
temporal_window: 1
total_learning_steps: 100000
start_learn_threshold: 1000
learning_steps_burnin: 3000
learning_rate: 0.01
epsilon_min: 0.05
gamma: 0.8
{% endhighlight %}

We soon realized that we had a data problem. The bird wasn't getting through the first pipe often enough for it to realize that this was a good thing. The default learning steps burnin was 3000 iterations, which means the number of times it actually made it through the pipe before switching to policy actions (1 - epsilon)% of the time was very low (quite possibly zero). Because our total learning steps was only 100k, the epsilon dropped quickly and the bird was only able to learn that not flapping would cause it to die. Therefore, our bird learned to always flap to the top, and then die once it hit the first pipe. The reward model we were using was:

{% highlight js %}
dead: -100
alive: 1
{% endhighlight %}

We tried many reward models and q learning parameters that were slight variations to the ones above, with the same results each time. Flappy only wanted to flap. After a couple days of frustration, we made some breakthroughs. The first was a bug in our state representation. We had been using the absolute value of the delta x and delta y between the bird in the next pipe, but this lost information about whether the bird was below or above the pipe. Fixing this did not solve our problem.

Our next win was an optimization to the game loop. Aaron, our resident Javascript master, was able to increase training speed by an order of magnitude by running multiple iterations of the training for every event loop. This gave us the ability to train much more rapidly and increase the total_learning_steps from ~100-300k to ~1-2m. We still did not see the bird flying through pipes. 

We finally got some good learning behavior after rewarding heavily for making it through a pipe and not rewarding at all for being alive. Flying to the top and dying was no longer a good option. The video below shows the bird successfully making it through 47 pipes after being trained with the following parameters:

**Brain**
{% highlight js %}
temporal_window: 3
total_learning_steps: 1000000
start_learn_threshold: 1000
learning_steps_burnin: 50000
learning_rate: 0.01
epsilon_min: 0.05
gamma: 0.7
var layer_defs = [
    {type:'input', out_sx:1, out_sy:1, out_depth: network_size},
    {type:'fc', num_neurons: 50, activation:'relu'},
    {type:'fc', num_neurons: 50, activation:'relu'},
    {type:'regression', num_neurons:num_actions},
]
{% endhighlight %}

**State**
{% highlight js %}
state = [
    (pipe.x - bird.x) / Constants.GAME_WIDTH,
    pipe.y / Constants.GAME_HEIGHT,
    bird.y / Constants.GAME_HEIGHT,
]
{% endhighlight %}

**Reward**
{% highlight js %}
dead: -0.5
just scored: 100
alive: 0
{% endhighlight %}

<iframe width="560" height="315" src="https://www.youtube.com/embed/5U2xCNBmjB0" frameborder="0" allowfullscreen></iframe>

**Video. 1: We taught it to fly!**

The video is sped up to 8x time, because of some rendering inefficiencies.

