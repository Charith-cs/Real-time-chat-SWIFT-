const router = require("express").Router();
const Message = require("../model/Messages");


//send
router.post("/" , async (req , res) => {
    const newMessages = new Message(req.body);
    try{
        const setMessages = await newMessages.save();
        res.status(200).json(setMessages);
    }catch(error){
        res.status(500).json(error);
    }
});

//get messages
router.get("/:conversationId" , async (req , res) => {
    try{
        const allMessages = await Message.find({
            conversationId:[req.params.conversationId]
        });
        res.status(200).json(allMessages);
    }catch(error){
        res.status(500).json(error);
    }
});

//conversation based last message
router.get("/last/:conversationId" , async (req , res) => {
    const id = req.params.conversationId;
    try{
        const conversation = await Message.find({conversationId:id}).sort({ timestamp: -1 });
        if(conversation.length > 0){
            const latestMessage = conversation[conversation.length - 1];
            res.status(200).json(latestMessage);
        }else{
            res.status(404).json("Can't find related message");
        }   
    }catch(error){
        res.status(500).json(error);
    }
});
//delete Messages when deletion of conversation
router.delete("/delete/:conversationId" , async (req , res) => {
    const id = req.params.conversationId;
    try{
        const result = await Message.deleteMany({ conversationId: id })
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "All messages deleted successfully" });
        } else {
            res.status(404).json({ message: "No messages found for the given conversation ID" });
        }
    }catch(error){
        res.status(500).json("Oops! Something went wrong");
    }
});



module.exports = router;