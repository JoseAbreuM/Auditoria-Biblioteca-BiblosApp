const conexion=require('../database/db');

/* En este archivo se encuentran los elementos crud de crear y editar
eliminar se realiza directamente en ROUTER, la unica excepcion a esta regla es con el caso de crear USUARIO, al estar encriptada la contraseña, la creacion se realiza en AUTHCONTROLLERS  */

////////////////////////////////// ELEMENTOS CRUD PARA MODULO LIBROS /////////////////////////

//CREAR NUEVA ENTRADA EN LIBRO 
exports.saveLibro=(req, res)=>{
      const Titulo= req.body.Titulo;
      const Cantidad= req.body.Cantidad;
      const Autor=req.body.Autor;
      const editorial=req.body.editorial;
      const anio_edicion=req.body.anio_edicion;
      const Materia= req.body.Materia;
      const Carrera=req.body.Carrera;
      const Estado= req.body.Estado;
      conexion.query('INSERT INTO libro SET ?', {
        Titulo:Titulo,
        Cantidad:Cantidad,
        Autor:Autor,
        editorial:editorial,
        anio_edicion:anio_edicion,
        Materia:Materia,
        Carrera:Carrera,
        Estado:Estado
      }, (error, results)=>{
          if (error) {
              console.log(error);
          } res.redirect('/books/libros');

      })
}
//EDITAR DATOS EN TABLA LIBRO
exports.updateLibro= (req, res)=>{
     const id=req.body.id;
     const Titulo= req.body.Titulo;
      const Cantidad= req.body.Cantidad;
      const Autor=req.body.Autor;
      const editorial=req.body.editorial;
      const anio_edicion=req.body.anio_edicion;
      const Materia= req.body.Materia;
      const Carrera=req.body.Carrera;
      const Estado= req.body.Estado;

    conexion.query('UPDATE libro SET ? WHERE id=?', [{

      Titulo:Titulo,
        Cantidad:Cantidad,
        Autor:Autor,
        editorial:editorial,
        anio_edicion:anio_edicion,
        Materia:Materia,
        Carrera:Carrera,
        Estado:Estado},
        id
    ], (error, results)=>{
          if (error) {
              console.log(error);
          } res.redirect('/books/libros');
      })
}

////////////////////////////////// ELEMENTOS CRUD PARA MODULO USUARIO /////////////////////////

exports.updateUsuario= (req, res)=>{
     const id=req.body.id;
     const Usuario= req.body.Usuario;
      const Nombre= req.body.Nombre;
      const Correo=req.body.Correo;

    conexion.query('UPDATE usuarios SET ? WHERE id=?', [{

        Usuario:Usuario,
        Nombre:Nombre,
        Correo:Correo,
            },
        id
    ], (error, results)=>{
          if (error) {
              console.log(error);
          } res.redirect('/users/usuarios');
      })
}


////////////////////////////////// ELEMENTOS CRUD PARA MODULO Profesores /////////////////////////

//CREAR NUEVA ENTRADA EN Profesores
exports.saveTeacher=(req, res)=>{
      const CI= req.body.CI;
      const Nombre= req.body.Nombre;
      const Departamento=req.body.Departamento;
      const telefono=req.body.telefono;
      const Correo=req.body.Correo;
      const Estado= req.body.Estado;
      conexion.query('INSERT INTO profesor SET ?', {
        CI:CI,
        Nombre:Nombre,
        Departamento:Departamento,
        telefono:telefono,
        Correo:Correo,
        Estado:Estado
      }, (error, results)=>{
          if (error) {
              console.log(error);
          } res.redirect('/teachers/profesores');

      })
}


////////////////////////////////// ELEMENTOS CRUD PARA MODULO ESTUDIANTES /////////////////////////

//CREAR NUEVA ENTRADA EN ESTUDIANTES
exports.saveStudent=(req, res)=>{
      const CI= req.body.CI;
      const Nombre= req.body.Nombre;
      const Carrera=req.body.Carrera;
      const telefono=req.body.telefono;
      const Correo=req.body.Correo;
      const Estado= req.body.Estado;
      conexion.query('INSERT INTO estudiante SET ?', {
        CI:CI,
        Nombre:Nombre,
        Carrera:Carrera,
        telefono:telefono,
        Correo:Correo,
        Estado:Estado
      }, (error, results)=>{
          if (error) {
              console.log(error);
          } res.redirect('/students/estudiantes');

      })
}


