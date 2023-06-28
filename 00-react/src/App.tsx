import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

interface MyForm extends HTMLFormElement {
  todo: HTMLInputElement;
}

function App() {
  const [todos, setTodos] = useState<string[]>([]);

  return (
    <div>
      <div>
        <p>TODOS</p>
        <div>
          <form
            onSubmit={(e: React.FormEvent<MyForm>) => {
              e.preventDefault();
              const newTodo = e.currentTarget.todo.value;
              if (typeof newTodo === "string") {
                setTodos([...todos, newTodo]);
              }
              e.currentTarget.todo.value = "";
            }}
          >
            <input type="text" name="todo" />
            <button type="submit">Add</button>
          </form>
        </div>
        <div>
          {todos.map((todo, i) => (
            <div key={i}>{todo}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
