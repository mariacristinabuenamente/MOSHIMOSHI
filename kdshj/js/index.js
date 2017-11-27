"use strict";

//add jquery
$(document).ready(function () {
  //listen to slider
  function getNum(n) {
    return parseInt(n);
  }
  $("#slider").on("click", function () {

    if (getNum($(this).css("width")) > 50) {
      $(this).animate({ width: "50px" }, function () {
        $(this).find("button,ul").css({ display: "none" });
      });
    } else {
      $(this).animate({ width: "400px" }, function () {
        $(this).find("button,ul").css({ display: "block" });
      });
    }
  });
});

var Todo = function Todo(text, priority) {
  //used to create new todos
  this.text = text;this.priority = priority;
  this.update = function (update) {
    this.text = update.text;this.priority = update.priority;
  };
};

var TodoList = function TodoList(i) {
  //this is a constructor used to create babies called object
  this.todos = [];this.listSize = function () {
    return this.todos.length;
  };
  this.name = "Todo-List..." + i;

  this.add = function (todo) {
    //adds if the text is not the the list already; update if it is
    return todo.index !== undefined ? this.updateTodo(todo.index, todo) : this.todos.push(new Todo(todo.text, todo.priority)); //pushes a new todo object  (we will get there lol!)
  };
  this.clear = function () {
    //clears the entire todo list
    delete this.todos;return this.todos = [];
  };
  this.updateTodo = function (index, update) {
    //updates a particular todo using the provided index and updated values as object
    return this.todos[index].update(update);
  };
  this.findTodo = function (searchTodo) {
    //finds the todo based on the content
    var pos = -1;this.todos.forEach(function (todo, i) {
      if (searchTodo == todo.text) {
        pos = i;
      }
    });
    return pos;
  };
  this.deleteTodo = function (todo) {
    //deletes the todo provided
    if (this.findTodo(todo) < 0) {
      return false;
    }this.todos.splice(this.findTodo(todo), 1);
    return true;
  };
};

//We are done with functionality; time to style
var Alllist = React.createClass({
  displayName: "Alllist",
  getInitialState: function getInitialState() {
    return { alltodos: [] };
  },
  create: function create() {
    var all = this.state.alltodos;
    all.push(new TodoList(this.state.alltodos.length + 1));
    return this.setState({ alltodos: all });
  },
  deleteList: function deleteList(i) {
    this.state.alltodos.splice(i, 1);
    return this.setState(this.state.alltodos);
  },
  render: function render() {

    return React.createElement(
      "div",
      { id: "alllist" },
      React.createElement(
        "div",
        { id: "slider", className: "card" },
        React.createElement(
          "button",
          { onClick: this.create },
          "Create a Task"
        )
      ),
      this.state.alltodos.map(function (todolist, index) {
        return React.createElement(
          "div",
          { className: "todo_lists" },
          React.createElement(
            "button",
            { onClick: this.deleteList.bind(null, index) },
            "Delete A List "
          ),
          React.createElement(Todos, { todolist: todolist, pos: index })
        );
      }.bind(this))
    );
  }
});

//let us display in the react domain!
var Todos = React.createClass({
  displayName: "Todos",
  getInitialState: function getInitialState() {
    return { todolist: this.props.todolist };
  },
  displayList: function displayList() {
    var todolist = this.state.todolist.todos;
    return todolist.map(function (todo, i) {
      var props = { todo: todo, index: i, add: this.addATodo, delete: this.deleteATodo };
      return React.createElement(EachTodo, props);
    }.bind(this));
  },
  addATodo: function addATodo(todo) {
    var todolist = this.state.todolist;todo.priority = todo.priority.length === 0 ? "Low" : todo.priority;
    todolist.add(todo);return this.setState(todolist);
  },
  clearList: function clearList() {
    var todolist = this.state.todolist;
    todolist.clear();return this.setState(todolist);
  },
  deleteATodo: function deleteATodo(index) {
    var todolist = this.state.todolist;
    todolist.deleteTodo(todolist.todos[index].text);
    return this.setState(todolist);
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "todolist" },
      React.createElement(UserInput, { add: this.addATodo, pos: this.props.pos }),
      React.createElement(
        "button",
        { onClick: this.clearList },
        "Clear"
      ),
      React.createElement(
        "ul",
        { className: "collection" },
        this.displayList()
      )
    );
  }
});
var EachTodo = React.createClass({
  displayName: "EachTodo",
  getInitialState: function getInitialState() {
    return { update: false };
  },
  setupdate: function setupdate() {
    var u = !this.state.update;
    return this.setState({ update: u });
  },
  displayUpdate: function displayUpdate() {
    return this.state.update ? React.createElement(
      "div",
      null,
      React.createElement(HelperInputs, { add: this.add, option: "eachtodo" + this.props.index })
    ) : null;
  },
  add: function add(todo) {
    todo.index = this.props.index;
    return this.props.add(todo);
  },
  delete: function _delete() {

    return this.props.delete(this.props.index);
  },
  render: function render() {
    return React.createElement(
      "li",
      { className: this.state.update ? "collection-item actived" : "collection-item" },
      React.createElement(
        "span",
        null,
        this.props.index + 1 + ". " + this.props.todo.text + " : " + this.props.todo.priority
      ),
      React.createElement(
        "button",
        { onClick: this.setupdate },
        "Update"
      ),
      React.createElement(
        "button",
        { onClick: this.delete },
        "Delete"
      ),
      this.displayUpdate()
    );
  }
});

var UserInput = React.createClass({
  displayName: "UserInput",
  render: function render() {
    return React.createElement(
      "form",
      { className: "userinput" },
      React.createElement(HelperInputs, { add: this.props.add, option: "userinput" + this.props.pos })
    );
  }
});

var HelperInputs = React.createClass({
  displayName: "HelperInputs",
  getInitialState: function getInitialState() {
    return { text: "", priority: "" };
  },
  updateInput: function updateInput(key, e) {
    var state = this.state;
    state[key] = e.target.value;
    return this.setState(state);
  },
  clearInput: function clearInput() {
    $("input").val("");
    $("input").prop("checked", false);
  },
  sendTodo: function sendTodo(e) {
    e.preventDefault();
    this.clearInput();
    return this.props.add(this.state);
  },
  render: function render() {

    return React.createElement(
      "div",
      null,
      React.createElement("input", { type: "text", onChange: this.updateInput.bind(this, "text") }),
      React.createElement(
        "p",
        null,
        React.createElement("input", { type: "radio", value: "high", onChange: this.updateInput.bind(this, "priority"), name: "priority", id: "high1" + this.props.option }),
        React.createElement(
          "label",
          { htmlFor: "high1" + this.props.option },
          "High"
        )
      ),
      React.createElement(
        "p",
        null,
        React.createElement("input", { type: "radio", value: "low", onChange: this.updateInput.bind(this, "priority"), name: "priority", id: "low1" + this.props.option }),
        React.createElement(
          "label",
          { htmlFor: "low1" + this.props.option },
          "Low"
        )
      ),
      React.createElement(
        "button",
        { onClick: this.sendTodo },
        "Submit"
      )
    );
  }
});
ReactDOM.render(React.createElement(Alllist, null), document.body);