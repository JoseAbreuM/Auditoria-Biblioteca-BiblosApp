const express = require('express');
const router=express.Router()
const conexion= require('../database/db')
const authController =require('../controllers/authController')
const moment=require('moment');

// router para las vistas
router.get('/', authController.isAuthenticated, (req, res)=>{
  res.render('index', {Usuario:req.Usuario})
})
router.get('/login', (req, res)=>{
  res.render('login', {alert:false})
})
router.get('/register', authController.isAuthenticated, (req, res)=>{
  res.render('register')
})

router.get('/resetPassword', authController.resetPasswordPage);
router.get('/resetPassword/newPassword', authController.newPasswordPage);

router.get('/getSecurityQuestion', authController.getSecurityQuestion);

router.get('/reports/reportes', authController.isAuthenticated, (req, res)=>{
  res.render('reports/reportes')
})
router.get('/settings/ajustes', authController.isAuthenticated, (req, res)=>{
  res.render('settings/ajustes')
})


/////////////////////////////////////////MODULO LIBROS////////////////////////////////////

//Mostrar modulo de libros
router.get('/books/libros', authController.isAuthenticated, (req, res) => {
  conexion.query('SELECT * FROM libro', (error, results) => {
    if (error) {
      throw error;
    } else {
      // Iterar sobre cada libro y actualizar el estado según la cantidad
      results.forEach((libro) => {
        let nuevoEstado = libro.Cantidad === 0 ? 'Agotado' : 'Disponible';
        
        if (libro.Estado !== nuevoEstado) {
          // Solo actualizar si el estado ha cambiado
          const updateQuery = 'UPDATE libro SET Estado = ? WHERE id = ?';
          conexion.query(updateQuery, [nuevoEstado, libro.id], (error) => {
            if (error) {
              console.error('Error updating book status:', error);
            }
          });
        }
      });

      // Después de asegurarnos de que los estados están actualizados, renderizar los resultados
      res.render('books/libros', { results: results });
    }
  });
});

//Ruta para crear registro de libros
router.get('/books/create', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
  res.render('books/create');
})
//Ruta para editar registros de Libros 
router.get('/books/edit/:id', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
  const id= req.params.id;
  conexion.query('SELECT * FROM libro WHERE id=?', [id], (error, results)=>{
     if (error) {
          throw error
      }else{
        res.render('books/edit', {libros:results[0]})
      }
  })
})
//RUTA PARA ELIMINAR EL REGISTRO DE LIBROS
router.get('/books/delete/:id', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
     const id= req.params.id;
    conexion.query('DELETE  FROM libro WHERE id=? ', [id], (error, results)=>{
     if (error) {
          throw error
      }else{
        res.redirect('../../books/libros')
      }
  })

})

/**************************MODULO USUARIO******************************/

//Mostrar modulo de usuarios
router.get('/users/usuarios', authController.isAuthenticated, (req, res)=>{
  
  conexion.query('SELECT * FROM usuarios', (error, results)=>{
      if (error) {
          throw error
      }else{
        res.render('users/usuarios', {results:results})
      }
  })
})

//RUTA PARA ELIMINAR USUARIO
router.get('/users/delete/:id', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
     const id= req.params.id;
    conexion.query('DELETE  FROM usuarios WHERE id=? ', [id], (error, results)=>{
     if (error) {
          throw error
      }else{
        res.redirect('../../users/usuarios')
      }
  })

})

//RUTA PARA EDITAR USUARIO
router.get('/users/edit/:id', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
  const id= req.params.id;
  conexion.query('SELECT * FROM usuarios WHERE id=?', [id], (error, results)=>{
     if (error) {
          throw error
      }else{
        res.render('users/edit', {usuario:results[0]})
      }
  })
})

/*******************************MODULO PROFESORES***************************/

//Mostrar modulo de  Profesores
router.get('/teachers/profesores', authController.isAuthenticated, (req, res)=>{
  
  conexion.query('SELECT * FROM profesor', (error, results)=>{
      if (error) {
          throw error
      }else{
        res.render('teachers/profesores', {results:results})
      }
  })
})
//Ruta para crear registro de Profesor
router.get('/teachers/create', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
  res.render('teachers/create');
})

