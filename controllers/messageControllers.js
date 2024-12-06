const Conversation = require("../models/Conversation")
const Message = require("../models/Messages")

const senderMessage = async(req,res)=>{
     let sender = req.user._id;
   
     const {recieverId} = req.params;
     const {text} = req.body

     let message = await Message.create({
      sender:sender,
      receiver:recieverId,
      text:text
   })

     try {
        let conversation = await Conversation.findOne({members:{$all:[sender,recieverId]}})

     if(!conversation){
        conversation = await Conversation.create({members:[sender,recieverId]})
     }

    

     conversation.messages.push(message._id)
     await conversation.save();

     res.json({msg:"message send successfully",success:true,conversation})
     } catch (error) {
        res.json({msg:" error in sending message",success:false,error:error.message})
     }
}


const getConversation = async(req,res)=>{
     let userId = req.user._id;
     const {recieverId} = req.params;

   try {
      let conversation = await Conversation.findOne({members:{$all:[userId,recieverId]}}).populate({path:'members',select:['name','profilePic',]}).populate('messages').select('text');

      if(conversation){
 
         res.json({msg:"chat fetched successfully",success:true,chat:conversation.messages})
      }
 
      else{
       res.json({msg:"no chat found ",success:false,chat:[]})
      }
   } catch (error) {
      res.json({msg:"error in getting chat",success:false})
   }

}

const DeleteConversation = async (req, res) => {
   let userId = req.user._id;  // by token
   let receiverId = req.params.receiverId; 
   console.log(userId);
   console.log(receiverId) // Get receiverId from the route params

   try {
      
      let conversation = await Conversation.findOneAndDelete({
         members: { $all: [userId, receiverId] }
      });

      if (!conversation) {
         return res.json({ msg: "Conversation not found", success: false });
      }

      res.json({ msg: "Conversation deleted successfully", success: true });
   } catch (error) {
      console.error(error);
      res.json({ msg: "Error in deleting conversation", success: false });
   }
}

module.exports = {
    senderMessage,
    getConversation,
    DeleteConversation
}