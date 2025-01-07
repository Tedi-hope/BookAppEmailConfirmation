import express, { request, response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { emailConfig } from '../config.js';
import { jwtSecret } from '../config.js';

//For Sending emails
import nodemailer from 'nodemailer';

const router=express.Router();

//Route for using Sign up
router.post('/signup',async(request,response)=>{
    try{
        const {username, email, password}=request.body;

        //Check the username or email is already registered
        const existingUser=await User.findOne({$or:[{username},{email}] });
        if (existingUser){
            return response.status(400).json({message:'Username or email already exists'});
        }

        //Hash the password
        const hashedPassword=await bcrypt.hash(password, 10); //10 is salt number

        //create a new user
        const newUser=await User.create({
          username,
          email,
          password:hashedPassword,
          isConfirmed:false,
        });

        //Generate email confirmation token
        const token=jwt.sign({email:newUser.email},jwtSecret,{expiresIn:'1hr'});
        
        //Nodemailer setup
        const transporter=nodemailer.createTransport({
          host:emailConfig.host,//Use your email provider
          port:emailConfig.port,
          secure:false, //True for 465, false for other ports
          auth:{
            user:emailConfig.user,//Ensure you configure this in your environment variables
            pass:emailConfig.pass,
          },
        });
       
        console.log('After nodemailer is run!!!');
        //Update with your frontend URL
        const confirmURL=`https://bookappemailconfirmationserver.vercel.app/user/confirm/${token}`;

        //Send confirmation email
        await transporter.sendMail({
           to:newUser.email,
           Subject:'Email Confirmation',
           html:`<h2>Welcome To BooksStore App</h2>
                 <p>Please Confirm your email by clicking the link below:</p>
                 <a href="${confirmURL}">Confirm Email</a>`, 
        });

        //console.log(newUser);
        return response.status(201).json({message:'Signup Successful! Please confirm your email!!.'});
    
    }
    catch(error){
      console.log(error.message);
      response.status(500).send({message:error.message});
    }
});

//Email confirmation route
router.get('/confirm/:token',async(request,response)=>{
    const{ token }=request.params;

    try{
        //Verify the token
        const decoded=jwt.verify(token,'secretCode@backend');

        //Update user confirmation status
        const user=await User.findOneAndUpdate(
          {email:decoded.email},
          {isConfirmed:true},
          {new:true} 
        );

        if(!user){
            return response.status(404).send('User not found or already confirmed.!!');
        }

        response.status(200).send('Email Confirmed Successfully!');
    }
    catch(error){
        console.log(error);

        if(error.name==='TokenExpiredError'){
          return response.status(400).send('Token expired.Please request a new confirmation link.');
        }
        
        response.status(400).send('Invalid token');
    }
});

//Route for user Login

router.post('/login',async(request,response)=>{
    try{
        const {username, password}=request.body;

        //Find the user by username
        const user=await User.findOne({username});
        if(!user){
            //console.log("No user")
            return response.status(404).json({message:'User not found' });
        }
       
        //Check if the password is correct
        const passwordMatch=await bcrypt.compare(password,user.password);
        if (!passwordMatch){
            return response.status(401).json({message:'Invalid password'});
        }
        
         //Check if the email is confirmed
         if(!user.isConfirmed){
          //console.log("You havent confirmed yet!!!");
          return response.status(403).json({message:'Please confirm your email before logging in.!!'});
        }
        
        //Generate JWT token with userId included
        const token=jwt.sign({userId:user._id, isLogged:true}, 'secretCode@backend',{expiresIn:'1h'});
        return response.status(200).json({token,username:user.username});
    }
    catch(error){
       console.log(error);
       response.status(500).send({message:error.message});
    }
});

export default router