import { Schema, model } from "mongoose";

//Definición de mi esquema de datos
const userSchema = new Schema({
    first_name: {
        required:true,
        type:String,
    },
    lastname:{
        required:true,
        type:String,
    },
    email: {
        required:true,
        type:String,
        index:true,
        unique: true
    },
    password:{
        required:true,      
        type:String,
    },
    rol:{
        type:String,
        default:'user'
    },
    age:{
        required:true,
        type:Number,
    }
})

export const userModel = model('users',userSchema)//Defino mi modelo con un nombre y el Schema