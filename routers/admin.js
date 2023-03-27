const express = require('express');
const router = express.Router();
const {ADMIN_KEY} = require('../config.js');
const {} = require('../handlers/adminHandler');

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
    (req, res)=>{
        // logs in as admin
        console.log("logging in as admin...");
        if (req.body.key === ADMIN_KEY) {
            req.session.admin = true;
            console.log("admin login successful.");
            res.status(201).json({status: 201, content: 'admin login successful.' });    

        } else {
            console.log("admin login failed.");
            res.status(401).json({status: 401, content: 'admin login failed.' });    
            
        }
    }
);

// adds authentication to all routes after it
router.use( adminAuth );


router.get(
    '/chats',
    async (req, res)=>{   
        let knex = req.knex_object;

        // lists all chats in active session(including their session IDs)
        try {
            let result = await knex.select().from('sessions').limit( 20 );
            result = result.filter( item => !(item.sess.admin));

            console.log(result);
            res.status(201).json({status: 201, content: result });

        } catch (error) {
            console.log(error);
            res.status(401).json({status: 401, content: 'Error: Failed to get chats.' });

        }
                
    }
);



router.post(
    '/send/:sid',
    (req, res)=>{
    // sends a message to current user specified by 'sid' params
    console.log("Recieved message from admin...");
    let {sid} = req.params;
    let {message} = req.body;

    let knex = req.knex_object;
    knex.insert({sid, message, epoch_time : new Date().getTime(), is_admin : true})
        .into('chats')
        .then((result)=>{
            console.log("Message sent successfully.");
            res.status(201).json({status: 201, content: "Message sent successfully."} );
        })
        .catch((err)=>{
            console.log(err);
            res.status(401).json({status: 401, content: 'Error: There was an error in sending the message.', err});    
        
        });
    }
);



router.get(
    '/messages/:sid/:offsetTime',
    async (req, res)=>{
        // gets 20 messages from specified offset epoch time, for current user specified by 'sid' params.
        // if offset is not specified, a default offsetTime=0  would be used.
        let {offsetTime} = req.params || 0, sid = req.params;

        let knex = req.knex_object;

        try {
            let result = await knex.select().from('chats').where('sid', sid).andWhere('epoch_time','>',offsetTime).limit( 20 );

            console.log(result);
            res.status(201).json({status: 201, content: result });

        } catch (error) {
            console.log(error);
            res.status(401).json({status: 401, content: 'Error: Failed to get chats.' });

        }
        
    }
);
router.get('/close/:sid',
    (req, res)=>{
        // closes chat of current user specified by 'sid' params
    }
);

module.exports = router;
