const cron = require('node-cron');
const axios = require('axios');
const {db} = require('../routes/database/db');
const config = require('../config');
const sha512 = require('crypto-js/sha512');
const qs = require('qs');
const dayjs = require('dayjs');

const validatePaymentStatus = async (orden) => {
    const url = config.URL_PAYVALIDA;
    const merchant = config.MERCHANT;
    const fixedHash = config.FIXEDHASH;

    const checksumData = orden + merchant + fixedHash;
    const checksum = sha512(checksumData).toString();

    try {
        const response = await axios.get(url + orden, {
            params: {
                merchant: merchant,
                checksum: checksum
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al validar el estado de pago:", error);
        throw error;
    }
};

const getTokenDoctorOne = async () => {
    const url = config.URL_DOCTORONE+'/login';
    const email = config.USER_DOCTORONE;
    const password = config.PASS_DOCTORONE;

    const body = {
        email,
        password
    }
    const encodedBody = qs.stringify(body);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try {
        const response = await axios.post(url, encodedBody, {headers});
        console.log(response.data.access_token);
    } catch (error) {
        console.log(error)
    }
}

const adhesionesDoctorOne = async (token, ciudad, numero_documento, nombre, apellido, email, direccion, telefono, nacimiento, genero, fecha) => {
    const url = config.URL_DOCTORONE+'/adhesiones';
    const dateFormated = dayjs(fecha).format('YYYY-MM-DD');

    const bodyDoctorOne = [
        {
            "patCep": ciudad,
            "patNumberId": numero_documento,
            "patName": nombre,
            "patLastname": apellido,
            "patEmail": email,
            "patAaddress": direccion,
            "patPhone": telefono,
            "patBirthday": nacimiento,
            "patSex": genero,
            "patdateCreation": dateFormated,
            "patNumberIdTitular": "0"
        }
    ];

    const headersDoctorOne = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const responseDoctorOne = await axios.post(url, bodyDoctorOne, { headers: headersDoctorOne }); 
        console.log(responseDoctorOne)       
    } catch (error) {
        
    }
}

cron.schedule('*/15 * * * *', async () => {
    try {
        const result = await db.query('SELECT * FROM medical_consultations WHERE numero_documento NOT IN (SELECT numero_documento FROM registrations)');
        console.log('Resultado completo:', result.length);
        const consultations = result;        


        for (const consultation of consultations){
            const paymentStatus = await validatePaymentStatus(consultation.orden)
            console.log(paymentStatus)
            if(paymentStatus.DATA?.STATE === 'APROBADA'){
                console.log('Se agrega a la BBDD de DoctorOne')                
                // Verificar si ya existe un registro con el mismo numero_documento
                const existingRegistration = await db.query('SELECT * FROM registrations WHERE numero_documento = $1', [consultation.numero_documento]);

                if (existingRegistration.length === 0) {
                    // Si no hay registros existentes con el mismo numero_documento, inserta el nuevo registro
                    const token = getTokenDoctorOne()
                    adhesionesDoctorOne(token, consultation.ciudad, consultation.numero_documento, consultation.nombre, consultation.apellido, consultation.email, consultation.direccion, consultation.telefono, consultation.nacimiento, consultation.genero, consultation.fecha)
                    await db.query('INSERT INTO registrations(fecha, tipo_documento, numero_documento, nombre, apellido, email, nacimiento, genero, telefono, direccion, referido) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [consultation.fecha, consultation.tipo_documento, consultation.numero_documento, consultation.nombre, consultation.apellido, consultation.email, consultation.nacimiento, consultation.genero, consultation.telefono, consultation.direccion, consultation.referido]);
                } else {
                    console.log(`El registro con numero_documento ${consultation.numero_documento} ya existe en la tabla registrations.`);
                }
            }
        }
    } catch (error) {
        console.error("Error en el CRONJOB:", error);
    }
})