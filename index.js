require('dotenv').config(); //Importar dotenv
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express() //Crea una instancia de la aplicación express
const port = process.env.PORT;


//Importar CRONJOBS
require('./jobs/cronJobs');

//Importar modulos
const resgisterRouter = require('./routes/master-users/add-master-user');
const loginRouter = require('./routes/master-users/login');

const getMedicalConsultion = require('./routes/medical-consultions/get');
const postMedicalConsultion = require('./routes/medical-consultions/post');

const getAgents = require('./routes/agents/read')
const postAgents = require('./routes/agents/create')
const putAgents = require('./routes/agents/update')
const deleteAgents = require('./routes/agents/delete')

const getRegister = require('./routes/registrations/read')
const postRegiser = require('./routes/registrations/create')

//Agrega el middleware cors
app.use(cors());

// Configura el analizador de solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//middleware para analizar el cuerpo de las solicitudes POST en formato JSON
app.use(express.json());

// Configura las rutas de la aplicación
app.get('/', (req, res) => {
  res.send(`Ejecutando API en Puerto: ${port}`)
})

//Inicio sesión y Registrar usuario
app.use('/login', loginRouter);
app.use('/register', resgisterRouter);

app.use('/medical-consultion', getMedicalConsultion);
app.use('/medical-consultion', postMedicalConsultion);

app.use('/get-agents', getAgents);
app.use('/new-agents', postAgents);
app.use('/update-agents', putAgents);
app.use('/delete-agents', deleteAgents);

app.use('/get-register', getRegister);
app.use('/new-register', postRegiser);





app.listen(port, () => {
  console.log(`Ejecutando servidor admin en Puerto: ${port}`);  
});

