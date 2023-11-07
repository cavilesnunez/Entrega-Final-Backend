import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';

export const setupSession = (app) => {
  const MongoDBSessionStore = MongoDBStore(session);

  const store = new MongoDBSessionStore({
      uri: process.env.MONGO_URL,
      collection: "session",
  });

  app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: { 
          secure: false, 
          maxAge: 60000
      }
  }));
};