/*******************************MODULO ESTUDIANTES***************************/

//Mostrar modulo de  eSTUDIANTES
router.get('/students/estudiantes', authController.isAuthenticated, (req, res)=>{
  
  conexion.query('SELECT * FROM estudiante', (error, results)=>{
      if (error) {
          throw error
      }else{
        res.render('students/estudiantes', {results:results})
      }
  })
})
//Ruta para crear registro de Profesor
router.get('/students/create', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
  res.render('students/create');
})

/*******************************MODULO P. ADMINISTRATIVO***************************/

//Mostrar modulo de  PERSONAL ADMINISTRATIVO
router.get('/apersonal/padministrativo', authController.isAuthenticated, (req, res)=>{
  
  conexion.query('SELECT * FROM personal_admin', (error, results)=>{
      if (error) {
          throw error
      }else{
        res.render('apersonal/padministrativo', {results:results})
      }
  })
})
//Ruta para crear registro de Profesor
router.get('/apersonal/create', authController.isAuthenticated, authController.checkGuest, (req, res)=>{
  res.render('apersonal/create');
})

// /////////////////////////////////MODULO PRESTAMOS///////////////////////////

// ---------------------MOSTRAR MODULO PRESTAMOS------------------------
router.get('/loans/prestamos', authController.isAuthenticated, (req, res) => {
    function getData(callback) {
        let librosArray, profesArray, estudiantesArray, padminArray, prestamoArray;

        conexion.query('SELECT * FROM libro', (error, results) => {
            if (error) throw error;
            librosArray = results;

            conexion.query('SELECT * FROM profesor', (error, results) => {
                if (error) throw error;
                profesArray = results;

                conexion.query('SELECT * FROM estudiante', (error, results) => {
                    if (error) throw error;
                    estudiantesArray = results;

                    conexion.query('SELECT * FROM personal_admin', (error, results) => {
                        if (error) throw error;
                        padminArray = results;

                        conexion.query('SELECT * FROM prestamo', (error, results) => {
                            if (error) throw error;
                            prestamoArray = results;

                            callback({
                                librosArray,
                                profesArray,
                                estudiantesArray,
                                padminArray,
                                prestamoArray
                            });
                        })
                    })
                })
            })
        })
    }

    let resultArray = [];

    procesarPrestamos = (data) => {
        let { librosArray, profesArray, estudiantesArray, padminArray, prestamoArray } = data;

        prestamoArray.forEach(prestamo => {
            let libro = librosArray.find(libro => libro.id === prestamo.id_libro);
            let tituloLibro = libro ? libro.Titulo : 'Libro no encontrado';

            let nombreSolicitante = 'Solicitante no encontrado';
            if (prestamo.tipo_solicitante === 'Estudiante') {
                let estudiante = estudiantesArray.find(estudiante => estudiante.CI === prestamo.ci_Estudiante);
                nombreSolicitante = estudiante ? estudiante.Nombre : nombreSolicitante;
            } else if (prestamo.tipo_solicitante === 'Profesor') {
                let profesor = profesArray.find(profesor => profesor.CI === prestamo.ci_Profesor);
                nombreSolicitante = profesor ? profesor.Nombre : nombreSolicitante;
            } else if (prestamo.tipo_solicitante === 'Personal Administrativo') {
                let personal_admin = padminArray.find(personal_admin => personal_admin.CI === prestamo.ci_Padministrativo);
                nombreSolicitante = personal_admin ? personal_admin.Nombre : nombreSolicitante;
            }

            let nuevoObjeto = {
                id_prestamo: prestamo.id,
                id_libro: prestamo.id_libro,
                cantidad: prestamo.Cantidad,
                titulo_libro: tituloLibro,
                tipo_solicitante: prestamo.tipo_solicitante,
                nombre_solicitante: nombreSolicitante,
                fecha_prestamo: moment(prestamo.Fecha_prestamo).format('DD/MM/YYYY'),
                fecha_entrega: moment(prestamo.Fecha_devolucion).format('DD/MM/YYYY'),
                estado: prestamo.Estado
            };

            // Añadir solo las cédulas que no son nulas
            if (prestamo.tipo_solicitante === 'Estudiante' && prestamo.ci_Estudiante) {
                nuevoObjeto.ci = prestamo.ci_Estudiante;
            }
            if (prestamo.tipo_solicitante === 'Profesor' && prestamo.ci_Profesor) {
                nuevoObjeto.ci = prestamo.ci_Profesor;
            }
            if (prestamo.tipo_solicitante === 'Personal Administrativo' && prestamo.ci_Padministrativo) {
                nuevoObjeto.ci = prestamo.ci_Padministrativo;
            }

            // Verificar si el préstamo está atrasado
            const fechaDevolucion = new Date(prestamo.Fecha_devolucion);
            const fechaActual = new Date();

            if (prestamo.Estado === 'En Proceso' && fechaDevolucion < fechaActual) {
                nuevoObjeto.estado = 'Atrasado';
                prestamo.Estado = 'Atrasado'; // Actualizar el estado en la base de datos

                // Actualizar el estado del solicitante
                if (prestamo.tipo_solicitante === 'Estudiante' && prestamo.ci_Estudiante) {
                    conexion.query('UPDATE estudiante SET Estado = ? WHERE CI = ?', ['Sancionado', prestamo.ci_Estudiante], (error, results) => {
                        if (error) console.log(error);
                    });
                }
                if (prestamo.tipo_solicitante === 'Profesor' && prestamo.ci_Profesor) {
                    conexion.query('UPDATE profesor SET Estado = ? WHERE CI = ?', ['Sancionado', prestamo.ci_Profesor], (error, results) => {
                        if (error) console.log(error);
                    });
                }
                if (prestamo.tipo_solicitante === 'Personal Administrativo' && prestamo.ci_Padministrativo) {
                    conexion.query('UPDATE personal_admin SET Estado = ? WHERE CI = ?', ['Sancionado', prestamo.ci_Padministrativo], (error, results) => {
                        if (error) console.log(error);
                    });
                }

                // Actualizar el estado del préstamo en la base de datos
                conexion.query('UPDATE prestamo SET Estado = ? WHERE id = ?', ['Atrasado', prestamo.id], (error, results) => {
                    if (error) console.log(error);
                });
            }

            resultArray.push(nuevoObjeto);
        });
        return resultArray;
    }

    function main() {
        getData((data) => {
            let resultArray = procesarPrestamos(data);

            res.render('loans/prestamos', { resultsArray: resultArray })
        });
    }

    main();
});

