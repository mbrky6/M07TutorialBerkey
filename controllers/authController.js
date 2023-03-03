const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Error handler
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: "", password: ""};

    // Incorrect email
    if (err.message === "Incorrect email") {
        errors.email = "Email does not exist";
    }

    // Incorrect password
    if (err.message === "Incorrect email") {
        errors.password = "Password is incorrect";
    }

    // Duplicate error code
    if (err.code === 11000) {
        errors.email = "Email already in use";
        return errors;
    }

    // Validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    } // if (error message includes "user validation failed")
    
    return errors;
}

// JWT generator
const maxAge = 60 * 60 * 24 * 3 // 3 days in seconds
const createToken = (id) => {
    return jwt.sign({id}, "This totally won't get posted to GitHub", {expiresIn: maxAge}); // jwt.sign(body, secret, options) Do not post secrets to GitHub
}

module.exports.signup_get = (req, res) => {
    res.render("signup");
}

module.exports.login_get = (req, res) => {
    res.render("login");
}

module.exports.signup_post = async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge});
        res.status(201).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge});
        res.status(200).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", {maxAge: 1}); // Replace JWT with a vanishing blank cookie
    res.redirect("/");
}