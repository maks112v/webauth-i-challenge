const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./dbconfig");
const restrictedRouter = require('./helpers/restrictedRouter')

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.post("/api/register", async (req, res) => {
  try {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    const result = await db("users").insert(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  db("users")
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      res.status(404).json({ message: "wrong username" });
    });
});

const restricted = (req, res, next) => {
  const {username, password} = req.headers;

  db("users")
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      res.status(404).json({ message: "wrong username" });
    });
}

server.get('/api/users', restricted, (req, res) => {
  db('users').select('id','username','password')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

server.use('/api/restricted', restricted, restrictedRouter)

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
