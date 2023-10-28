const express = require("express");
const router = express.Router();

<<<<<<< HEAD
router.get("/", (request, response) => {
  response.render("index.ejs");
});
=======
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'GameDB'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected.');
});



>>>>>>> 72cbec78479e88be89c84d27abcfb58146222433
router.get("/:name", (request, response) => {
  const { name } = request.params; // Use request.params, not response.params
  response.render("root", { name });
});



module.exports = router;
