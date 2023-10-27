const express = require('express');
const router = express.Router();




router.get("/", (_request, response) => {
    response.send("Whats up Team NoCoding");

});

module.exports = router;