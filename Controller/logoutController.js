

async function logoutUser (req,res){
    try {
        return req.session.destroy((err)=> res.send('successfully logged out'))
    } catch (error) {
        console.error(error)
    }
}




module.exports = {
    logoutUser,
    };