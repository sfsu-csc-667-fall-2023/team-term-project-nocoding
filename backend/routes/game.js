const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const user = req.session.user;

    res.render("game", { user } );
});



module.exports = router;