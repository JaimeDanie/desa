const express = require('express');
const {db} = require('../database/db');
const router = express.Router()
const {verifyToken} = require('../../middleware/middleware')

// Servicio GET para obtener todos los agentes
router.get('/', verifyToken, async (req, res) => {
    try {
      const consultations = await db.any('SELECT * FROM agents');
      
      if (consultations.length === 0) {
        return res.status(204).json({ status: 204, message: 'No hay registros' });
      }

      res.status(200).json({status: 200, data: consultations});
    } catch (error) {
      console.error('Error al obtener las consultas médicas:', error);
      res.status(500).json({status: 500, message: 'Error interno del servidor' });
    }
});

  module.exports = router;