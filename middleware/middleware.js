const jwt = require('jsonwebtoken');
const config = require('../config');
const secretKey = config.SECRET_KEY;

function verifyToken(req, res, next) {
// Verificar si el header de autorización existe
  if (!req.headers.authorization) {
    return res.status(401).json({ status: 401, message: 'No se proporcionó un token' });
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 401, message: 'No se proporcionó un token' });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.log('Error al verificar token:', error);
      return res.status(401).json({ status: 401, message: 'Token inválido' });
    }

    console.log('Token decodificado:', decoded);

    req.userId = decoded.userId;
    next();
  });
}


module.exports = {
    verifyToken
}