// Generar servidor (pruebas)
const express = require('express');
const dotenv= require('dotenv');
const cookieParser= require('cookie-parser');
const app = express();



// seteamos motor de plantillas
app.set('view engine', 'ejs')


//seteamos carpeta public para archivos estaticos
app.use(express.static('public'))

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos las variables del entorno
dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())


  //llamar al router
  app.use('/', require('./routes/router'))

  //Para eliminar el cache y que no se pueda volver con el boton de back luego de que cerramos sesion
  app.use(function(req, res, next) {
      if (!req.Usuario) {
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate' );
          next()
      }
  })


  app.listen(3000, ()=>{

    console.log('Server UP!');

  })
