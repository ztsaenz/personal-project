const bcrypt = require("bcrypt");


async function loginUser(req, res) {
  try {
    const db = req.app.get("db");

    const [foundUser] = await db.users.find({ username: req.body.username });
    if (!foundUser) return res.status(400).send("please enter a valid one");
    const authenticated = await bcrypt.compare(req.body.password,foundUser.password);
    if (!authenticated) res.status(400).send("please correct info");

    req.session.user = {...foundUser, loggedIn: true};
    delete req.session.user.password

    return res.status(200).send(req.session.user);
  } catch (error) {
    console.error(error);
  }
}

async function getUser(req, res) {
  try {
    if(!req.session.user){return res.send("please log in")}
    return res.send(req.session.user)
    
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getUser,
  loginUser
};
