const express = require('express');
const {db} = require('../database/db');
const router = express.Router()
const {verifyToken} = require('../../middleware/middleware')

// Servicio POST para agregar una nueva consulta médica
router.post('/', verifyToken, async (req, res) => {
    try {
      const { fecha, tipo_documento, numero_documento, nombre, apellido, email, nacimiento, genero, telefono, direccion, referido } = req.body;

      // Verificar si el documento ya está registrado
      const checkQuery = 'SELECT * FROM registrations WHERE numero_documento = $1';
      const checkResult = await db.query(checkQuery, [numero_documento]);

      if (!checkResult || !checkResult || checkResult.length > 0) {
        return res.status(400).json({
            status: 400,
            message: 'El documento ya está registrado',
        });
      }

      const query = `
        INSERT INTO registrations(fecha, tipo_documento, numero_documento, nombre, apellido, email, nacimiento, genero, telefono, direccion, referido) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)        
      `
            
      const result = await db.none(query, [fecha, tipo_documento, numero_documento, nombre, apellido, email, nacimiento, genero, telefono, direccion, referido]);
      
      res.status(201).json({ 
        status: 201, 
        message: 'Registro médico dado de alta con éxito',        
      });
    } catch (error) {
      console.error('Error al dar de alta el registro médico:', error);
      res.status(500).json({ status: 500, message: 'Error interno del servidor' });
    }
});

module.exports = router;