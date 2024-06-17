const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('./models/userModel');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require("./routes/userRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const contactRoute = require("./routes/contactRoute");
const chatRoute = require("./routes/AIChat")
const errorHandler = require("./middleWare/errorMiddleWare");
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express();

const PORT = process.env.PORT || 3001;

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://ecopantry.vercel.app"],//the second url can be changed accoridding to the final deployment
    credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/contactus", contactRoute);
app.use("/api/aichat", chatRoute);

//Routes
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Error Handler
app.use(errorHandler);


// connect to mongoDB and start server
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });






