const express = require('express');
const config = require('../../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db } = require('../database/db');

const router = express.Router();
const secretKey = config.SECRET_KEY; 

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const user = await db.oneOrNone('SELECT * FROM master_users WHERE email = $1', [email]);

        if (!user) {
            return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }

        // Verificar contraseña
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }

        // Preparar el payload del token
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: user.avatar,
            role: user.rol
        };

        // Generar token JWT
        const token = jwt.sign(tokenPayload, secretKey, {
            expiresIn: '1h' // El token expira en 1 hora
        });

        res.json({ 
            status: 200,
            token
         });

    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
