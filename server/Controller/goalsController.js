async function createGoal (req,res) {
    try {
        const db = req.app.get('db');
        const newGoal = await db.goals.insert({title: req.body.title, project_id: req.body.project_id});
        res.send(newGoal)
    } catch (error) {
        console.error(error)
    }
}

async function updateGoal (req,res) {
    try {
        const db = req.app.get('db');
        const updatedGoal = await db.edit_goal([req.params.id, req.body.title])
        res.send(updatedGoal)
    } catch (error) {
        console.error(error)
    }
}

async function deleteGoal (req,res) {
    try {
        const db = req.app.get('db');
        const deletedGoal = await db.delete_goal([req.params.id])
        res.send(deletedGoal)

    } catch (error) {
        console.error(error)
    }
} 

async function getGoals (req,res) {
    try {
        const db = req.app.get('db');
        const foundGoals = await db.find_goals({projectId: req.params.projectId})
        res.send(foundGoals, 200)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createGoal,
    updateGoal,
    deleteGoal,
    getGoals,
}