module.exports.initiateChat = (req, res)=>{
    // initiates a new livechat session

    try {
        // start livechat session
        console.log("Opening new chat session...");
        req.session.admin = false;
        console.log(req.session);
        console.log(req.sessionID);
    } catch (error) {
        console.log(error);
        res.status(401).json({status: 401, content: 'Error: There was an error in creating chat session.', error});    
    }
    res.status(201).json({status: 201, content: 'So far, so good.'});
}

module.exports.sendMessageToAdmin = (req, res)=>{
    // sends a message to admin
    console.log("Recieved message from user...");
    let sid = req.sessionID;
    let {message} = req.body;

    let knex = req.knex_object;
    knex.insert({sid, message, epoch_time : new Date().getTime()})
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

module.exports.getMessages = async (req, res)=>{
    // gets 20 messages from specified offset epoch time, for current user.
    // if offsetTime is not specified, a default offsetTime=0  would be used..
    let {offsetTime} = req.params || 0, sid = req.sessionID;

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

module.exports.closeChatSession = (req, res)=>{
    // closes chat of current user(identified by their session ID)
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.status(401).json({status: 401, content: "Error: Failed to close chat session."} );
        }
        res.status(201).json({status: 201, content: "Chat session closed."} );

    });
    
}