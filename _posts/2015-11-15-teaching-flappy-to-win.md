---
layout: post
title:  "Teaching Flappy to Win"
date:   2015-11-15 14:44:40 -0700
---

At the end of our last post, we had managed to teach our bird to always flap. This simple goal took us quite a few hours of fiddling with the q learning and neural network parameters to realize what was causing it to fail. Training the bird to beat the game is a much more complicated task took us many more hours of experimentation. 

First we were trying with a training period that was too small.

Optimized the game for 10x gain in performance.

Bird was learning to flap no matter what.

We found a bug where we were giving it the abs. value of the distance to the pipe (both horizontal and vertical)

Finally got some good learning behavior after rewarding heavily for making it through a pipe.
<iframe width="560" height="315" src="https://www.youtube.com/embed/5U2xCNBmjB0" frameborder="0" allowfullscreen></iframe>

**Video. 1: We taught it to fly!**  

