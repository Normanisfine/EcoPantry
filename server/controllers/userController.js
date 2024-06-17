const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "15d"})
};

// Register user
const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password} = req.body

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields")
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be over 6 characters")
    }
    // check if user email exist
    const userExists = await UserModel.findOne({email})

    if (userExists) {
        res.status(400);
        throw new Error("Email has already been registerd")
    }


    // Create new user
    const user = await UserModel.create({
        name,
        email,
        password
    })

    // Generate Token
    const token = generateToken (user._id)

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400 * 15), // 15 days
        sameSite: "none",
        secure: true
    });

    if (user) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
            token
        });
    } else {
        res.status(400)
        throw new Error("Invalid User Data")
    }

});

// Login user

const loginUser = asyncHandler( async (req, res) =>{
    
    const {email, password} = req.body

    //Validate Request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    };

    // Check if user exist
    const user = await UserModel.findOne({email})

    if (!user) {
        res.status(400);
        throw new Error("User not found, please sign up");
    };

    // check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    // Generate Token
    const token = generateToken (user._id)

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400 * 15), // 15 days
        sameSite: "none",
        secure: true
    });

    if (user && passwordIsCorrect) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(200).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
            token
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    };
});


// Logout User
const logout = asyncHandler( async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), 
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({ message: "Successfully logged out"});
}
);

// Get User Data
const getUser = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    if (user) {
        const {_id, name, email, photo, phone, bio} = user;
        res.status(200).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
        });
    } else {
        res.status(400);
        throw new Error("User Not found");
    };
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
    
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    };

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
        return res.json(true)
    }
    return res.json(false)
});

// Update User

const updateUser = asyncHandler (async (req, res) => {
    const user = await UserModel.findById(req.user._id);

    if (user) {
        const { name, email, photo, phone, bio} = user;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            photo: updatedUser.photo, 
            phone: updatedUser.phone, 
            bio: updatedUser.bio
        })
    } else {
        res.status(404)
        throw new Error("User not Found")
    }
})

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id);
    const {oldPassword, password} = req.body

    if (!user) {
        res.status(400);
        throw new Error("User not found, please sign up");
    }

    //validate

    if (!oldPassword || !password) {
        res.status(400);
        throw new Error("Please add and new password");
    }

    // check if the old password matches db
    const passwordIsCorrect  = await bcrypt.compare(oldPassword, user.password);

    // Save new password

    if (user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password change successfully")
    } else {
        res.status(400);
        throw new Error("Old password is incorrect");
    }

})

// Forget Password and reset
const fogetPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    const user = await UserModel.findOne({email});

    if (!user) {
        res.status(404)
        throw new Error("User does not exist")
    }

    // Delete token if existing in the db
    let token = await Token.findOne({userId: user._id});
    if (token) {
        await token.deleteOne();
    }

    //Create reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    console.log(resetToken);

    // Hash token before saving to db
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token to DB
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expireAt: Date.now() + 30 * (60 * 1000) //30 min
    }).save()

    // Construct Reset URL
    const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    // Reset Email
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please click the url below to reset your password</p>
        <p>This link is valid for 30 minutes</p>
        <a href=${resetURL} clicktracking=off>${resetURL}</a>

        <p>Regrads...</p>
        <p>EcoPantry</p>
    `;
    const subject = "Password Reset Request - EcoPantry";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({success: true, message: "Reset email sent"})
    } catch (error) {
        res.status(500)
        throw new Error("Email not sent, please check again")
    }
});

// Reset Password

const resetPassword = asyncHandler(async (req, res) => {
    
    const {password} = req.body;
    const {resetToken} = req.params;

     // Hash token, then compare it to the Token in the DB
     const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

     //Find Token in DB
     const userToken = await Token.findOne({
        token: hashedToken,
        expireAt: {$gt: Date.now()}
     });

     if (!userToken) {
        res.status(404);
        throw new Error("Invalid or Expired Token")
     }

     //Find user, if the token is valid
     const user = await UserModel.findOne({_id: userToken.userId});
     user.password = password;

     //save user
     await user.save()
     res.status(200).json({
        message: "Password Reset Successfully, Please Login"
     })

});

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    fogetPassword,
    resetPassword
}