const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // Assuming you have the user data in the session
    const user = req.session.user;

    // Render the view and pass the user variable
    res.render("global_lobby", { user });
});

module.exports = router;