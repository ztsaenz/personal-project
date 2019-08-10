

async function createTask (req,res){
    try {
        const db = req.app.get('db');
        const newTask = await db.tasks.insert({title: req.body.title, goal_id: req.body.goal_id})
        res.send(newTask)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
createTask,
}