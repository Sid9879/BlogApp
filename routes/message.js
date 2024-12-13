const express = require('express');
const { senderMessage, getConversation, DeleteConversation, fetchSenderMessage } = require('../controllers/messageControllers');
const checkToken = require('../middleware/checkToken');
const router = express.Router();

router.post('/send/:recieverId',checkToken,senderMessage)
router.get('/getMessage/:recieverId',checkToken,getConversation)
router.delete('/delete/:recieverId',checkToken,DeleteConversation)
router.delete('/msgDelete/:messageId/:receiverId',checkToken,fetchSenderMessage)



module.exports = router