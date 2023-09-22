import { Router } from "express";
import { userModel } from "../models/users.model.js";

const userRouter = Router();

/* userRouter.get('/', async(req,res)=>{
    try {
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send({error:"Error al consultar por el usuario",error});
    }
}) */

userRouter.post('/register', async(req,res)=>{
    try {
        const {first_name,lastname,email,password,age} = req.body

        const resultado = await userModel.create({
            first_name,lastname,email,password,age})
        if(resultado){
            res.redirect('/static/products', 200, { mensaje: 'Usuario creado', respuesta: first_name });
            res.status(200).send({resultado:'Usuario creado correctamente'}) 
        } 
    } catch (error) {
        res.status(400).send({error:'Error al crear el usuario:',error}) 
    }
})

export default userRouter;