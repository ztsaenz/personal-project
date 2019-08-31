const bodyParser = require("body-parser");
const session = require("express-session");
const app = require("express")();
const cors = require("cors");
const massive = require("massive");
const http = require("http").createServer(app);
const loginController = require("./Controller/loginController");
const signupController = require("./Controller/signupController");
const logoutController = require("./Controller/logoutController");
const projectsController = require("./Controller/projectsController");
const goalsController = require("./Controller/goalsController");
const tasksController = require("./Controller/tasksController");
const notesController = require("./Controller/notesController");
const io = require("socket.io")(http);


app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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

// io.on("connection", socket => {
//   socket.join('some room')
//   // socket.emit("news", { hello: 'world'});
//   io.to('some room').emit('chat', {user: 'user joined'})
//   socket.on('my other event', function(data){
//     console.log(data)
//   })

  
//   socket.on('chat', data =>{
//     socket.to('some room').emit('chat', data)
//   } )

 

//   socket.on("disconnect", () => {
//     console.log('disconnect')
//   });
// });
//chat

app.post('/api/chat/send', async (req,res)=> {
  console.log(req.body.message)
  
  res.send('success', 200)
})

//signup
app.post("/api/signup", signupController.createUser);
//login
app.post("/api/login", loginController.loginUser);
//logout
app.get("/api/logout", logoutController.logoutUser);
//projects
app.get("/api/projects/list/:user_id", projectsController.getProjects);

app.get("/api/projects/:id", projectsController.getProject);

app.get("/api/projects/projectpage/:id", projectsController.getProjectPage);

app.get(
  "/api/projects/assigned/:projectId",
  projectsController.getAssignedUser
);

app.post("/api/projects/create", projectsController.createProject);

app.post("/api/projects/assign", projectsController.addUser);

app.post("/api/projects/adduser", projectsController.addUser);

app.put("/api/projects/edit/:id", projectsController.updateProject);

app.delete("/api/projects/delete/:projectId", projectsController.deleteProject);
//goals
app.post("/api/goals/create", goalsController.createGoal);

app.put("/api/goals/edit/:id", goalsController.updateGoal);

app.delete("/api/goals/delete/:id", goalsController.deleteGoal);

app.get("/api/goals/:projectId", goalsController.getGoals);
//tasks
app.get("/api/tasks/:goalId", tasksController.getTasks);

app.post("/api/tasks/create", tasksController.createTask);

app.delete("/api/tasks/delete/:taskId", tasksController.deleteTask);
//notes
app.get("/api/notes/:goalId", notesController.getNotes);

app.post("/api/notes/create", notesController.createNote);

app.put("/api/notes/edit/:id", notesController.updateNote);

app.delete("/api/notes/delete/:id", notesController.deleteNote);
//users
app.get("/api/user", loginController.getUser);

app.get("/api/users", loginController.getUsers);

http.listen(8080, () => {
  console.log(`listening on port:8080`);
});
