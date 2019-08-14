

async function createTask (req,res){
    try {
        const db = req.app.get('db');
        const newTask = await db.tasks.insert({title: req.body.title, goal_id: req.body.goal_id})
        const tasks = await db.get_tasks([req.body.goal_id])
        res.send(tasks, 200)
    } catch (error) {
        console.error(error)
    }
}

async function getTasks (req,res){
    try {
        const db = req.app.get('db');
        const foundTasks = await db.get_tasks([req.params.goalId])
        res.send(foundTasks, 200)
    } catch (error) {
        console.error(error)
    }
}

async function deleteTask (req,res){
    try {
        const db = req.app.get('db');
        const deletedTask = await db.delete_task([req.params.taskId])
        res.send('successfully deleted', 200)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
createTask,
getTasks,
deleteTask,
}