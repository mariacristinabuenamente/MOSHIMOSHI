var ToDoList = React.createClass({
  displayName: 'ToDoList',

  getInitialState: function getInitialState() {
    var localtodos = this.getTodos();
    return {
      todos: localtodos,
      hide_archived: false
    };
  },
  getTodos: function getTodos() {
    var todos = localStorage.getItem('todosJKqGKb');
    try {
      if (Array.isArray(JSON.parse(todos))) {
        return JSON.parse(todos);
      } else {
        return [['Buy New Monitor', true, false], ['Start Design Phase', false, true], ['Book Domain Name', true, false], ['Start Development', false, false]];
      }
    } catch (e) {
      return [['Buy New Monitor', true, false], ['Start Design Phase', false, true], ['Book Domain Name', true, false], ['Start Development', false, false]];
    }
  },
  setTodos: function setTodos() {
    localStorage.setItem('todosJKqGKb', JSON.stringify(this.state.todos));
  },
  componentDidUpdate: function componentDidUpdate() {
    this.setTodos();
  },
  handleKeyPress: function handleKeyPress(item) {
    var newtodo = new Array(item, false, false);
    this.state.todos.push(newtodo);
    this.forceUpdate();
  },
  toggle: function toggle(todoid) {
    this.state.todos[todoid][1] = !this.state.todos[todoid][1];
    this.forceUpdate();
  },
  toggleVisibility: function toggleVisibility(todoid) {
    this.state.todos[todoid][2] = !this.state.todos[todoid][2];
    this.forceUpdate();
  },
  show_hide_archived: function show_hide_archived() {
    this.setState({
      hide_archived: !this.state.hide_archived
    });
  },
  render: function render() {
    var dt = new Date();
    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        { className: 'clearfix' },
        React.createElement(
          'div',
          { className: 'date' },
          React.createElement(
            'div',
            { className: 'day' },
            dt.getDate()
          ),
          React.createElement(
            'span',
            null,
            React.createElement(
              'p',
              { className: 'month' },
              dt.toLocaleString('en-us', { month: "short" }).toUpperCase()
            ),
            React.createElement(
              'p',
              { className: 'year' },
              dt.getFullYear()
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'dayinword' },
          dt.toLocaleString('en-us', { weekday: 'long' }).toUpperCase()
        )
      ),
      React.createElement(AddNew, { addtodo: this.handleKeyPress }),
      React.createElement(List, { todos: this.state.todos, hide_archived: this.state.hide_archived, toggle: this.toggle, toggleVisibility: this.toggleVisibility, show_hide_archived: this.show_hide_archived })
    );
  }
});

var AddNew = React.createClass({
  displayName: 'AddNew',

  handleKeyPress: function handleKeyPress(evt) {
    if (evt.key == 'Enter' && this.refs.addNew.value.trim().length > 0) {
      this.props.addtodo(this.refs.addNew.value);
      this.refs.addNew.value = '';
    }
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'add-new' },
      React.createElement('input', { type: 'text', onKeyPress: this.handleKeyPress, ref: 'addNew', placeholder: 'Add New Task' })
    );
  }
});

var List = React.createClass({
  displayName: 'List',

  show_hide_archived: function show_hide_archived() {
    this.props.show_hide_archived();
  },
  toggleToDo: function toggleToDo(i) {
    this.props.toggle(i);
  },
  toggleVisibility: function toggleVisibility(i) {
    this.props.toggleVisibility(i);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: "listbox " + (this.props.hide_archived ? "hide_archived" : "") },
      this.props.todos.map(function (todo, index) {
        return React.createElement(
          'div',
          { id: "todo" + index, className: "todo clearfix " + (todo[2] ? "archived " : "") + (todo[1] ? "done" : "") },
          React.createElement('input', { className: 'visibility', onChange: this.toggleVisibility.bind(this, index), ref: 'visibility', checked: todo[2] ? "checked" : "", type: 'checkbox' }),
          React.createElement('input', { className: 'status', onChange: this.toggleToDo.bind(this, index), ref: 'todoid', id: index, checked: todo[1] ? "checked" : "", type: 'checkbox' }),
          React.createElement(
            'label',
            { htmlFor: index },
            React.createElement(
              'span',
              { className: todo[1] ? "strikethrough" : "" },
              todo
            )
          )
        );
      }, this),
      React.createElement(
        'div',
        { className: 'visibility_control' },
        React.createElement('input', { id: 'show_hide', onChange: this.show_hide_archived, checked: this.props.hide_archived ? "checked" : "", className: 'togglevisibility', type: 'checkbox' }),
        React.createElement(
          'label',
          { htmlFor: 'show_hide' },
          'Hide archived todos'
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(ToDoList, null), document.getElementById('todolist'));