import dotenv from 'dotenv';

// Carga las variables de entorno desde .env
dotenv.config();

const config = {
  mongoUrl: process.env.MONGO_URL,
  sessionSecret: process.env.SESSION_SECRET,
  signedCookie: process.env.SIGNED_COOKIE,
  salt: parseInt(process.env.SALT, 10), // Asegúrate de convertir la cadena a número
  appId: process.env.APP_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackUrl: process.env.CALLBACK_URL,
  port: process.env.PORT || 4000 // Valor por defecto en caso de que PORT no esté definido
};




export default config;
