const bcrypt = require("bcrypt");

async function createUser(req, res) {
  try {
    const { full_name, username, password } = req.body;

    const db = req.app.get("db");

    const hash = await bcrypt.hash(password, 10);

    const newUser = await db.users.insert({
      full_name: full_name,
      username: username,
      password: hash
    });

    req.session.user = {...newUser, loggedIn: true}

    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

module.exports = {
  createUser,
  };