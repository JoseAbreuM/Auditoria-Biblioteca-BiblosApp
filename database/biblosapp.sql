-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2024 a las 00:50:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `biblosapp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `id` int(11) NOT NULL,
  `CI` varchar(20) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Carrera` varchar(200) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Estado` varchar(100) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id`, `CI`, `Nombre`, `Carrera`, `telefono`, `Correo`, `Estado`) VALUES
(1, '28216933', 'José Abreu', ' Ingenieria de Sistemas', '04249416374', 'joseabreumartinez1708@gmail.com', 'Activo'),
(2, '28216030', 'Barbara España', ' Ingenieria de Sistemas', '041281614810', 'bespana@gmail.com', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro`
--

CREATE TABLE `libro` (
  `id` int(11) NOT NULL,
  `Titulo` text DEFAULT NULL,
  `Cantidad` int(11) NOT NULL,
  `Autor` varchar(200) NOT NULL,
  `editorial` varchar(200) NOT NULL,
  `anio_edicion` varchar(50) NOT NULL,
  `Materia` varchar(200) NOT NULL,
  `Estado` varchar(50) NOT NULL DEFAULT '1',
  `Carrera` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libro`
--

INSERT INTO `libro` (`id`, `Titulo`, `Cantidad`, `Autor`, `editorial`, `anio_edicion`, `Materia`, `Estado`, `Carrera`) VALUES
(1, 'El diablo en el desierto', 15, 'Mi abuelo', 'Planeta', '1600', 'Historia', 'Disponible', 'Ingenieria de\r\n                        Sistemas'),
(2, 'Python', 69, 'Jose Gregorio Hernandez', 'Planeta', '2024', 'POO', 'Disponible', 'Ingenieria de Sistemas'),
(4, 'Desierto 3', 40, 'Yo', 'Planeta', '2024', 'Ficcion', 'Disponible', 'Contaduria'),
(5, 'El diablo en el desierto 2', 2, 'Mi papa', 'Planeta', '2024', 'sad', 'Disponible', 'Ingenieria de\r\n                        Sistemas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_admin`
--

CREATE TABLE `personal_admin` (
  `id` int(11) NOT NULL,
  `CI` varchar(20) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Escuela` varchar(50) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personal_admin`
--

INSERT INTO `personal_admin` (`id`, `CI`, `Nombre`, `Escuela`, `telefono`, `Correo`, `Estado`) VALUES
(1, '20548633', 'Raul Espinoza', 'Escuela de Ingeniería y Ciencias Aplicadas (EICA)', '0412581285220', 'respinoza@gmail.com', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamo`
--

CREATE TABLE `prestamo` (
  `id` int(11) NOT NULL,
  `id_libro` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL DEFAULT 1,
  `tipo_solicitante` varchar(50) NOT NULL,
  `ci_Profesor` varchar(45) DEFAULT NULL,
  `ci_Estudiante` varchar(45) DEFAULT NULL,
  `ci_Padministrativo` varchar(45) DEFAULT NULL,
  `Fecha_prestamo` date NOT NULL,
  `Fecha_devolucion` date NOT NULL,
  `Observación` text NOT NULL,
  `Estado` varchar(100) NOT NULL DEFAULT 'Finalizado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestamo`
--

INSERT INTO `prestamo` (`id`, `id_libro`, `Cantidad`, `tipo_solicitante`, `ci_Profesor`, `ci_Estudiante`, `ci_Padministrativo`, `Fecha_prestamo`, `Fecha_devolucion`, `Observación`, `Estado`) VALUES
(1, 2, 1, 'Estudiante', NULL, '28216933', NULL, '2024-06-06', '2024-06-12', '', 'Finalizado'),
(2, 5, 1, 'Profesor', '3336336', NULL, NULL, '2024-06-01', '2024-06-06', '', 'Finalizado'),
(5, 2, 10, 'Estudiante', NULL, '28216030', NULL, '2024-06-07', '2024-06-17', '', 'Finalizado'),
(20, 2, 10, 'Personal Administrativo', NULL, NULL, '20548633', '2024-06-05', '2024-06-08', '', 'Recibido con Retraso'),
(22, 2, 5, 'Profesor', '3336336', NULL, NULL, '2024-06-03', '2024-06-05', '', 'Recibido con Retraso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor`
--

CREATE TABLE `profesor` (
  `id` int(11) NOT NULL,
  `CI` varchar(45) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Departamento` varchar(200) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesor`
--

INSERT INTO `profesor` (`id`, `CI`, `Nombre`, `Departamento`, `telefono`, `Correo`, `Estado`) VALUES
(1, '3336336', 'Armando Abreu', 'Departamento de Ciencias', '04248318908', 'armando.abreu.barrios@gmail.com', 'Activo'),
(2, '24645521', 'Anibal Fariñas', 'Depto. Ingenieria de Sistemas', '04248168413.0', 'afarinas.udomonagas@gmail.com', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sancion`
--

CREATE TABLE `sancion` (
  `id` int(11) NOT NULL,
  `id_prestamo` int(11) NOT NULL,
  `Descripcion` text NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `Estado` varchar(150) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sancion`
--

INSERT INTO `sancion` (`id`, `id_prestamo`, `Descripcion`, `fecha_inicio`, `fecha_fin`, `Estado`) VALUES
(1, 20, 'Entregó el libro con 2 días de retaso, por lo tanto estará sancionado por 1 semana', '2024-06-10', '2024-06-17', 'Cumplida'),
(2, 22, 'Entregó el libro con retraso de 2 semanas, sanción de un mes', '2024-06-10', '2024-07-10', 'Cumplida'),
(4, 2, 'botó esa vaina', NULL, NULL, 'Cumplida');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Clave` varchar(100) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Tipo_usuario` varchar(100) NOT NULL DEFAULT 'Normal',
  `pregunta_seguridad` varchar(200) NOT NULL,
  `respuesta_seguridad` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `Usuario`, `Nombre`, `Clave`, `Correo`, `Tipo_usuario`, `pregunta_seguridad`, `respuesta_seguridad`) VALUES
(1, 'jabreu', 'José Abreu', '$2a$08$WV0b2xku73i.JP7hk99t2eG5Y8sj2PlJZ0YR/As1E.tLLyLd8Ph6C', 'josealedesign@gmail.com', 'Maestro', 'Cual es tu main en lol', 'Neeko'),
(2, 'aramirez', 'Alexander Ramirez', '$2a$08$doU57/7Zvnq2zu2AqFv3NO0B7xKGaO9vUKkJ8RmcrCWgX2lZns462', 'aramirez@gmail.com', 'Normal', 'Cuanto algodon extraes por hora de la finca', 'diez toneladas'),
(3, 'bespaña', 'Barbara España', '$2a$08$1AKhbo7/EPklEtctD9HsROf91Fav2Yd0JBtUml0KChpEvqDNw.yUS', 'Bespana@gmail.com', 'Normal', 'saga favorita de peliculas', 'crepusculo'),
(5, 'Latencio', 'Luis Atencio', '$2a$08$KYoNsNbiPldbDFkspw8LvumOVhDUXCkijQEzUDse1zr9Vz8dKzv/i', 'latencio@gmail.com', 'Normal', '¿Quienes somos Alex y yo?', 'andre y beck');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `C.I_UNIQUE` (`CI`),
  ADD UNIQUE KEY `Correo_UNIQUE` (`Correo`);

--
-- Indices de la tabla `libro`
--
ALTER TABLE `libro`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personal_admin`
--
ALTER TABLE `personal_admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Correo_UNIQUE` (`Correo`),
  ADD UNIQUE KEY `C.I_UNIQUE` (`CI`);

--
-- Indices de la tabla `prestamo`
--
ALTER TABLE `prestamo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_libro_prestamo_idx` (`id_libro`),
  ADD KEY `fk_libro_profesor_idx` (`ci_Profesor`),
  ADD KEY `fk_libro_estudiante_idx` (`ci_Estudiante`),
  ADD KEY `fk_libro_padministrativo_idx` (`ci_Padministrativo`);

--
-- Indices de la tabla `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `C.I_UNIQUE` (`CI`),
  ADD UNIQUE KEY `Correo_UNIQUE` (`Correo`);

--
-- Indices de la tabla `sancion`
--
ALTER TABLE `sancion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sancion_prestamo_idx` (`id_prestamo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Correo_UNIQUE` (`Correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `libro`
--
ALTER TABLE `libro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `personal_admin`
--
ALTER TABLE `personal_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `prestamo`
--
ALTER TABLE `prestamo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `profesor`
--
ALTER TABLE `profesor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sancion`
--
ALTER TABLE `sancion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `prestamo`
--
ALTER TABLE `prestamo`
  ADD CONSTRAINT `fk_libro_estudiante` FOREIGN KEY (`ci_Estudiante`) REFERENCES `estudiante` (`CI`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_libro_padministrativo` FOREIGN KEY (`ci_Padministrativo`) REFERENCES `personal_admin` (`CI`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_libro_prestamo` FOREIGN KEY (`id_libro`) REFERENCES `libro` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_libro_profesor` FOREIGN KEY (`ci_Profesor`) REFERENCES `profesor` (`CI`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `sancion`
--
ALTER TABLE `sancion`
  ADD CONSTRAINT `fk_sancion_prestamo` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
