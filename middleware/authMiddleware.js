const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Verify the JWT
    if (token) {
        jwt.verify(token, "This totally won't get posted to GitHub", (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } // if (token is invalid)
            else {
                console.log("Decoded token");
                next();
            } // else
        }); // Again, don't post secrets to GitHub
    } // If (token exists)
    else {
        res.redirect("/login");
    } // else

} // const requireAuth

module.exports = {requireAuth};