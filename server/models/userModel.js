const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be over 6 characters"],
        // maxLength: [24, "Password must be under 24 characters"]; we hashed it, do it on the front end
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://icons8.com/icon/xXjlE05o3dcg/user"
    },
    phone: {
        type: String,
        default: "+1"
    },
    bio: {
        type: String,
        maxLength: [300, "Bio must not over 300 characters"]
    },
}, {
    timestamps: true
});

// Ecrypt password before saving
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next()
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword
    next();
})

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel
