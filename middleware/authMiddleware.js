const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "This totally won't get posted to GitHub", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } // if (token is invalid)
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            } // else
        }); // Again, don't post secrets to GitHub
    } // if (token exists)
    else {
        res.locals.user = null;
        next();
    } // else
} // const CheckUser

module.exports = {requireAuth, checkUser};