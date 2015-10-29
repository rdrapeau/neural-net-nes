var React = require('react');

var AppComponent = React.createClass({
    getInitialState : function() {
        return {};
    },

    render : function() {
        return (
            <div id="app">
                I Am ALIVE!!
            </div>
        );
	}
});

module.exports = AppComponent;