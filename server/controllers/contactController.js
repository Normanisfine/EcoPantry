const expressAsyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");


const contactUs = expressAsyncHandler (async(req, res) => {
    const {subject, message} = req.body
    const user = await UserModel.findById(req.user._id)

    if (!user) {
        res.status(400)
        throw new Error("User not found, pleas signup")
    }

    // validation
    if (!subject || !message) {
        res.status(400)
        throw new Error("Please add subject and message")
    }

    const send_to = process.env.EMAIL_USER;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email

    try {
        await sendEmail(subject, message, send_to, sent_from, reply_to);
        res.status(200).json({success: true, message: "Email sent"})
    } catch (error) {
        res.status(500)
        throw new Error("Email not sent, please check again")
    }
});


module.exports = {
    contactUs
}