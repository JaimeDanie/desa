const express = require('express');
const {db} = require('../database/db');
const router = express.Router()
const {verifyToken} = require('../../middleware/middleware')

router.post('/', verifyToken, async(req, res) => {        
    try {
        const { tipo_documento, numero_documento, nombre, email, telefono } = req.body;

        // Verificar si el documento ya está registrado
        const checkQuery = 'SELECT * FROM agents WHERE numero_documento = $1';
        const checkResult = await db.query(checkQuery, [numero_documento]);

        if (!checkResult || !checkResult || checkResult.length > 0) {
            return res.status(400).json({
                status: 400,
                message: 'El documento ya está registrado',
            });
        }
    
        const query = `
          INSERT INTO agents (tipo_documento, numero_documento, nombre, email, telefono)
          VALUES ($1, $2, $3, $4, $5)            
        `;
    
        const result = await db.none(query, [tipo_documento, numero_documento, nombre, email, telefono]);
    
        res.status(201).json({
          status: 201,
          message: 'Registro de agente éxitoso',              
        });
      } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).json({
          status: 500,
          message: 'Error interno del servidor',
        });
      }
});

module.exports = router;