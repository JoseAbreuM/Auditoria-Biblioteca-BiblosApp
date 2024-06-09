const jwt= require('jsonwebtoken');
const bcryptjs= require('bcryptjs');
const conexion=require('../database/db')
const {promisify}=require('util')

//procedimiento para registrarnos
exports.register=async (req, res)=>{

    try {
      const name=  req.body.nya
      const user=  req.body.user
      const email=  req.body.email
      const pass=  req.body.pass
      const securityQuestion=req.body.securityQuestion
      const securityAnswer=req.body.securityAnswer
      let passHash=  await bcryptjs.hash(pass, 8)
      //console.log(passHash); 

      conexion.query('INSERT INTO usuarios SET ?', {
        Usuario: user,
        Nombre: name, 
        Correo: email,
        Clave: passHash,
        pregunta_seguridad: securityQuestion,
        respuesta_seguridad: securityAnswer
      }, (error, results)=>{
          if (error) {console.log(error);}
          res.redirect('/users/usuarios')
      })
    } catch (error) {
        console.log(error);
    }

     

}

exports.login =async (req, res )=>{
    try {
         const Usuario= req.body.Usuario
          const Clave= req.body.Clave

          if (!Usuario || !Clave) {
                  res.render('login', {
                        alert: true,
                        alertTitle: "Advertencia",
                        alertMessage: "Ingrese un usuario y contraseña",
                        alertIcon: "info",
                        showConfirmButton: true,
                        timer: 100000,
                        ruta: 'login'
                  })
          }else{
              conexion.query('SELECT * FROM usuarios WHERE Usuario = ?', [Usuario], async (error, results)=>{

                  if (results.length == 0 || !(await bcryptjs.compare(Clave, results[0].Clave))) {

                        res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Contraseña Incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer:100000,
                        ruta: 'login'
                  })
                  } else{
                      //inicio de sesion ok
                      const id= results[0].id
                      const token = jwt.sign({id:id}, process.env.JWT_SECRETO)

                      const cookieOptions={
                        //tiempo en el que expira la cookie, formula en la documentación 
                          expire: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000),
                          httpOnly:true
                      }
                      res.cookie('jwt', token, cookieOptions)
                      res.render('login', {
                        alert: true,
                        alertTitle: "Conexion Exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                      })
                  }
              })
          }
    } catch (error) {
        console.log(error);
    }

}

exports.isAuthenticated= async (req, res, next)=>{
  if (req.cookies.jwt) {
      try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO )

            conexion.query('SELECT * FROM usuarios WHERE id=?', [decodificada.id], (error, results)=>{
                if (!results) {return next()}
                req.Usuario= results[0]
                return next()

            } )

      } catch (error) {
          console.log(error);
          return next()
      }
  } else{
    res.redirect('/login');
  }

}

exports.resetPasswordPage = (req, res) => {
  res.render('resetPassword', {
    alert: false,
    alertTitle: '',
    alertMessage: '',
    alertIcon: '',
    showConfirmButton: false,
    timer: 0,
    ruta: ''
  });
};

exports.resetPass = async (req, res) => {
  try {
    const { Correo, securityQuestion, securityAnswer } = req.body;

    if (!Correo || !securityQuestion || !securityAnswer) {
      return res.render('resetPassword', {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese Correo, Pregunta y Respuesta de Seguridad",
        alertIcon: "info",
        showConfirmButton: true,
        timer: 100000,
        ruta: 'resetPassword'
      });
    }

    conexion.query('SELECT * FROM usuarios WHERE Correo = ?', [Correo], async (error, results) => {
      if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length == 0 || results[0].pregunta_seguridad !== securityQuestion || results[0].respuesta_seguridad !== securityAnswer) {
        return res.render('resetPassword', {
          alert: true,
          alertTitle: "Error",
          alertMessage: "Correo y/o Pregunta y/o Respuesta incorrectas",
          alertIcon: "error",
          showConfirmButton: true,
          timer: 100000,
          ruta: 'resetPassword'
        });
      } else {
        return res.render('resetPassword', {
          alert: true,
          alertTitle: "Validación Exitosa",
          alertMessage: "Ingrese su nueva contraseña",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 800,
          ruta: `resetPassword/newPassword?Correo=${Correo}`
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.newPasswordPage = (req, res) => {
  const { Correo } = req.query;
  res.render('newPassword', {
    Correo: Correo || '',
    alert: false,
    alertTitle: '',
    alertMessage: '',
    alertIcon: '',
    showConfirmButton: false,
    timer: 0,
    ruta: ''
  });
};


exports.updatePassword = async (req, res) => {
  try {
    const { Correo, newPassword } = req.body;

    if (!Correo || !newPassword) {
      return res.render('newPassword', {
        Correo,
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese la nueva contraseña",
        alertIcon: "info",
        showConfirmButton: true,
        timer: 100000,
        ruta: `resetPassword/newPassword?Correo=${Correo}`
      });
    }

    const passHash = await bcryptjs.hash(newPassword, 8);

    conexion.query('UPDATE usuarios SET Clave = ? WHERE Correo = ?', [passHash, Correo], (error, results) => {
      if (error) {
        console.error('Error updating password:', error);
        return res.status(500).send('Internal Server Error');
      }

      return res.redirect('/login')});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



exports.logout= (req, res)=>{
  res.clearCookie('jwt')
  return res.redirect('/')
}
