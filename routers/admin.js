const express = require('express');
const router = express.Router();
const {loginAsAdmin, getActiveChats, sendMessageToUser, getMessagesBySid, closeChatBySid, } = require('../handlers/adminHandler');

// This file handles all '/livechat/admin/*' routes.

const adminAuth = (req, res, next)=>{
    // Authenticate admin 
    console.log("Authenticating admin...");
    if (req.session.admin) {// current session has admin access privileges
        // 
        console.log("Admin authentication complete...");
        next();
    }else{
        res.status(401).json({status: 401, content: 'Authentication Error: Current user is not an admin.' });    
    }
}


router.post(
    '/login',
    loginAsAdmin
);

// adds authentication to all routes after it
router.use( adminAuth );


router.get(
    '/chats',
    getActiveChats
);

router.post(
    '/send/:sid',
    sendMessageToUser
);

router.get(
    '/messages/:sid/:offsetTime',
    getMessagesBySid
);

router.get('/close/:sid',
    closeChatBySid
);

module.exports = router;
