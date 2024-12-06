const express = require('express');
const { senderMessage, getConversation, DeleteConversation } = require('../controllers/messageControllers');
const checkToken = require('../middleware/checkToken');
const router = express.Router();

router.post('/send/:recieverId',checkToken,senderMessage)
router.get('/getMessage/:recieverId',checkToken,getConversation)
router.delete('/delete/:recieverId',checkToken,DeleteConversation)



module.exports = router