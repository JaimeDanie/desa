const express = require('express');
const {db} = require('../database/db');
const router = express.Router()
const {verifyToken} = require('../../middleware/middleware')

router.put('/:id', verifyToken, async(req, res) => {        
    try {
        const { nombre, email, telefono } = req.body;
        const userId = req.params.id;
        
        // Verificar si el documento existe
        const checkQuery = 'SELECT * FROM agents WHERE id = $1';
        const checkResult = await db.query(checkQuery, [userId]);
        console.log("Resultado de la consulta:", checkResult);


        if (!checkResult || !checkResult || checkResult.length === 0) {
          return res.status(404).json({
              status: 404,
              message: 'El documento no está registrado',
          });
        }           
    
        const query = `
          UPDATE agents 
          SET nombre = $1, email = $2, telefono = $3
          WHERE id = $4             
        `;
    
        const result = await db.none(query, [nombre, email, telefono, userId]);
    
        res.status(200).json({
          status: 200,
          message: 'Actualización de agente exitosa',                   
        });
      } catch (error) {
        console.error('Error al actualizar en la base de datos:', error);
        res.status(500).json({
          status: 500,
          message: 'Error interno del servidor',
        });
      }
});

module.exports = router;
