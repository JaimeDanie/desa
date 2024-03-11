const pgp = require("pg-promise")();
const config = require("../../config");

const db = pgp({
  user: config.RDS_USERNAME,
  host: config.RDS_HOSTNAME,
  database: config.RDS_DB_NAME,
  password: config.RDS_PASSWORD,
  port: config.RDS_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then((resp) => console.log("CONECTADO A BD"))
  .catch((e) => console.error("ERROR===>", e));

module.exports = { db };