//////////////////////// ELEMENTOS CRUD PARA MODULO P. ADMINISTRATIVO /////////////////////////

//CREAR NUEVA ENTRADA EN ESTUDIANTES
exports.savePadmin=(req, res)=>{
      const CI= req.body.CI;
      const Nombre= req.body.Nombre;
      const Escuela=req.body.Escuela;
      const telefono=req.body.telefono;
      const Correo=req.body.Correo;
      const Estado= req.body.Estado;
      conexion.query('INSERT INTO personal_admin SET ?', {
        CI:CI,
        Nombre:Nombre,
        Escuela:Escuela,
        telefono:telefono,
        Correo:Correo,
        Estado:Estado
      }, (error, results)=>{
          if (error) {
              console.log(error);
          } res.redirect('/apersonal/padministrativo');

      })
}




exports.savePadmin=(req, res)=>{
      const CI= req.body.CI;
      const Nombre= req.body.Nombre;
      const Escuela=req.body.Escuela;
      const telefono=req.body.telefono;
      const Correo=req.body.Correo;
      const Estado= req.body.Estado;
      conexion.query('INSERT INTO personal_admin SET ?', {
        CI:CI,
        Nombre:Nombre,
        Escuela:Escuela,
        telefono:telefono,
        Correo:Correo,
        Estado:Estado
      }, (error, results)=>{
          if (error) {
              console.log(error);
          } res.redirect('/apersonal/padministrativo');

      })
}
// ///////////////////////////////ELEMENTOS PARA TABLA DE PRESTAMOS////////////////////////

