const { AzureOpenAI } = require("openai");
const inventoryModel = require('../models/inventoryModel');
const UserModel = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Load the .env file if it exists
const dotenv = require("dotenv");
dotenv.config();

// You will need to set these environment variables or edit the following values
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4"; //This must match your deployment name.
require("dotenv/config");

const chat = asyncHandler(async(req, res) => {
  console.log(req);
  const inventory = await inventoryModel.find({user: req.user.id}).sort("-createdAt")
  // res.status(200).json(inventory)
  const user = await UserModel.findById(req.user.id);
  
  //get message
  const userMessage = req.body.message;

  if (user) {
    const {_id, name, email, photo, phone, bio} = user;

  message = `This is my bio: ${bio}. These are my food inventory ${inventory}`;
  defaultReq = "I will give you the food information of a user and you will tailor a food usage plane for the user."

    if (userMessage) {
      userRes = userMessage;
    } else {
      userRes = defaultReq;
    }


  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  const result = await client.chat.completions.create({
    messages: [
    { role: "system", content: `You are a helpful food management assistant. ${userRes} ` },
    { role: "user", content: message}
    ],
    model: "",
  });

  for (const choice of result.choices) {
    console.log(choice.message);
  }
  const responseContent = result.choices[0].message.content;  // Assuming you want the first choice's message content
      res.status(200).json({ message: responseContent });
  } else {
    res.status(400);
    throw new Error("User Not found");
  };
})

chat().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { chat };