var React = require('react');

var InfoComponent = React.createClass({
    brainDump : function() {
        if (this.props.brain == null) {
            return null;
        } else {
            var brain = this.props.brain.brain;
            return (
                <div>
                    <div>Exploration Epsilon: {brain.epsilon}</div>
                    <div>Experience Replay Size: {brain.experience.length}</div>
                    <div>Age: {brain.age}</div>
                    <div>Average Q-learning loss: {brain.average_loss_window.get_average()}</div>
                    <div>smooth-ish reward: {brain.average_reward_window.get_average()}</div>
                </div>
            );
        }
    },

    printBrain : function() {
        if (this.props.brain) {
            console.log(
                JSON.stringify(this.props.brain.getBrainJSON()
            ));
        }
    },

    render : function() {
        return (
            <div ref="vis">
                <button onClick={this.printBrain}>Print Brain</button>
                <div>Training Iterations: {this.props.trainTickCount}</div>
                {this.brainDump()}
            </div>
        );
	}
});

module.exports = InfoComponent;
