const express = require('express');
const router = express.Router();

router.get("/:name", (request, response) => {
    const { name } = request.params; // Use request.params, not response.params
    response.render('root', { name });
});

module.exports = router;
