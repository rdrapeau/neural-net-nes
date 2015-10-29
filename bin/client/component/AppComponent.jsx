var React = require('react');
var NESComponent = require('./NESComponent.jsx');

var AppComponent = React.createClass({
    getInitialState : function() {
        return {};
    },

    render : function() {
        return (
            <div id="app">
                I Am ALIVE!!
                <NESComponent />
            </div>
        );
	}
});

module.exports = AppComponent;