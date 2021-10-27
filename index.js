const express = require('express');
const { dbConnetion } = require('./database/config');
require('dotenv').config();


//console.log(process.env);

//crear el servidor de express

const app = express();

dbConnetion();

//Directorio Publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());


//Rutas
app.use('/api/auth',require('./routes/auth'));

//TODO:auth


//Escuchar peticiones
app.listen(process.env.PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}` );
})