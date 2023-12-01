// Importa el modelo de usuario
import 'dotenv/config';
import userModel from '../models/users.model.js';

// Importa el módulo de cifrado de contraseñas
import { randomBytes } from 'crypto';
import { createTransport } from 'nodemailer';
import { compare, hash } from 'bcrypt';

const passwordController = {
    forgotPassword: async (req, res) => {
        try {
            // Busca al usuario por email usando el modelo de usuario
            const user = await userModel.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).send('No user found with that email address.');
            }

            // Genera el token de reinicio de contraseña
            const token = randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

            // Guarda el usuario con el token y la fecha de caducidad
            await user.save();

            // Configura el transporte para el envío de correos electrónicos
            const transporter = createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER, // Usa la variable de entorno
                    pass: process.env.EMAIL_PASS  // Usa la variable de entorno
                }
            });

            console.log('Email:', process.env.EMAIL_USER);
            console.log('Password:', process.env.EMAIL_PASS);


            // Configura las opciones del correo electrónico
            const mailOptions = {
                to: user.email,
                from: 'your-email@example.com',
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                       Please click on the following link, or paste this into your browser to complete the process:\n\n
                       http://${req.headers.host}/reset/${token}\n\n
                       If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            // Envía el correo electrónico
            await transporter.sendMail(mailOptions);
            res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    resetPassword: async (req, res) => {
        try {
            // Busca al usuario por el token de reinicio y verifica que no haya expirado
            const user = await userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).send('Password reset token is invalid or has expired.');
            }

            // Comprueba que la nueva contraseña sea diferente a la anterior
            if (await compare(req.body.password, user.password)) {
                return res.status(400).send('New password must be different from the current password.');
            }

            // Encripta la nueva contraseña y actualiza el usuario
            const hashedPassword = await hash(req.body.password, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Guarda el usuario actualizado
            await user.save();
            res.status(200).send('Your password has been updated.');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

export default passwordController;