exports.saveLoan = (req, res) => {
    const { bookTitle, Cantidad, applicantType, dni, loanDate, deadLine, Estado } = req.body;

    // Primero, obtener el ID del libro a partir del título
    const getBookQuery = 'SELECT * FROM libro WHERE Titulo = ?';
    conexion.query(getBookQuery, [bookTitle], (err, libros) => {
        if (err) {
            console.error('Error fetching book:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (libros.length === 0) {
            res.status(400).send('Libro no encontrado');
            return;
        }

        const libro = libros[0];

        // Determina la tabla y columna CI adecuada según el tipo de solicitante
        let tableName, ciColumn;
        if (applicantType === 'Estudiante') {
            tableName = 'estudiante';
            ciColumn = 'ci_Estudiante';
        } else if (applicantType === 'Profesor') {
            tableName = 'profesor';
            ciColumn = 'ci_Profesor';
        } else if (applicantType === 'Personal Administrativo') {
            tableName = 'personal_admin';
            ciColumn = 'ci_Padministrativo';
        }

        // Verificar el estado del solicitante
        const getApplicantQuery = `SELECT Estado FROM ${tableName} WHERE CI = ?`;
        conexion.query(getApplicantQuery, [dni], (err, applicantResults) => {
            if (err) {
                console.error('Error fetching applicant:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (applicantResults.length === 0) {
                res.status(400).send('Solicitante no encontrado');
                return;
            }

            const estadoSolicitante = applicantResults[0].Estado;

            if (estadoSolicitante === 'Sancionado') {
                res.status(400).send('No se puede realizar el préstamo por sanción');
                return;
            }

            // Inserta el nuevo préstamo
            const insertLoanQuery = `
                INSERT INTO prestamo (id_libro, Cantidad, ${ciColumn}, tipo_solicitante, Fecha_prestamo, Fecha_devolucion, Estado)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const loanValues = [libro.id, Cantidad, dni, applicantType, loanDate, deadLine, Estado];

            conexion.query(insertLoanQuery, loanValues, (err, results) => {
                if (err) {
                    console.error('Error inserting loan:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                console.log('Préstamo insertado:', results);

                // Actualiza la cantidad del libro si el estado es "En Proceso"
                if (Estado === 'En Proceso') {
                    libro.Cantidad -= parseInt(Cantidad, 10);
                    const updateBookQuery = 'UPDATE libro SET Cantidad = ? WHERE id = ?';
                    const updateBookValues = [libro.Cantidad, libro.id];

                    conexion.query(updateBookQuery, updateBookValues, (err, results) => {
                        if (err) {
                            console.error('Error updating book:', err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        console.log('Libro actualizado:', results);
                        res.redirect('/loans/prestamos');
                    });
                } else {
                    res.redirect('/loans/prestamos');
                }
            });
        });
    });
};



exports.updateLoan = (req, res) => {
  const { id, id_libro, Cantidad, Estado: estadoInicial, Fecha_Prestamo, Fecha_Devolucion, tipo_solicitante, ci } = req.body;

  // Log para verificar datos recibidos
  console.log('Datos recibidos:', req.body);

  // Validar que los datos no estén vacíos
  if (!id || !id_libro || !Cantidad || !estadoInicial || !Fecha_Prestamo || !Fecha_Devolucion || !tipo_solicitante || !ci) {
    res.status(400).send('Todos los campos son obligatorios');
    return;
  }

  // Obtener datos anteriores del préstamo
  conexion.query('SELECT * FROM prestamo WHERE id = ?', [id], (error, loanResults) => {
    if (error) {
      console.error('Error fetching loan:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (loanResults.length === 0) {
      res.status(400).send('Préstamo no encontrado');
      return;
    }

    const prestamoAnterior = loanResults[0];
    const cantidadAnterior = prestamoAnterior.Cantidad;
    const estadoAnterior = prestamoAnterior.Estado;
    const idLibroAnterior = prestamoAnterior.id_libro;

    // Actualizar el estado del solicitante si las fechas de préstamo y devolución han cambiado
    const hoy = new Date();
    let estadoSolicitante = 'Activo';
    let estado = estadoInicial;
    if (new Date(Fecha_Devolucion) < hoy && estadoInicial !== 'Finalizado') {
      estadoSolicitante = 'Sancionado';
      estado = 'Atrasado';
    }

    // Devolver la cantidad anterior al libro original si el estado anterior era "En Proceso" o "Atrasado"
    if (estadoAnterior === 'En Proceso' || estadoAnterior === 'Atrasado') {
      const devolverCantidadQuery = 'UPDATE libro SET Cantidad = Cantidad + ? WHERE id = ?';
      conexion.query(devolverCantidadQuery, [cantidadAnterior, idLibroAnterior], (error, results) => {
        if (error) {
          console.error('Error returning book quantity:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Restar la nueva cantidad del libro actualizado
        const restarCantidadQuery = 'UPDATE libro SET Cantidad = Cantidad - ? WHERE id = ?';
        conexion.query(restarCantidadQuery, [Cantidad, id_libro], (error, results) => {
          if (error) {
            console.error('Error subtracting book quantity:', error);
            res.status(500).send('Internal Server Error');
            return;
          }

          // Actualizar el estado del solicitante en la tabla correspondiente
          let updateSolicitanteQuery = '';
          if (tipo_solicitante === 'Estudiante') {
            updateSolicitanteQuery = 'UPDATE estudiante SET Estado = ? WHERE CI = ?';
          } else if (tipo_solicitante === 'Profesor') {
            updateSolicitanteQuery = 'UPDATE profesor SET Estado = ? WHERE CI = ?';
          } else if (tipo_solicitante === 'Personal Administrativo') {
            updateSolicitanteQuery = 'UPDATE personal_admin SET Estado = ? WHERE CI = ?';
          }

          conexion.query(updateSolicitanteQuery, [estadoSolicitante, ci], (error, results) => {
            if (error) {
              console.error('Error updating solicitante:', error);
              res.status(500).send('Internal Server Error');
              return;
            }

            // Determinar el campo CI correcto
            let ciField;
            if (tipo_solicitante === 'Estudiante') {
              ciField = 'ci_Estudiante';
            } else if (tipo_solicitante === 'Profesor') {
              ciField = 'ci_Profesor';
            } else if (tipo_solicitante === 'Personal Administrativo') {
              ciField = 'ci_Padmin';
            }

            // Actualizar el préstamo
            const updateLoanQuery = `UPDATE prestamo SET id_libro = ?, Cantidad = ?, Estado = ?, Fecha_Prestamo = ?, Fecha_Devolucion = ?, tipo_solicitante = ?, ${ciField} = ? WHERE id = ?`;
            const newLoanData = [id_libro, Cantidad, estado, Fecha_Prestamo, Fecha_Devolucion, tipo_solicitante, ci, id];

            conexion.query(updateLoanQuery, newLoanData, (error, results) => {
              if (error) {
                console.error('Error updating loan:', error);
                res.status(500).send('Internal Server Error');
                return;
              }
              res.redirect('/loans/prestamos');
            });
          });
        });
      });
    } else {
      // En caso de que el estado anterior no sea "En Proceso" o "Atrasado", solo restar la nueva cantidad del libro actualizado
      const restarCantidadQuery = 'UPDATE libro SET Cantidad = Cantidad - ? WHERE id = ?';
      conexion.query(restarCantidadQuery, [Cantidad, id_libro], (error, results) => {
        if (error) {
          console.error('Error subtracting book quantity:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Actualizar el estado del solicitante en la tabla correspondiente
        let updateSolicitanteQuery = '';
        if (tipo_solicitante === 'Estudiante') {
          updateSolicitanteQuery = 'UPDATE estudiante SET Estado = ? WHERE CI = ?';
        } else if (tipo_solicitante === 'Profesor') {
          updateSolicitanteQuery = 'UPDATE profesor SET Estado = ? WHERE CI = ?';
        } else if (tipo_solicitante === 'Personal Administrativo') {
          updateSolicitanteQuery = 'UPDATE personal_admin SET Estado = ? WHERE CI = ?';
        }

        conexion.query(updateSolicitanteQuery, [estadoSolicitante, ci], (error, results) => {
          if (error) {
            console.error('Error updating solicitante:', error);
            res.status(500).send('Internal Server Error');
            return;
          }

          // Determinar el campo CI correcto
          let ciField;
          if (tipo_solicitante === 'Estudiante') {
            ciField = 'ci_Estudiante';
          } else if (tipo_solicitante === 'Profesor') {
            ciField = 'ci_Profesor';
          } else if (tipo_solicitante === 'Personal Administrativo') {
            ciField = 'ci_Padmin';
          }

          // Actualizar el préstamo
          const updateLoanQuery = `UPDATE prestamo SET id_libro = ?, Cantidad = ?, Estado = ?, Fecha_Prestamo = ?, Fecha_Devolucion = ?, tipo_solicitante = ?, ${ciField} = ? WHERE id = ?`;
          const newLoanData = [id_libro, Cantidad, estado, Fecha_Prestamo, Fecha_Devolucion, tipo_solicitante, ci, id];

          conexion.query(updateLoanQuery, newLoanData, (error, results) => {
            if (error) {
              console.error('Error updating loan:', error);
              res.status(500).send('Internal Server Error');
              return;
            }
            res.redirect('/loans/prestamos');
          });
        });
      });
    }
  });
};

///////////////////////////////ELEMENTOS TABLA SANCIONES////////////////////////////////
// Validar el ID del préstamo
exports.validateLoan = (req, res) => {
    const loanId = req.params.id;
    const getLoanQuery = 'SELECT Estado, tipo_solicitante, ci_Estudiante, ci_Profesor, ci_Padministrativo FROM prestamo WHERE id = ?';
    
    conexion.query(getLoanQuery, [loanId], (error, loanResults) => {
        if (error) {
            console.error('Error fetching loan:', error);
            res.status(500).send({ error: 'Internal Server Error' });
            return;
        }

        if (loanResults.length === 0) {
            res.status(400).send({ error: 'Préstamo no encontrado' });
            return;
        }

        const prestamo = loanResults[0];
        if (prestamo.Estado === 'En Proceso') {
            res.status(400).send({ error: 'El préstamo no ha culminado y no es sancionable' });
            return;
        }

        res.send({ loan: prestamo });
    });
};

// Guardar la sanción
exports.saveSanction = (req, res) => {
    const { loanId, description, indefinite, startDate, endDate, status } = req.body;
    
    const getLoanQuery = 'SELECT tipo_solicitante, ci_Estudiante, ci_Profesor, ci_Padministrativo FROM prestamo WHERE id = ?';
    conexion.query(getLoanQuery, [loanId], (error, loanResults) => {
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
        let ciSolicitante;
        if (prestamo.tipo_solicitante === 'Estudiante') {
            ciSolicitante = prestamo.ci_Estudiante;
        } else if (prestamo.tipo_solicitante === 'Profesor') {
            ciSolicitante = prestamo.ci_Profesor;
        } else if (prestamo.tipo_solicitante === 'Personal Administrativo') {
            ciSolicitante = prestamo.ci_Padministrativo;
        }

        // Insertar la nueva sanción
        const insertSanctionQuery = `
            INSERT INTO sancion (id_prestamo, Descripcion, fecha_inicio, fecha_fin, Estado)
            VALUES (?, ?, ?, ?, ?)
        `;
        const sanctionValues = [loanId, description, indefinite ? null : startDate, indefinite ? null : endDate, status];

        conexion.query(insertSanctionQuery, sanctionValues, (error, results) => {
            if (error) {
                console.error('Error inserting sanction:', error);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Actualizar el estado del solicitante
            let updateSolicitanteQuery = '';
            if (prestamo.tipo_solicitante === 'Estudiante') {
                updateSolicitanteQuery = 'UPDATE estudiante SET Estado = ? WHERE CI = ?';
            } else if (prestamo.tipo_solicitante === 'Profesor') {
                updateSolicitanteQuery = 'UPDATE profesor SET Estado = ? WHERE CI = ?';
            } else if (prestamo.tipo_solicitante === 'Personal Administrativo') {
                updateSolicitanteQuery = 'UPDATE personal_admin SET Estado = ? WHERE CI = ?';
            }

            const nuevoEstado = status === 'Activa' ? 'Sancionado' : 'Activo';
            conexion.query(updateSolicitanteQuery, [nuevoEstado, ciSolicitante], (error, results) => {
                if (error) {
                    console.error('Error updating applicant status:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                console.log('Sanción creada y estado del solicitante actualizado:', results);
                res.redirect('/fines/sanciones');
            });
        });
    });
};

//////////////////EDITAR SANCIONES////////////////
exports.updateFine = (req, res) => {
    const { id, loanId, description, indefinite, startDate, endDate, status } = req.body;

    // Log para verificar datos recibidos
    console.log('Datos recibidos:', req.body);

    // Validar que los datos no estén vacíos
    if (!id || !loanId || !description || (!indefinite && (!startDate || !endDate)) || !status) {
        res.status(400).send('Todos los campos obligatorios deben ser completados');
        return;
    }

    // Construir la consulta de actualización
    const updateSanctionQuery = `UPDATE sancion SET id_prestamo = ?, Descripcion = ?, fecha_inicio = ?, fecha_fin = ?, Estado = ? WHERE id = ?`;
    const updateData = [loanId, description, indefinite ? null : startDate, indefinite ? null : endDate, status, id];

    conexion.query(updateSanctionQuery, updateData, (error, results) => {
        if (error) {
            console.error('Error updating sanction:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Si el estado de la sanción no es "Cumplida", actualizar el estado del solicitante
        if (status !== 'Cumplida') {
            const getLoanQuery = 'SELECT tipo_solicitante, ci_Estudiante, ci_Profesor, ci_padministrativo FROM prestamo WHERE id = ?';
            conexion.query(getLoanQuery, [loanId], (loanError, loanResults) => {
                if (loanError) {
                    console.error('Error retrieving loan details:', loanError);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                const loan = loanResults[0];
                let updateSolicitantQuery = '';
                let solicitantId = '';

                // Construir la consulta de actualización del estado del solicitante según el tipo de solicitante
                if (loan.tipo_solicitante === 'Estudiante') {
                    updateSolicitantQuery = 'UPDATE estudiante SET estado = ? WHERE CI = ?';
                    solicitantId = loan.ci_Estudiante;
                } else if (loan.tipo_solicitante === 'Profesor') {
                    updateSolicitantQuery = 'UPDATE profesor SET estado = ? WHERE CI = ?';
                    solicitantId = loan.ci_Profesor;
                } else if (loan.tipo_solicitante === 'Personal Administrativo') {
                    updateSolicitantQuery = 'UPDATE personal_administrativo SET estado = ? WHERE CI = ?';
                    solicitantId = loan.ci_padministrativo;
                }

                conexion.query(updateSolicitantQuery, ['Sancionado', solicitantId], (solicitantError, solicitantResults) => {
                    if (solicitantError) {
                        console.error('Error updating solicitant status:', solicitantError);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.redirect('/fines/sanciones');
                });
            });
        } else {
            res.redirect('/fines/sanciones');
        }
    });
};


