const bodyParser = require("body-parser");
const session = require("express-session");
const app = require("express")();
const cors = require("cors");
const massive = require("massive");
const bcrypt = require("bcrypt");
const loginController = require("./Controller/loginController");
const signupController = require("./Controller/signupController");
const logoutController = require("./Controller/logoutController");
const projectsController = require("./Controller/projectsController");
const goalsController = require("./Controller/goalsController");
const tasksController = require("./Controller/tasksController");
const notesController = require("./Controller/notesController");

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
massive("postgres://postgres:postgres@localhost:5432/postgres").then(db => {
  console.log("connected to the db");
  app.set("db", db);
});
app.use(
  session({
    secret: "keyboard cat",
    maxAge: 50000000,
    resave: true,
    saveUninitialized: true
  })
);
app.use(bodyParser.json());

//signup
app.post("/api/signup", signupController.createUser);
//login
app.post("/api/login", loginController.loginUser);
//logout
app.get("/api/logout", logoutController.logoutUser);
//projects
app.post("/api/projects/create", projectsController.createProject);

app.post("/api/projects/assign", projectsController.addUser);

app.get("/api/projects/list/:user_id", projectsController.getProjects);

app.get("/api/projects/:id", projectsController.getProject ); 

app.put("/api/projects/edit/:id", projectsController.updateProject);

app.delete("/api/projects/delete/:projectId", projectsController.deleteProject);
//goals
app.post("/api/goals/create", goalsController.createGoal);

app.put("/api/goals/edit/:id", goalsController.updateGoal);

app.delete("/api/goals/delete/:id", goalsController.deleteGoal);
//tasks
app.post("/api/tasks/create", tasksController.createTask);
//notes
app.post("/api/notes/create", notesController.createNote);

app.put("/api/notes/edit/:id", notesController.updateNote);

app.delete("/api/notes/delete/:id", notesController.deleteNote);
//users
app.get("/api/user", loginController.getUser);

app.listen(8080, () => {
  console.log(`listening on port:8080`);
});
