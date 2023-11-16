const express = require("express");
const router = express.Router();

router.get("/auth", (_request, response) => {
    response.render("auth");
});

module.exports = router;