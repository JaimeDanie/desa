const express = require('express');
const { db } = require('../database/db');
const router = express.Router();
const { verifyToken } = require('../../middleware/middleware');

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;

        // Verificar si el usuario existe
        const checkQuery = 'SELECT * FROM agents WHERE id = $1';
        const checkResult = await db.query(checkQuery, [userId]);

        if (!checkResult || !checkResult || checkResult.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'El usuario no está registrado',
            });
        }

        const query = 'DELETE FROM agents WHERE id = $1';
        await db.query(query, [userId]);

        res.status(200).json({
            status: 200,
            message: 'Usuario eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor',
        });
    }
});

module.exports = router;