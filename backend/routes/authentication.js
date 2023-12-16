const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Users = require("../db/users");

const SALT_ROUNDS = 10;

router.get("/sign_up", (_request, response) => {
    response.render("sign_up");
});



router.get("/global_lobby", (_request, response) => {
    response.render("game");
});

router.post("/sign_up", async (request, response) => {
    // Given a clear text password, encrypt and check for credentials
    const { email, password } = request.body;

    // First check if they exist and redirect to sign up
    const user_exists = await Users.email_exists(email);
    if (user_exists) {
        response.redirect("/");
        return;
    }
    // Encrypt the clear text password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    // Store in the DB
    const { id, email: userEmail } = await Users.create(email, hash);

    request.session.user = { id, email: userEmail }

    // Redirect lobby
    response.redirect("/lobby");

})

router.post("/sign_in", async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await Users.find_by_email(email);
        const isValidUser = await bcrypt.compare(password, user.password);

        if (isValidUser) {
            request.session.user = {
                id: user.id,
                email
            };

            console.log("User logged in:", request.session.user);

            response.redirect("/lobby");
            return;
        } else {
            response.render("landing", { error: "The credentials you supplied are invalid!", loginFailed: true });
        }
    } catch (error) {
        console.error("Error during sign in:", error);
        response.render("landing", { error: "The credentials you supplied are invalid!", loginFailed: true });
    }
    console.log("Session after login:", request.session);
    console.log("Session user:", request.session.user);

});

router.get("/logout", (request, response) => {
    console.log("Logging out user:", request.session.user);


    if (request.session && request.session.user) {
        request.session.destroy((error) => {
            if (error) {
                console.error("Error destroying session:", error);
            } else {
                console.log("User session after logout:", request.session); // Log session data
                response.clearCookie("connect.sid", { path: '/' }); // Specify the correct cookie name and path
                response.redirect("/");
            }
        });
    } else {
        response.redirect("/");
    }
    console.log("Session before logout:", request.session);
});

module.exports = router;


router.get("/logout", (request, response) => {
    console.log("Logging out user:", request.session.user);

    if (request.session && request.session.user) {
        // Destroy the session
        request.session.destroy((error) => {
            if (error) {
                console.error("Error destroying session:", error);
            } else {
                // Clear the session cookie
                response.clearCookie("connect.sid");
                // OR
                // response.clearCookie("your-session-cookie-name");

                console.log("User session after logout:", request.session); // Log session data
                response.redirect("/");
            }
        });
    } else {
        // If request.session.user is not defined, proceed with redirection
        response.redirect("/");
    }
});








module.exports = router;