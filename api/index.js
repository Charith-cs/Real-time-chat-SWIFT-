const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const app = express();

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const conversationRoute = require("./routes/conversations");
const messageRoute = require('./routes/messages');

//db connection
dotenv.config();
mongoose.connect(process.env.MONGO_URL , console.log("Connected to MongoDB"));

app.use("/images" , express.static(path.join(__dirname , "public/images")));

//middlware
app.use(cors({
    origin: ["https://real-time-chat-swift-front.vercel.app"],
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "application/json"]
}));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


//handle file in server side using multer

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null , "public/images");
    },
    filename:(req,file,cb)=>{
        cb(null , req.body.name);
    },
});

const upload = multer({storage});
app.post("/api/upload" , upload.single("file") , (req , res) => {
    try{
        return res.status(200).json("Image uploaded successfully.");
    }catch(error){
        console.log(error);
    }
});


app.use('/api/users' , userRoute);
app.use('/api/auth' , authRoute);
app.use('/api/conversations' , conversationRoute);
app.use('/api/messages' , messageRoute);

//server execution
app.listen(8800 , () => {
    console.log("Backend server is running");
});
