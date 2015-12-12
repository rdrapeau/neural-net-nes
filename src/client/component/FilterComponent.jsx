var React = require('react');
var Brain = require('../../common/Brain');
var cnnutil = require('../../vendor/convnetjs/util');

var SCALE = 4;

var FilterComponent = React.createClass({

  update: function(context) {
    context.save();
    var maxmin = cnnutil.maxmin;
    var filter = this.props.filter;
    var w = filter.w;
    var mm = maxmin(w);
    var width = filter.sx * SCALE;
    var height = filter.sy * SCALE;
    var g = context.createImageData(width, height);
    for(var x = 0; x < filter.sx; x++) {
      for(var y = 0; y < filter.sy; y++) {
        var dval = Math.floor((filter.get(x,y,1) - mm.minv) / mm.dv * 255);  
        for(var dx = 0; dx < SCALE; dx++) {
          for(var dy = 0; dy < SCALE; dy++) { 
            var pp = ((width * (y * SCALE + dy)) + (dx + x * SCALE)) * 4;
            for(var i = 0; i < 3; i++) { 
              g.data[pp + i] = dval; 
            } // rgb
            g.data[pp+3] = 255; // alpha channel
          }
        }
      }
    }
    context.putImageData(g, 0, 0);
    context.restore();
  },

  render : function() {
    return <canvas width={this.props.filter.sx * SCALE + 4} height={this.props.filter.sy * SCALE + 4} />;
  },

  componentDidMount: function() {
    var context = this.getDOMNode().getContext('2d');
    this.update(context);
  },

  componentDidUpdate: function() {
    var context = this.getDOMNode().getContext('2d');
    context.clearRect(0, 0, this.props.filter.sx * SCALE, this.props.filter.sy * SCALE);
    this.update(context);
  },
});

module.exports = FilterComponent;
