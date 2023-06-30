import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const mod = process.env.NODE_ENV ?? "dev";

const { PORT = 8000, MONGO_URI = "" } =
  dotenv.config({ path: `.env.${mod}` }).parsed || {};

console.log("====================================");
console.log("using env with mod :", mod);
console.log("PORT :", PORT);
console.log("MONGO_URI :", MONGO_URI);
console.log("====================================");

const app = express();
app.use(cors());
app.use(express.json());
//connect to mongoDB
mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// mongoose schema
const Schema = mongoose.Schema;
const todoSchema = new Schema({
  uuid: String,
  context: String,
  completed: Boolean,
});

// change express server port to 8002
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

app.get("/", (req, res) => {
  res.send("API works!");
});

app.post("/api", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

// create a new todo to mongoDB on api/todo
app.post("/api/todo", async (req, res) => {
  const Todo = mongoose.model("Todo", todoSchema);
  const reqBody = req.body;
  console.log("req", req.body);

  const todo = new Todo({
    uuid: reqBody.uuid,
    context: reqBody.context,
    completed: reqBody.completed,
  });
  try {
    await todo.save();
  } catch (e) {
    console.log("e", e);
    res.send("error!");
  }
  const Todos = await Todo.find({});

  const result = Todos.map((todo) => {
    return {
      uuid: todo.uuid,
      completed: todo.completed,
      context: todo.context,
    };
  });
  res.send(result);
  // res.send("TODO saved");
});

// get all todos from mongoDB on api/todo
app.get("/api/todo", async (req, res) => {
  const Todo = mongoose.model("Todo", todoSchema);
  const result = await Todo.find({});
  console.log("result", result);
  res.send(result);
});

app.patch("/api/todo/:id", async (req, res) => {
  const Todo = mongoose.model("Todo", todoSchema);
  // read a json body from request
  console.log("req.body", req.body);

  const result = await Todo.updateOne(
    { uuid: req.params.id },
    { completed: req.body.completed }
  );
  // console.log("result", result);
  // res.send("hoi");
  // res.send(result);
  // get all todos from mongoDB on api/todo
  const result2 = await Todo.find({});
  const a = result2.map((todo) => {
    return {
      uuid: todo.uuid,
      completed: todo.completed,
      context: todo.context,
    };
  });
  res.send(a);
});

app.delete("/api/todo/:id", async (req, res) => {
  const Todo = mongoose.model("Todo", todoSchema);
  // read a json body from request
  // console.log("req.body", req.body);

  const result = await Todo.deleteOne({ uuid: req.params.id });
  const result2 = await Todo.find({});
  const a = result2.map((todo) => {
    return {
      uuid: todo.uuid,
      completed: todo.completed,
      context: todo.context,
    };
  });
  res.send(a);
});
