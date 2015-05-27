var React = require('react');
var TodoStore = require('./store');
var act = require('./actions');

function getTodoState() {
  return {
    allTodos: TodoStore.getAll()
  };
}

var TodoApp = React.createClass({

  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (<button onClick={this.chamaAct}>ClickMe</button>);
  },

  _onChange: function() {
    this.setState(getTodoState());
  },
  chamaAct: function() {
      act.create('item');

}
});
React.render(<TodoApp />, document.getElementById("app"));
