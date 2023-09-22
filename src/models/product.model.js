import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2'

//Schema del producto 
const productSchema = new Schema ({
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    stock: {
        required:true,
        type:Number
    },
    category: {
        required:true,
        type:String
    },
    status: {
        type:Boolean,
        default:true
    },
    code:{
        type:String,
        required:true,
        unique: true
    },
    thumbnails:[]
})

productSchema.plugin(paginate); //Plugin para poder utilizar paginate

const productModel = model ('products', productSchema);

export default productModel;