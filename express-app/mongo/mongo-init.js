db.createUser({
  user: "the_username",
  pwd: "the_password",
  roles: [
    {
      role: "dbOwner",
      db: "the_database",
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: "Write a code", done: "false"});
db.todos.insert({ text: "moTivba", done: "false"});