import React from "react";
import ReactDOM from "react-dom";
import { compose, lifecycle, withStateHandlers } from "recompose";

import "./styles.css";

//set id for unique keys for <li> and delete button
let id = 0;

//display todo
const Todo = props => (
  <li key={props.todo.id}>
    <input
      type="checkbox"
      checked={props.todo.checked}
      onChange={props.onToggle}
    />
    <span
      style={{
        textDecoration: props.todo.checked ? "line-through" : "none"
      }}
    >
      {props.todo.text}
    </span>
    <button onClick={props.onDelete}>Delete</button>
  </li>
);

//list of todos
const TodoList = props => {
  let Todos = props.todos.map(todo => (
    <Todo
      todo={todo}
      onToggle={() => props.toggleTodo(todo.id)}
      onDelete={() => props.removeTodo(todo.id)}
    />
  ));
  return (
    <>
      <button onClick={() => props.addTodo()}>Add TODO</button>
      <ul style={{ listStyleType: "none" }}>{Todos}</ul>
      <button onClick={() => props.showAll()}>All</button>
      <button onClick={() => props.showNew()}>New</button>
      <button onClick={() => props.showDone()}>Done</button>
    </>
  );
};

const Enhanced = entity =>
  compose(
    withStateHandlers(
      {
        //all todos
        allTodos: [],
        //todos to be passed to TodoList to be displayed
        [entity]: []
      },
      {
        //add todo
        addTodo: state => () => {
          const text = prompt("TODO text please");
          return {
            todos: [...state.todos, { id: id++, text: text, checked: false }]
          };
        },

        //handle ticking the checkbox
        toggleTodo: state => id => {
          let newList = state.todos.map(todo => {
            if (todo.id !== id) return todo;
            return {
              id: todo.id,
              text: todo.text,
              checked: !todo.checked
            };
          });
          return {
            todos: newList,
            allTodos: newList
          };
        },

        //delete todo
        removeTodo: state => id => {
          return {
            todos: state.todos.filter(todo => todo.id !== id)
          };
        },

        //All button action
        showAll: state => () => {
          return {
            todos: state.allTodos
          };
        },

        //New button action
        showNew: state => () => {
          return {
            todos: state.allTodos.filter(todo => !todo.checked)
          };
        },

        //Done button action
        showDone: state => () => {
          return {
            todos: state.allTodos.filter(todo => todo.checked)
          };
        }
      }
    ),
    lifecycle({
      componentDidMount() {
        //show All by default
        return {
          todos: this.allTodos
        };
      }
    })
  );

const Todos = Enhanced("todos")(TodoList);

function App() {
  return <Todos />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
