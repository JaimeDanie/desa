const bcrypt = require("bcrypt");
const { db } = require("./db.js"); //  importar archivo de conexión a pg-promise

const createMasterUsersTable = async () => {
  const query = `
        CREATE TABLE master_users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            avatar VARCHAR(255),
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            rol VARCHAR(255) NOT NULL            
        );
    `;

  try {
    await db.none(query);
    console.log("Tabla master_users creada con éxito");

    const defaultPassword = await bcrypt.hash("Admini2023@", 10);
    const insertDefaultUser = `
            INSERT INTO master_users (email, password, avatar, first_name, last_name, rol)
            VALUES ('dev@jaime.com', '${defaultPassword}', '/assets/avatars/avatar-carson-darrin.png', 'Jaime', 'Barros', 'Administrador');
        `;

    await db.none(insertDefaultUser);
    console.log("Usuario por defecto insertado con éxito");
  } catch (error) {
    console.error("Error al crear la tabla master_users:", error);
  }
};

const createMedicalConsultationsTable = async () => {
  const query = `
        CREATE TABLE medical_consultations(
            id SERIAL PRIMARY KEY,        
            fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,         
            tipo_documento VARCHAR(255) NOT NULL,
            numero_documento VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            apellido VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            nacimiento VARCHAR(255) NOT NULL,
            genero VARCHAR(255) NOT NULL,
            telefono VARCHAR(255) NOT NULL,        
            ciudad VARCHAR(255) NOT NULL,        
            direccion VARCHAR(255) NOT NULL,
            referido VARCHAR(255) NOT NULL,
            orden VARCHAR(255) NOT NULL
        );
    `;

  try {
    await db.none(query);
    console.log("Tabla medical_consultations creada con éxito");
  } catch (error) {
    console.error("Error al crear la tabla medical_consultations:", error);
  }
};

const createAgentsTable = async () => {
  const query = `
        CREATE TABLE agents(
            id SERIAL PRIMARY KEY,
            tipo_documento VARCHAR(255) NOT NULL,
            numero_documento VARCHAR(255) UNIQUE NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            telefono VARCHAR(255) NOT NULL
        );
    `;

  try {
    await db.none(query);
    console.log("Tabla Agentes creada con éxito");
  } catch (error) {
    console.error("Error al crear la tabla Agentes:", error);
  }
};

const createRegistrationTable = async () => {
  const query = `
        CREATE TABLE registrations(
            id SERIAL PRIMARY KEY,        
            fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,         
            tipo_documento VARCHAR(255) NOT NULL,
            numero_documento VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            apellido VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            nacimiento VARCHAR(255) NOT NULL,
            genero VARCHAR(255) NOT NULL,
            telefono VARCHAR(255) NOT NULL,                            
            direccion VARCHAR(255) NOT NULL,
            referido VARCHAR(255) NOT NULL            
        );
    `;

  try {
    await db.none(query);
    console.log("Tabla registrations creada con éxito");
  } catch (error) {
    console.error("Error al crear la tabla registrations:", error);
  }
};

createMasterUsersTable();
createMedicalConsultationsTable();
createAgentsTable();
createRegistrationTable();
