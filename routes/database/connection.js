const pgp = require('pg-promise')();
const config = require('./db');

const db = pgp(config);

// Intentar conectarse a la base de datos
db.connect()
  .then(obj => {
    console.log('Conexión exitosa a la base de datos');
    obj.done(); // Liberar la conexión
  })
  .catch(error => {
    console.error('Error al conectar a la base de datos:', error);
});

module.exports = db;