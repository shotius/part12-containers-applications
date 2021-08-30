const express = require("express");
const { Todo } = require("../mongo");
const { getAsync, setAsync } = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  try {
    const todos = await Todo.find({});
    res.send(todos);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  try {
    const statistics = await getAsync("added_todos");
    const incStat = await setAsync("added_todos", Number(statistics) + 1);
    if (incStat !== "OK") {
      res
        .status(400)
        .send("was not able to increment number of todos in redis");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }

  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.json(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  console.log(req.todo.id);
  try {
    const newTodo = await Todo.findByIdAndUpdate(req.todo.id, req.body, {
      new: true,
    });
    res.json(newTodo); // Implement this
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
