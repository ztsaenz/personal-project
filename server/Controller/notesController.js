async function createNote (req,res) {
    try {
        const db = req.app.get('db');
        const newNote = await db.notes.insert({body: req.body.body, goal_id: req.body.goal_id});
        res.send(newNote)
    } catch (error) {
        console.error(error)
    }
}

async function updateNote (req,res) {
    try {
        const db = req.app.get('db');
        const updatedNote = await db.edit_note([req.params.id, req.body.body])
        res.send(updatedNote)
    } catch (error) {
        console.error(error)
    }
}

async function deleteNote (req,res) {
    try {
        const db = req.app.get('db');
        const deletedNote = await db.delete_note([req.params.id])
        res.send(deletedNote)

    } catch (error) {
        console.error(error)
    }
} 

module.exports = {
    createNote,
    updateNote,
    deleteNote,

}