const router = require("express").Router();
const User = require("../model/Users");
const bcrypt = require("bcrypt");

//update profile
router.put("/update/:id" , async (req , res) => {
    if(req.body.userId === req.params.id){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password =  await bcrypt.hash(req.body.password , salt);     
            }catch(error){
                return res.status(500).json(error);
            }
        }
        try{
            await User.findByIdAndUpdate(req.params.id ,{
                $set: req.body,
            });
                return res.status(200).json("Account has been updated.");
        }catch(error){
            res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can update only your account!");
    }
});



//delete user
router.delete("/:id" , async ( req , res) => {
    if(req.body.userId === req.params.id){
        try{
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("Account has been deleted");
        }catch(error){
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can delete only your account.");
    }
});

//get a user
router.get("/:id" , async ( req , res) => {
    const id = req.params.id;
    try{
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json(error);
    }
});

//get profile

router.get("/" , async (req , res) => {
    const userId = req.body.userId;
    const userEmail = req.body.email;
    try{
        const user = userId ?  await User.findById(userId) : await User.findOne({email:userEmail});
        const {friends , password , isAdmin , ...others} = user._doc;
        res.status(200).json(others);
    }catch(error){
        res.status(500).json("Can't find a user");
    }
});

//add friend
router.put('/add', async (req, res) => {
    const find = await User.findOne({email:req.body.email});
    const findId = find._id.toString();
    
    if(req.body.userId !== findId){
        try{

            const currentUser = await User.findById(req.body.userId);
            const user = await User.findById(findId);

            if(!user.friends.includes(req.body.userId)){
                await user.updateOne({ $push : {friends: req.body.userId} });
                await currentUser.updateOne({ $push: {friends:findId} });
                res.status(200).json("Successfully added");
            }else{
                res.status(403).json("Already in friend list!");
            }
        }catch(error){
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You can't add yourself!");
    }
});


//remove friend
router.put("/:id/remove" , async (req , res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.friends.includes(req.body.userId)){
                await user.updateOne({ $pull : {friends: req.body.userId} });
                await currentUser.updateOne({ $pull: { friends : req.params.id} });
                res.status(200).json("Successfully removed");
            }else{
                res.status(403).json("You haven't this contact");
            }
        }catch(error){
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You can't remove yourself");
    }
});

//get friend list
router.post("/search/:id", async (req, res) => {
    try {
        if (req.body.username) {
            const currentUser = await User.findById(req.params.id);
            const searchedUser = await User.findOne({ username: req.body.username });
            const ids = searchedUser._id
           
            if (!currentUser.friends.includes(ids)) {
                res.status(404).json("This person is not in your friendlist!");
            } else {
                const resU = await User.findById(ids);
                res.status(200).json(resU);
            }
        } else if (req.body.email) {
            const emailUser = await User.findOne({ email: req.body.email });

            if (!emailUser) {
                res.status(404).json("User not found");
                return;
            }

            res.status(200).json(emailUser);
        } else {
            res.status(403).json("Please provide a valid username or email");
        }
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json("Internal Server Error");
    }
});


module.exports = router;