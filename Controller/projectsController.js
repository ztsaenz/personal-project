async function createProject(req, res) {
  try {
    const db = req.app.get("db");
    const newProject = await db.projects.insert({ title: req.body.title, creator: req.body.user_id   });
    const projectUser = await db.projects_users.insert({
      project_id: newProject.id,
      user_id: req.body.user_id
    });
    const projectList = await db.project_list({userId: parseInt(projectUser.user_id)});
    res.send(projectList);
  } catch (error) {
    console.error(error);
  }
}

async function addUser(req, res) {
  try {
    const db = req.app.get("db");
    const projectUser = await db.projects_users.insert({
      project_id: req.body.project_id,
      user_id: req.body.user_id
    });
    res.send(projectUser);
  } catch (error) {
    console.error(error);
  }
}

async function getProjects(req, res) {
  try {
    const db = req.app.get("db");
    const projectList = await db.project_list({userId: parseInt(req.params.user_id)});
    res.send(projectList);
  } catch (error) {
    console.error(error);
  }
}

async function getProject(req,res) {
  try {
    const db = req.app.get("db");
    const foundProject = await db.get_project([req.params.id])
    res.send(foundProject)
  } catch (error) {
    console.error
  }
}



async function updateProject(req, res) {
  const db = req.app.get("db");
 const updatedProject= await db.edit_project([req.params.id, req.body.title])
 const projectList = await db.project_list({userId: req.body.user_id});
 res.send(projectList);
   
}

async function deleteProject(req,res){

try {
    const db = req.app.get("db");



    const goals = await db.find_goals({projectId: req.params.projectId})
    const goalIds = `{${ goals.map(g => g.id).toString() }}`;
    const projects = await db.delete_project({ goalIds, projectId:req.params.projectId })
    res.send('successfully deleted')


} catch (error) {
    console.error(error)
}}

async function getProjectPage (req,res) {
  try {
    const db = req.app.get("db");
    const foundProject = await db.get_project([req.params.id])
    const foundGoals = await db.find_goals({projectId: req.params.id})
    const goalIds = `{${ foundGoals.map(g => g.id).toString() }}`;

    const foundNotes = await db.query(`
      SELECT * FROM notes
      WHERE goal_id = ANY(\${goalIds});
    `, { goalIds })

    const foundTasks = await db.query(`
    SELECT * FROM tasks
    WHERE goal_id = ANY(\${goalIds});
  `, { goalIds })

    const foundUsers = await db.get_users();

  const assignedUsers = await db.get_assigned_users([req.params.id])




    res.send({foundProject, foundGoals, foundNotes, foundTasks, foundUsers, assignedUsers }, 201)
  } catch (error) {
    console.error(error)
    res.send(error, 500)
  }
}

async function getAssignedUser(req,res){
  const db = req.app.get('db');
  const assignedUsers = await db.get_assigned_users([req.params.projectId])
  console.log(assignedUsers)
  res.send(assignedUsers, 200)
}

module.exports = {
  createProject,
  addUser,
  getProjects,
  updateProject,
  deleteProject, getProject, getProjectPage, getAssignedUser
};
