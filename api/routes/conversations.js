const router = require("express").Router();
const Conversation = require("../model/Conversation");
const User = require("../model/Users");

//create conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId]
    });
  
    // Check if a conversation with the same members already exists
    try {
      const existingConversation = await Conversation.findOne({
        members: {
          $all: [req.body.senderId, req.body.receiverId]
        }
      });
  
      if (existingConversation) {
        // Conversation with the same members already exists
        return res.status(409).json("Conversation already exists");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  
    // If no existing conversation, save the new conversation
    try {
      const conversation = await newConversation.save();
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  

//get conversation
router.get("/:userId" , async (req , res) => {
    try{
        const conversation = await Conversation.find({
            members : {$in:[req.params.userId]},
        });
        res.status(200).json(conversation);
    }catch(error){
        res.status(500).json(error);
    }
});

//get conversation based on two ids
router.get("/find/:firstuserId/:seconduserId" , async (req , res) => {
    try{
        const conversation = await Conversation.findOne({
            members : {$all : [req.params.firstuserId , req.params.seconduserId]}
        });
        res.status(200).json(conversation);
    }catch(error){
        res.status(500).json(error);
    }
});

//when unfriend handle conversation
router.delete("/delete/:userId/:receiverId" , async (req , res) => {
  try{
     await Conversation.findOneAndDelete({
      members:{ $all : [req.params.userId , req.params.receiverId]}
    });
    res.status(200).json("User Removed");
  }catch(error){
    res.status(500).json("Something went wrong");
  }
});


module.exports = router;