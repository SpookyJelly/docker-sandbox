import { useState, useEffect, useId } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import axios from "axios";

interface MyForm extends HTMLFormElement {
  todo: HTMLInputElement;
}
interface Todo {
  uuid: string;
  context: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    axios.get("http://localhost:8002/api/todo").then((res) => {
      console.log(res.data);
      setTodos(res.data);
    });
  }, []);

  const handleChange = (uuid: string, completed: boolean) => {
    const URL = `http://localhost:8002/api/todo/${uuid}`;
    console.log("completed", completed);
    axios.patch(URL, { completed: !completed }).then((res) => {
      console.log("res", res.data);
      setTodos(res.data);
    });
  };

  const handleClick = (uuid: string) => {
    const URL = `http://localhost:8002/api/todo/${uuid}`;
    axios.delete(URL).then((res) => {
      console.log("res", res.data);
      setTodos(res.data);
    });
  };

  return (
    <div>
      <div>
        <p>02-react-db</p>
        <p>TODOS</p>
        <div>
          <form
            onSubmit={(e: React.FormEvent<MyForm>) => {
              e.preventDefault();
              const newTodo = e.currentTarget.todo.value;
              if (typeof newTodo === "string") {
                const uuid = uuidv4();
                const newTodoObj = {
                  uuid: uuid,
                  context: newTodo,
                  completed: false,
                };
                console.log("newTODO", newTodoObj);
                axios
                  .post("http://localhost:8002/api/todo/", newTodoObj)
                  .then((res) => {
                    console.log("res", res.data);
                    setTodos(res.data);
                  });
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
            <div className="todos">
              <div key={todo.uuid}>{todo.context}</div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleChange(todo.uuid, todo.completed)}
              />
              <div onClick={(e) => handleClick(todo.uuid)}>
                <small>delete</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
