const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

const {knexConfig, sessionSecretKey} = require('./config.js');
const knex = require('knex')( knexConfig );
const {v4: uuidv4} = require('uuid');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions);


const store = new KnexSessionStore( {
    knex,
});

const sessions_config =  sessions( {
    genid: (req)=>uuidv4(),
    secret: sessionSecretKey,
    rolling: true,
    saveUninitialized: true/*true*/,
    cookie:{
        maxAge: 24*60*60*1000,
        httpOnly: true/*true*/,
    },
    resave: false,
    store,
})

const app = express();
const admin_router = require('./routers/admin');
const user_router = require('./routers/user');


app.use( bodyParser.json() );
app.use( sessions_config );

// cors stuff
app.use((req, res, next)=>{
    console.log(`origin is : ${req.headers.origin}`);
    if (req.headers.origin){

        res.setHeader('Access-Control-Allow-Origin', req.headers.origin );
        res.setHeader('Access-Control-Allow-Credentials' , 'true' );
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type' );
    }

    next();                                 
});

// store knex object in req object, so that it can be passed down to handler files
app.use((req, res, next)=>{
    req.knex_object = knex;
    next();
});


// '/livechat'
app.use('/livechat/admin', admin_router );
app.use('/livechat/user', user_router );



app.listen(PORT, (req, res)=>{
    console.log("'Chatling' is active on port", PORT);
});