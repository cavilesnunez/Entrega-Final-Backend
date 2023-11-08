import session from 'express-session';
// La siguiente línea importa la función generadora, no la invocas directamente aquí
import connectMongoDBSession from 'connect-mongodb-session';



// Ahora creas una instancia de MongoDBStore con la función generadora
const MongoDBStore = connectMongoDBSession(session);

export const setupSession = (app) => {
  const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions', // El nombre de la colección para las sesiones en MongoDB
  });

  // Manejar los errores del store
  store.on('error', function (error) {
    console.error('SESSION STORE ERROR:', error);
  });

  app.use(session({
    secret: 'este es un secreto muy seguro', // Reemplaza este texto con tu propio secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Establecer en true si estás usando https
  }));
};
