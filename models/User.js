const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        validate: [isEmail, "Invalid email"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password must be at least 6 characters long"]
    }
});

// Hook: Function before saving to database (hook after saving is called x.post)
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Login static method
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});

    if (user) {
        // Compare entered password against stored password
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        } // if (passwords match)
        throw Error("Incorrect password");
    } // if (email exists)
    throw Error("Incorrect email");
}

const User = mongoose.model("user", userSchema);

module.exports = User;