import mongoose from "mongoose";

const userSchema=mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        isConfirmed:{
            type:Boolean,
            default:false,//intially set to false until email confirmation
        }
    },
    {
        timestamps:true,
    }
);

export const User=mongoose.model('User',userSchema);