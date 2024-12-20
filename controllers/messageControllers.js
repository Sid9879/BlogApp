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
   let {recieverId} = req.params;
   console.log(userId);
   console.log(recieverId) // Get receiverId from the route params

   try {
      
      let conversation = await Conversation.findOneAndDelete({
         members:{ $all: [userId, recieverId] }
      });

      
      if (!conversation) {
         return res.json({ msg: "Conversation not found", success: false });
      }

      

      res.json({ msg: "Conversation deleted successfully", success: true });
   } catch (error) {
      console.error(error);
      res.json({ msg: "Error in deleting conversation", success: false ,error:error.message});
   }
}

const fetchSenderMessage = async (req, res) => {
   try {
     const messageId = req.params.messageId; 
     const senderId = req.user._id;
     const receiverId = req.params.receiverId// ID of the message to be deleted
let message = await Message.findByIdAndDelete(messageId);
let conversation = await Conversation.findOne({members:{$all:[senderId,receiverId]}})
   conversation.messages.pull(messageId)
   await conversation.save();
   res.json({msg:"deleted successfully",success:true})
   }
   catch(error){
      res.json({msg:"error in fetching sender message",success:false,error:error.message})
   }
 };

 const recentChat = async(req,res) =>{
   const senderId = req.user._id; // Get the sender ID from the authenticated user

    try {
        // Find all conversations where the sender is a member
        let conversations = await Conversation.find({ members: senderId })
            .populate({ path: 'members' ,match: { _id: { $ne: senderId } }, select: ['name', 'profilePic']}) // Populate member details
            .populate('messages') // Optionally populate messages if needed
            .select('members messages'); // Select only members and messages fields

            res.json({ msg: "Recent chats fetched successfully", success: true, conversations });
      //   Format the response to include receiver information
      //   const chatList = conversations.map(conversation => {
      //       const otherMember = conversation.members.find(member => member._id.toString() !== senderId.toString());
      //       return {
      //           receiver: otherMember,
      //           messages: conversation.messages
      //       };
      //   });

      //   res.json({ msg: "Chats found", success: true, chats: chatList });
    } catch (error) {
        console.error(error);
        res.json({ msg: "Error in fetching chats", success: false, error: error.message });
    }
 }



module.exports = {
    senderMessage,
    getConversation,
    DeleteConversation,
    fetchSenderMessage,
    recentChat
    
}