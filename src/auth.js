export default function auth (req,res,next){
    const {email, password} = req.body
    console.log(email,password);

    if(email === "admin@admin.com" && password== "1234"){
        console.log("felicitaciones ingresaste correctamente", email)
        return res.redirect("/static/admin");

    }
    //en el caso de que no tenga acceso
    return next() //Continua con la ejecución normal de la ruta
}