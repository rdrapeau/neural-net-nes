var React = require('react');
var Brain = require('../../common/Brain');
var FilterComponent = require('./FilterComponent.jsx');

var LayerComponent = React.createClass({

  render : function() {
    var layer = this.props.layer;
    var filters = this.getFilters(layer);
    return (
      <div>
        <span>Type: {layer.layer_type}    </span>
        <span>out_sx: {layer.out_sx}    </span>
        <span>out_sy: {layer.out_sy}    </span>
        <span>out_depth: {layer.out_depth}</span>
        {filters}
      </div>
    );
  },

  getFilters : function(layer) {
    if (layer.layer_type != 'conv') {
      return null;
    }
    var filters = [];
    for (var i = 0; i < layer.filters.length; i++) {
      filters.push(<FilterComponent filter={layer.filters[i]} key={i} />);
    }
    return <div>{filters}</div>;
  }
});
module.exports = LayerComponent;
