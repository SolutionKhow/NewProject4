const bodyParser = require('body-parser');
const { application } = require('express');
const express=require('express');


const connectDB=require('./config/db');
const app=express();


//connect database

connectDB();

//Init middleware:

app.use(bodyParser.json({extended :false}));



app.get('/',(req,res)=>{res.send('API Running')});

//Define route

app.use('/api/users',require('./routes/api/users'));
app.use('/api/posts',require('./routes/api/posts'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/auth',require('./routes/api/auth'));


const PORT=process.env.PORT||5000;
app.listen(5000,(req,res)=>{
    console.log(`server started in ${PORT}`);

    
});