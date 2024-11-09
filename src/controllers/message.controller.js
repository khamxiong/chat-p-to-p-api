import Message from "../models/message.model.js";
import Conversation from "../models/conversaction.model.js";

export const sendMessage = async (req, res) => {
    try {
       const {message} = req.body;
       const senderId = req.user._id;
       const {id: receiverId} = req.params;
       let conversaction = await Conversation.findOne({
           participants: {
               $all: [senderId, receiverId]
           }
       })

       if(!conversaction) {
           conversaction = await Conversation.create({
               participants: [senderId, receiverId]})
            }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })
        if(newMessage) {
            conversaction.messages.push(newMessage._id);
            // await conversaction.updateOne({
            //     $push: {messages: newMessage._id}
            // })
        }
        // connect to socket.io here
        // this is will run in parallel
        await Promise.all([conversaction.save(), newMessage.save()]);
        res.status(200).json({message: "Message sent successfully", data: newMessage});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try{
    const {id:userToChatId} = req.params;
    const senderId = req.user._id;
    console.log("senderId:", senderId);
    const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json({data: []});
    res.status(200).json({data: conversation.messages});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}