var React = require('react');
var NESComponent = require('./NESComponent.jsx');
var FlappyBirdComponent = require('./FlappyBirdComponent.jsx');

var AppComponent = React.createClass({
    getInitialState : function() {
        return {};
    },

    onLoadNESGame : function(nesComponent) {
        console.log(nesComponent);
    },

    onLoadFlappyGame : function(nesComponent) {
        console.log(nesComponent);
    },

    render : function() {
        // <NESComponent onLoaded={this.onLoadNESGame} />
        return (
            <div id="app">
                <FlappyBirdComponent stateUpdateRate={60} />
            </div>
        );
	}
});

module.exports = AppComponent;