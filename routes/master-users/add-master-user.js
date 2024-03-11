const express = require('express');
const {db} = require('../database/db');
const bcrypt = require('bcrypt');
const router = express.Router()
const {verifyToken} = require('../../middleware/middleware')


const Yup = require('yup');

const userSchema = Yup.object().shape({
    email: Yup.string().email('Debe ser un email válido').required('El email es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    avatar: Yup.string().required('El avatar es obligatorio'),
    name: Yup.string().required('El nombre es obligatorio')
});

const saltRounds = 10;

async function registerUser(email, plainPassword, avatar, name) {
    try {
        // Encripta la contraseña
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // Consulta SQL para insertar el nuevo usuario
        const query = `
            INSERT INTO master_users (email, password, avatar, name)
            VALUES ($1, $2, $3, $4);
        `;

        // Ejecuta la consulta
        await db.none(query, [email, hashedPassword, avatar, name]);

        console.log("Usuario registrado con éxito");
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
    }
}

router.post('/', verifyToken, async (req, res) => {
    try {
        const userData = req.body;

        // Validar los datos recibidos con el esquema
        await userSchema.validate(userData);
        const { email, password, avatar, name } = userData;

        // Validar si el email ya existe en la base de datos
        const existingUser = await db.oneOrNone('SELECT * FROM master_users WHERE email = $1', [email]);

        if (existingUser) {
            return res.status(400).send({
                status: 400,
                error: 'El email ya está registrado.'
            });
        }

        // Si el email no existe, procedemos a registrar el usuario
        await registerUser(email, password, avatar, name);

        res.status(200).send({
            status: 200,
            message: 'Usuario registrado con éxito'
        });
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            // Si es un error de validación, envía un mensaje específico
            res.status(400).send({ status: 400, error: error.message });
        } else {
            res.status(500).send({ error: 'Error al registrar el usuario' });
        }
    }
});




module.exports = router;