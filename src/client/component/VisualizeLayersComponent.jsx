var React = require('react');
var Brain = require('../../common/Brain');
var ActivationComponent = require('../../client/component/ActivationComponent.jsx');

var VisualizeLayersComponent = React.createClass({

  render : function() {
    var brain = this.props.brain ? this.props.brain.brain : null;
    if (brain) {
      return (
        <div ref="visnet">
            {this.visualize_activations(brain.value_net)}
        </div>
      );
    } else {
      return (
        <div>No Data</div>
      );
    }
  },

  visualize_activations: function(net) {
    if (!net) {
      return;
    }
    var layers = [];
    for (var i=0; i < net.layers.length; i++) {
      layers.push(<ActivationComponent layer={net.layers[i]} key={i}/>);
    }
    return <div>{layers}</div>;
  },
});
module.exports = VisualizeLayersComponent;
