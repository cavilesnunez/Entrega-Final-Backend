import 'dotenv/config';

import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import userModel from '../models/users.model.js';


console.log("CLIENT_ID: ", process.env.GITHUB_CLIENT_ID); // Debería mostrar el Client ID
console.log("CLIENT_SECRET: ", process.env.GITHUB_CLIENT_SECRET); // Debería mostrar el Client Secret
console.log("CALLBACK_URL: ", process.env.GITHUB_CALLBACK_URL); // Debería mostrar la Callback URL


const initializePassport = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
      const { first_name, last_name, age } = req.body;
      try {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
          return done(null, false, { message: 'Email already registered.' });
        }
        const passwordHash = createHash(password);
        const newUser = await userModel.create({
          first_name,
          last_name,
          email,
          age,
          password: passwordHash,
        });
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use('login', new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user || !validatePassword(password, user.password)) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findOne({ githubId: profile.id });
      if (!user) {
        user = await userModel.create({
          first_name: profile.displayName || 'GitHub User',
          last_name: '',
          email: profile._json.email,
          githubId: profile.id,
          // Otras propiedades necesarias para tu modelo de usuario
        });
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
