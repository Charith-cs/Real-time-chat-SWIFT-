const router = require("express").Router();
const User = require("../model/Users");
const bcrypt = require("bcrypt");

//register user
router.post("/register" , async (req , res)=>{
    try{

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password , salt);

        const newUser = new User({
            username:req.body.username , 
            email:req.body.email,
            password:hashedPassword,
            profilePicture:req.body.profilePicture
        });

        const user = await newUser.save();
        res.status(200).json(user);

    }catch(error){
        res.status(500).json("Oops! Something went wrong.");
    }
});

//login user
router.post("/login" , async (req , res) => {
    try{
       
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json("User doesn't exists.");
        }else{
            const validPassword = await bcrypt.compare(req.body.password , user.password);
            if(!validPassword){
                return res.status(400).json("Enter valid password");
            }   
            res.status(200).json(user);
        }

    }catch(error){
        res.status(500).json(error);
    }
});

module.exports = router;