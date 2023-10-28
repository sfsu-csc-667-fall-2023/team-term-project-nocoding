const express = require('express');
const router = express.Router();

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



router.get("/:name", (request, response) => {
    const { name } = request.params; // Use request.params, not response.params
    response.render('root', { name });
});



module.exports = router;
