import express, { request, response } from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js'
import userRoute from './routes/userRoute.js';
import cors from 'cors';

const app=express();


//Data have to be converted from JSON to javascript object
//Middleware  to parse request body
app.use(express.json());

//Middleware for handling CORS POLICY
//Allow all Origins with defalut of cors(*)
app.use(cors());

app.get('/',(request,response)=>{
    //console.log(request);
    return response.status(234).send('Welcome to MERN stack tutorial An assignment to retrieve specific book (React,Nodejs and MongoDB)');
});

app.use(express.urlencoded({extended:true}))  //Add this two lines of code to handle the image upload
app.use("/uploads",express.static("uploads"))

app.use('/books',booksRoute);

//middleware for user root
app.use('/user',userRoute);

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log('App connected to database');
        app.listen(PORT,()=>{
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((err)=>{console.log(err);  });