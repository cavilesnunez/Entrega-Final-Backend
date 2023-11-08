import express from 'express';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupExpress = (app) => {
  app.engine('handlebars', engine({
      defaultLayout: 'main',
      layoutsDir: path.join(__dirname, '../views/layouts'),
      partialsDir: path.join(__dirname, '../views/partials')
  }));
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, '../views'));

  app.use(express.static('public'));
  app.use(express.json());
  app.use(cookieParser(process.env.SIGNED_COOKIE));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
};
