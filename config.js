require("dotenv").config();
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  RDS_DB_NAME: process.env.RDS_DB_NAME,
  RDS_HOSTNAME: process.env.RDS_HOSTNAME,
  RDS_PASSWORD: process.env.RDS_PASSWORD,
  RDS_PORT: process.env.RDS_PORT,
  RDS_USERNAME: process.env.RDS_USERNAME,

  SECRET_KEY: process.env.SECRET_KEY,

  URL_PAYVALIDA: process.env.URL_PAYVALIDA,
  MERCHANT: process.env.MERCHANT,
  FIXEDHASH: process.env.FIXEDHASH,

  URL_DOCTORONE: process.env.URL_DOCTORONE,
  USER_DOCTORONE: process.env.USER_DOCTORONE,
  PASS_DOCTORONE: process.env.PASS_DOCTORONE,
};
