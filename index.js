const dotenv=require('dotenv')
const express=require('express')
const app=express();
const cors=require('cors')
const db=require('./database/db');
const login=require('./routes/login');
const signup=require('./routes/signup');
const post=require('./routes/post');
const user=require('./routes/user');

app.use(cors());

dotenv.config({path:"./.env"});

app.use(express.json());


// Initializing Database
db()


// Routes
app.use('/api',signup);
app.use('/api',login);
app.use('/api',post);
app.use('/api',user);

app.listen(4000,()=>{
    console.log(`Listening on port 4000`)
})



