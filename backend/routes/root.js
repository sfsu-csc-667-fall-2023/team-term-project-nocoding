const express = require("express");
const router = express.Router();


const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'postgres',
  password: 'passwordgoeshere',
  database: 'GameDB',
  port: '5432'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected.');
});

router.get("/", (request, response) => {
  response.render("index.ejs");
});

router.get("/:name", (request, response) => {
  const { name } = request.params; // Use request.params, not response.params
  response.render("root", { name });
});



module.exports = router;
