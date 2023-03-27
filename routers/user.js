const express = require('express');
const router = express.Router();
const { initiateChat, sendMessageToAdmin, getMessages, closeChatSession } = require('../handlers/userHandler');


// This file handles all '/livechat/user/*' routes.

router.get('/initiate', initiateChat );

router.post('/send', sendMessageToAdmin );

router.get('/messages/:offsetTime', getMessages );

router.get('/close', closeChatSession );


module.exports = router;
