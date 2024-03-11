const express = require('express');
const {db} = require('../database/db');
const router = express.Router()
const {verifyToken} = require('../../middleware/middleware')

// Servicio POST para agregar una nueva consulta médica
router.post('/', verifyToken, async (req, res) => {
    try {
      const { fecha, tipo_documento, numero_documento, nombre, apellido, email, nacimiento, genero, telefono, ciudad, direccion, referido, orden } = req.body;

      const query = `
        INSERT INTO medical_consultations(fecha, tipo_documento, numero_documento, nombre, apellido, email, nacimiento, genero, telefono, ciudad, direccion, referido, orden) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)        
      `
            
      const result = await db.none(query, [fecha, tipo_documento, numero_documento, nombre, apellido, email, nacimiento, genero, telefono, ciudad, direccion, referido, orden]);
      
      res.status(201).json({ 
        status: 201, 
        message: 'Consulta médica agregada con éxito',        
      });
    } catch (error) {
      console.error('Error al agregar la consulta médica:', error);
      res.status(500).json({ status: 500, message: 'Error interno del servidor' });
    }
});

module.exports = router;