// RUTA PARA CULMINAR PRESTAMO
router.get('/loans/culminate/:id', (req, res) => {
  const id = req.params.id;

  // Primero, obtener la cantidad prestada, el id del libro y el estado actual del préstamo
  const getLoanQuery = 'SELECT id_libro, Cantidad, Estado FROM prestamo WHERE id = ?';
  conexion.query(getLoanQuery, [id], (error, loanResults) => {
    if (error) {
      console.error('Error fetching loan:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (loanResults.length === 0) {
      res.status(400).send('Préstamo no encontrado');
      return;
    }

    const prestamo = loanResults[0];
    const idLibro = prestamo.id_libro;
    const cantidadPrestada = prestamo.Cantidad;
    const estadoActual = prestamo.Estado;

    // Determinar el nuevo estado del préstamo
    let nuevoEstado = 'Finalizado';
    if (estadoActual === 'Atrasado') {
      nuevoEstado = 'Recibido con Retraso';
    }

    // Actualizar el estado del préstamo
    const updateLoanQuery = 'UPDATE prestamo SET Estado = ? WHERE id = ?';
    conexion.query(updateLoanQuery, [nuevoEstado, id], (error, results) => {
      if (error) {
        console.error('Error updating loan:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Sumar la cantidad prestada a la cantidad del libro
      const updateBookQuery = 'UPDATE libro SET Cantidad = Cantidad + ? WHERE id = ?';
      conexion.query(updateBookQuery, [cantidadPrestada, idLibro], (error, results) => {
        if (error) {
          console.error('Error updating book:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        console.log('Libro actualizado:', results);
        res.redirect('/loans/prestamos');
      });
    });
  });
});


//Ruta para crear registro de prestamo
router.get('/loans/create', authController.isAuthenticated, authController.checkGuest, (req, res) => {
  res.render('loans/create');
});


router.get('/data/libros', (req, res) => {
  conexion.query('SELECT * FROM libro', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/data/estudiantes', (req, res) => {
  conexion.query('SELECT * FROM estudiante', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/data/profesores', (req, res) => {
  conexion.query('SELECT * FROM profesor', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

router.get('/data/personalAdmin', (req, res) => {
  conexion.query('SELECT * FROM personal_admin', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// RUTA PARA ELIMINAR PRESTAMO
router.get('/loans/delete/:id', authController.isAuthenticated, authController.checkGuest, (req, res) => {
  const id = req.params.id;

  // Primero, obtener el estado del préstamo y la cantidad prestada junto con el ID del libro y los datos del solicitante
  const getLoanQuery = 'SELECT id_libro, Cantidad, Estado, tipo_solicitante, ci_Estudiante, ci_Profesor, ci_Padministrativo FROM prestamo WHERE id = ?';
  conexion.query(getLoanQuery, [id], (error, loanResults) => {
    if (error) {
      console.error('Error fetching loan:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (loanResults.length === 0) {
      res.status(400).send('Préstamo no encontrado');
      return;
    }

    const prestamo = loanResults[0];
    const idLibro = prestamo.id_libro;
    const cantidadPrestada = prestamo.Cantidad;
    const estadoPrestamo = prestamo.Estado;
    const tipoSolicitante = prestamo.tipo_solicitante;
    const ciEstudiante = prestamo.ci_Estudiante;
    const ciProfesor = prestamo.ci_Profesor;
    const ciPadmin = prestamo.ci_Padministrativo;

    if (estadoPrestamo === 'En Proceso') {
      // Si el estado del préstamo es 'En Proceso', sumar la cantidad prestada a la cantidad del libro
      const updateBookQuery = 'UPDATE libro SET Cantidad = Cantidad + ? WHERE id = ?';
      conexion.query(updateBookQuery, [cantidadPrestada, idLibro], (error, results) => {
        if (error) {
          console.error('Error updating book:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Luego, eliminar el préstamo
        const deleteLoanQuery = 'DELETE FROM prestamo WHERE id = ?';
        conexion.query(deleteLoanQuery, [id], (error, results) => {
          if (error) {
            console.error('Error deleting loan:', error);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/loans/prestamos');
        });
      });
    } else if (estadoPrestamo === 'Atrasado' || estadoPrestamo === 'Recibido con Retraso') {
      // Actualizar el estado del solicitante a 'Activo'
      let updateSolicitanteQuery = '';
      let ciSolicitante = '';

      if (tipoSolicitante === 'Estudiante') {
        updateSolicitanteQuery = 'UPDATE estudiante SET Estado = ? WHERE CI = ?';
        ciSolicitante = ciEstudiante;
      } else if (tipoSolicitante === 'Profesor') {
        updateSolicitanteQuery = 'UPDATE profesor SET Estado = ? WHERE CI = ?';
        ciSolicitante = ciProfesor;
      } else if (tipoSolicitante === 'Personal Administrativo') {
        updateSolicitanteQuery = 'UPDATE personal_admin SET Estado = ? WHERE CI = ?';
        ciSolicitante = ciPadmin;
      }

      conexion.query(updateSolicitanteQuery, ['Activo', ciSolicitante], (error, results) => {
        if (error) {
          console.error('Error updating solicitante:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Si el estado del préstamo es 'Atrasado', también sumar la cantidad prestada a la cantidad del libro
        if (estadoPrestamo === 'Atrasado') {
          const updateBookQuery = 'UPDATE libro SET Cantidad = Cantidad + ? WHERE id = ?';
          conexion.query(updateBookQuery, [cantidadPrestada, idLibro], (error, results) => {
            if (error) {
              console.error('Error updating book:', error);
              res.status(500).send('Internal Server Error');
              return;
            }

            // Luego, eliminar el préstamo
            const deleteLoanQuery = 'DELETE FROM prestamo WHERE id = ?';
            conexion.query(deleteLoanQuery, [id], (error, results) => {
              if (error) {
                console.error('Error deleting loan:', error);
                res.status(500).send('Internal Server Error');
                return;
              }

              res.redirect('/loans/prestamos');
            });
          });
        } else {
          // Si el estado del préstamo es 'Recibido con Retraso', solo eliminar el préstamo
          const deleteLoanQuery = 'DELETE FROM prestamo WHERE id = ?';
          conexion.query(deleteLoanQuery, [id], (error, results) => {
            if (error) {
              console.error('Error deleting loan:', error);
              res.status(500).send('Internal Server Error');
              return;
            }

            res.redirect('/loans/prestamos');
          });
        }
      });
    } else {
      // Si el estado del préstamo no es 'En Proceso', 'Atrasado', o 'Recibido con Retraso', simplemente eliminar el préstamo
      const deleteLoanQuery = 'DELETE FROM prestamo WHERE id = ?';
      conexion.query(deleteLoanQuery, [id], (error, results) => {
        if (error) {
          console.error('Error deleting loan:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.redirect('/loans/prestamos');
      });
    }
  });
});

// Ruta para editar registros de Préstamos
router.get('/loans/edit/:id', authController.isAuthenticated, authController.checkGuest, (req, res) => {
  const id = req.params.id;
  conexion.query('SELECT * FROM prestamo WHERE id = ?', [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render('loans/edit', { prestamo: results[0] });
    }
  });
});


////////////////////////////////////MODULO SANCIONES/////////////////////////////////
router.get('/fines/sanciones', (req, res) => {
    const moment = require('moment'); // Asegúrate de tener moment.js instalado y requerido

    function getData(callback) {
        let sancionesArray, prestamosArray, profesArray, estudiantesArray, padminArray;

        // Obtener sanciones
        conexion.query('SELECT * FROM sancion', (error, results) => {
            if (error) throw error;
            sancionesArray = results;

            // Obtener prestamos
            conexion.query('SELECT * FROM prestamo', (error, results) => {
                if (error) throw error;
                prestamosArray = results;

                // Obtener datos de profesores
                conexion.query('SELECT * FROM profesor', (error, results) => {
                    if (error) throw error;
                    profesArray = results;

                    // Obtener datos de estudiantes
                    conexion.query('SELECT * FROM estudiante', (error, results) => {
                        if (error) throw error;
                        estudiantesArray = results;

                        // Obtener datos de personal administrativo
                        conexion.query('SELECT * FROM personal_admin', (error, results) => {
                            if (error) throw error;
                            padminArray = results;

                            callback({
                                sancionesArray,
                                prestamosArray,
                                profesArray,
                                estudiantesArray,
                                padminArray
                            });
                        });
                    });
                });
            });
        });
    }

    function actualizarSancion(sancion, callback) {
        const hoy = moment().format('YYYY-MM-DD');
        const fechaFin = moment(sancion.fecha_fin).format('YYYY-MM-DD');

        if (sancion.Estado === 'Activa' && fechaFin !== 'Invalid date' && fechaFin < hoy) {
            const idPrestamo = sancion.id_prestamo;
            const getLoanQuery = 'SELECT tipo_solicitante, ci_Estudiante, ci_Profesor, ci_Padministrativo FROM prestamo WHERE id = ?';

            conexion.query(getLoanQuery, [idPrestamo], (error, loanResults) => {
                if (error) {
                    console.error('Error fetching loan:', error);
                    callback(error);
                    return;
                }

                if (loanResults.length === 0) {
                    callback('Préstamo no encontrado');
                    return;
                }

                const prestamo = loanResults[0];
                const tipoSolicitante = prestamo.tipo_solicitante;
                let ciSolicitante = '';

                if (tipoSolicitante === 'Estudiante') {
                    ciSolicitante = prestamo.ci_Estudiante;
                } else if (tipoSolicitante === 'Profesor') {
                    ciSolicitante = prestamo.ci_Profesor;
                } else if (tipoSolicitante === 'Personal Administrativo') {
                    ciSolicitante = prestamo.ci_Padministrativo;
                }

                let updateSolicitanteQuery = '';

                if (tipoSolicitante === 'Estudiante') {
                    updateSolicitanteQuery = 'UPDATE estudiante SET Estado = ? WHERE CI = ?';
                } else if (tipoSolicitante === 'Profesor') {
                    updateSolicitanteQuery = 'UPDATE profesor SET Estado = ? WHERE CI = ?';
                } else if (tipoSolicitante === 'Personal Administrativo') {
                    updateSolicitanteQuery = 'UPDATE personal_admin SET Estado = ? WHERE CI = ?';
                }

                conexion.query(updateSolicitanteQuery, ['Activo', ciSolicitante], (error, results) => {
                    if (error) {
                        console.error('Error updating solicitante:', error);
                        callback(error);
                        return;
                    }

                    const updateSanctionQuery = 'UPDATE sancion SET Estado = ? WHERE id = ?';
                    conexion.query(updateSanctionQuery, ['Cumplida', sancion.id], (error, results) => {
                        if (error) {
                            console.error('Error updating sanction:', error);
                            callback(error);
                            return;
                        }

                        callback(null);
                    });
                });
            });
        } else {
            callback(null);
        }
    }

    function procesarSanciones(data, callback) {
        let { sancionesArray, prestamosArray, profesArray, estudiantesArray, padminArray } = data;
        let resultArray = [];
        let pendingUpdates = sancionesArray.length;

        sancionesArray.forEach(sancion => {
            actualizarSancion(sancion, (error) => {
                if (error) {
                    console.error('Error updating sanction:', error);
                }

                let prestamo = prestamosArray.find(p => p.id === sancion.id_prestamo);

                if (!prestamo) {
                    pendingUpdates--;
                    if (pendingUpdates === 0) callback(resultArray);
                    return;
                }

                let nombreSolicitante = 'Solicitante no encontrado';
                let ciSolicitante = '';

                if (prestamo.tipo_solicitante === 'Estudiante') {
                    let estudiante = estudiantesArray.find(e => e.CI === prestamo.ci_Estudiante);
                    nombreSolicitante = estudiante ? estudiante.Nombre : nombreSolicitante;
                    ciSolicitante = estudiante ? estudiante.CI : '';
                } else if (prestamo.tipo_solicitante === 'Profesor') {
                    let profesor = profesArray.find(p => p.CI === prestamo.ci_Profesor);
                    nombreSolicitante = profesor ? profesor.Nombre : nombreSolicitante;
                    ciSolicitante = profesor ? profesor.CI : '';
                } else if (prestamo.tipo_solicitante === 'Personal Administrativo') {
                    let personalAdmin = padminArray.find(pa => pa.CI === prestamo.ci_Padministrativo);
                    nombreSolicitante = personalAdmin ? personalAdmin.Nombre : nombreSolicitante;
                    ciSolicitante = personalAdmin ? personalAdmin.CI : '';
                }

                let nuevoObjeto = {
                    id: sancion.id,
                    id_prestamo: sancion.id_prestamo,
                    ci: ciSolicitante,
                    nombre_solicitante: nombreSolicitante,
                    Descripcion: sancion.Descripcion,
                    fecha_inicio: moment(sancion.fecha_inicio).format('DD/MM/YYYY'),
                    fecha_fin: sancion.fecha_fin ? moment(sancion.fecha_fin).format('DD/MM/YYYY') : 'Indefinido',
                    estado: sancion.Estado
                };

                resultArray.push(nuevoObjeto);
                pendingUpdates--;

                if (pendingUpdates === 0) {
                    callback(resultArray);
                }
            });
        });
    }

    function main() {
        getData((data) => {
            procesarSanciones(data, (resultArray) => {
                res.render('fines/sanciones', { resultsArray: resultArray });
            });
        });
    }

    main();
});



// RUTA PARA CULMINAR SANCION
router.get('/fines/culminate/:id', (req, res) => {
    const sancionId = req.params.id;

    // Obtener la sanción y su correspondiente préstamo
    const getSancionQuery = 'SELECT id_prestamo FROM sancion WHERE id = ?';
    conexion.query(getSancionQuery, [sancionId], (error, sancionResults) => {
        if (error) {
            console.error('Error fetching sanction:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (sancionResults.length === 0) {
            res.status(400).send('Sanción no encontrada');
            return;
        }

        const sancion = sancionResults[0];
        const prestamoId = sancion.id_prestamo;

        // Obtener detalles del préstamo para identificar el tipo de solicitante y su cédula
        const getPrestamoQuery = 'SELECT tipo_solicitante, ci_Estudiante, ci_Profesor, ci_Padministrativo FROM prestamo WHERE id = ?';
        conexion.query(getPrestamoQuery, [prestamoId], (error, prestamoResults) => {
            if (error) {
                console.error('Error fetching loan:', error);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (prestamoResults.length === 0) {
                res.status(400).send('Préstamo no encontrado');
                return;
            }

            const prestamo = prestamoResults[0];
            const tipoSolicitante = prestamo.tipo_solicitante;
            let ciSolicitante = '';

            if (tipoSolicitante === 'Estudiante') {
                ciSolicitante = prestamo.ci_Estudiante;
            } else if (tipoSolicitante === 'Profesor') {
                ciSolicitante = prestamo.ci_Profesor;
            } else if (tipoSolicitante === 'Personal Administrativo') {
                ciSolicitante = prestamo.ci_Padministrativo;
            }

            // Actualizar el estado de la sanción a "Cumplida"
            const updateSancionQuery = 'UPDATE sancion SET Estado = "Cumplida" WHERE id = ?';
            conexion.query(updateSancionQuery, [sancionId], (error, results) => {
                if (error) {
                    console.error('Error updating sanction:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                // Actualizar el estado del solicitante a "Activo"
                let updateSolicitanteQuery = '';
                if (tipoSolicitante === 'Estudiante') {
                    updateSolicitanteQuery = 'UPDATE estudiante SET Estado = "Activo" WHERE CI = ?';
                } else if (tipoSolicitante === 'Profesor') {
                    updateSolicitanteQuery = 'UPDATE profesor SET Estado = "Activo" WHERE CI = ?';
                } else if (tipoSolicitante === 'Personal Administrativo') {
                    updateSolicitanteQuery = 'UPDATE personal_admin SET Estado = "Activo" WHERE CI = ?';
                }

                if (updateSolicitanteQuery) {
                    conexion.query(updateSolicitanteQuery, [ciSolicitante], (error, results) => {
                        if (error) {
                            console.error('Error updating applicant status:', error);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        console.log('Solicitante actualizado:', results);
                        res.redirect('/fines/sanciones');
                    });
                } else {
                    res.status(400).send('Tipo de solicitante desconocido');
                }
            });
        });
    });
});

//RUTA PARA CREAR SANCIÓN
router.get('/fines/create', authController.isAuthenticated, authController.checkGuest, (req, res) => {
  res.render('fines/create');
});


// RUTA PARA ELIMINAR SANCIÓN
router.get('/fines/delete/:id', authController.isAuthenticated, authController.checkGuest, (req, res) => {
  const id = req.params.id;

  // Primero, obtener el id_prestamo desde la tabla sancion
  const getSanctionQuery = 'SELECT id_prestamo FROM sancion WHERE id = ?';
  conexion.query(getSanctionQuery, [id], (error, sanctionResults) => {
    if (error) {
      console.error('Error fetching sanction:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (sanctionResults.length === 0) {
      res.status(400).send('Sanción no encontrada');
      return;
    }

    const idPrestamo = sanctionResults[0].id_prestamo;

    // Obtener el tipo de solicitante y cédula desde la tabla prestamo
    const getLoanQuery = 'SELECT tipo_solicitante, ci_Estudiante, ci_Profesor, ci_Padministrativo FROM prestamo WHERE id = ?';
    conexion.query(getLoanQuery, [idPrestamo], (error, loanResults) => {
      if (error) {
        console.error('Error fetching loan:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (loanResults.length === 0) {
        res.status(400).send('Préstamo no encontrado');
        return;
      }

      const prestamo = loanResults[0];
      const tipoSolicitante = prestamo.tipo_solicitante;
      const ciEstudiante = prestamo.ci_Estudiante;
      const ciProfesor = prestamo.ci_Profesor;
      const ciPadmin = prestamo.ci_Padministrativo;

      // Actualizar el estado del solicitante a 'Activo'
      let updateSolicitanteQuery = '';
      let ciSolicitante = '';

      if (tipoSolicitante === 'Estudiante') {
        updateSolicitanteQuery = 'UPDATE estudiante SET Estado = ? WHERE CI = ?';
        ciSolicitante = ciEstudiante;
      } else if (tipoSolicitante === 'Profesor') {
        updateSolicitanteQuery = 'UPDATE profesor SET Estado = ? WHERE CI = ?';
        ciSolicitante = ciProfesor;
      } else if (tipoSolicitante === 'Personal Administrativo') {
        updateSolicitanteQuery = 'UPDATE personal_admin SET Estado = ? WHERE CI = ?';
        ciSolicitante = ciPadmin;
      }

      conexion.query(updateSolicitanteQuery, ['Activo', ciSolicitante], (error, results) => {
        if (error) {
          console.error('Error updating solicitante:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Luego, eliminar la sanción
        const deleteSanctionQuery = 'DELETE FROM sancion WHERE id = ?';
        conexion.query(deleteSanctionQuery, [id], (error, results) => {
          if (error) {
            console.error('Error deleting sanction:', error);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/fines/sanciones');
        });
      });
    });
  });
});

//RUTA EDITAR SANCIONES
router.get('/fines/edit/:id', authController.isAuthenticated, authController.checkGuest, (req, res) => {
    const id = req.params.id;
    conexion.query('SELECT * FROM sancion WHERE id = ?', [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('fines/edit', { sancion: results[0] });
        }
    });
});










const crud =require('../controllers/crud')
router.post('/saveBook', authController.isAuthenticated, authController.checkGuest, crud.saveLibro) // invocar funcion para Guardar nuevo libro 
router.post('/updateBook', authController.isAuthenticated, authController.checkGuest, crud.updateLibro)  // invocar funcion para actualizar libro
router.post('/updateUser', authController.isAuthenticated, authController.checkGuest, crud.updateUsuario) // invocar funcion para actualizar usuario
router.post('/saveTeacher', authController.isAuthenticated, authController.checkGuest, crud.saveTeacher) // invocar funcion para Guardar nuevo Profesor
router.post('/saveStudent', authController.isAuthenticated, authController.checkGuest, crud.saveStudent) // invocar funcion para Guardar nuevo Estudiante
router.post('/savePadmin', authController.isAuthenticated, authController.checkGuest, crud.savePadmin) // invocar funcion para Guardar nuevo P administrativo
router.post('/saveLoan', authController.isAuthenticated, authController.checkGuest, crud.saveLoan) 
router.post('/updateLoan', authController.isAuthenticated, authController.checkGuest, crud.updateLoan) 
router.post('/saveSanction', authController.isAuthenticated, authController.checkGuest, crud.saveSanction);
router.get('/validateLoan/:id', crud.validateLoan);
router.post('/updateFine', authController.isAuthenticated, authController.checkGuest, crud.updateFine);



router.get('/fines/sanciones', authController.isAuthenticated, (req, res)=>{
  res.render('fines/sanciones')
})

//router para los metodos del controller 
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/resetPassword', authController.resetPass);
router.post('/resetPassword/newPassword', authController.updatePassword);
router.post('/usuarios')
router.post('/prestamos')
router.post('/estudiantes')
router.post('/profesores')
router.post('/padministrativo')
router.post('/ajustes')
router.get('/logout', authController.logout)
module.exports=router 