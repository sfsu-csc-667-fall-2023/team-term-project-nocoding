const express = require("express");
const router = express.Router();

router.post("/:id", (_request, response) => {
    const { id } = request.params;
    const { message } = request.body;

    console.log({ id, message });
    response.status(200);
});

module.exports = router;