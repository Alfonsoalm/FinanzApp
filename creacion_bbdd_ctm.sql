

-- Crear la base de datos si no existe (opcional, solo si no existe la base de datos)
CREATE DATABASE IF NOT EXISTS gestion_de_proyectos;

-- Seleccionar la base de datos
USE gestion_de_proyectos;

-- Crear el usuario con autenticación nativa
CREATE USER IF NOT EXISTS 'IZRA'@'localhost' IDENTIFIED WITH mysql_native_password BY 'izra';

-- Asignar privilegios al usuario sobre la base de datos
GRANT ALL PRIVILEGES ON gestion_de_proyectos.* TO 'IZRA'@'localhost';

-- Recargar los privilegios
FLUSH PRIVILEGES;

-- DECLARACION DE TABLAS Y FUNCIONES

DROP TABLE IF EXISTS jornadas_teoricas CASCADE;
DROP TABLE IF EXISTS jornadas_reales CASCADE;
DROP TABLE IF EXISTS asignaciones CASCADE;
DROP TABLE IF EXISTS fases CASCADE;
DROP TABLE IF EXISTS vacaciones_tecnicos CASCADE;
DROP TABLE IF EXISTS festivos CASCADE;
DROP TABLE IF EXISTS bajas_laborales CASCADE;
DROP TABLE IF EXISTS salarios CASCADE;
DROP TABLE IF EXISTS tecnicos CASCADE;
DROP TABLE IF EXISTS proyectos CASCADE;
DROP TABLE IF EXISTS convocatorias CASCADE;
DROP TABLE IF EXISTS vacaciones_tecnicos CASCADE;
DROP TABLE IF EXISTS sedes;
DROP FUNCTION IF EXISTS gestion_de_proyectos.DiasLaboralesMes;
DROP FUNCTION IF EXISTS gestion_de_proyectos.ObtenerDiaLaborable;
DROP FUNCTION IF EXISTS gestion_de_proyectos.DiasLaboralesSemana;


-- Creacion tabla sedes
CREATE TABLE sedes (
  id_sede INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_sede)
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla tecnicos
CREATE TABLE tecnicos (
  id_tecnico int NOT NULL auto_increment,
  nombre varchar(256) NOT NULL,
  puesto varchar(50) NOT NULL,
  disminuciones_salariales double NOT NULL,
  id_sede INT NOT NULL,
  horas_jornada INT NOT NULL,
  fecha_incorporacion DATE NOT NULL,
  dni varchar(10) NOT NULL,
  usuario varchar(30) NOT NULL,
  contrasena varchar(30) NOT NULL,
  is_active bool NOT NULL,
  is_admin bool NOT NULL,
  PRIMARY KEY (id_tecnico),
  FOREIGN KEY (id_sede) REFERENCES sedes(id_sede) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla salario
CREATE TABLE salarios (
	id_salario INT NOT NULL auto_increment,
	grupo_cotizacion INT NOT NULL,
    salario_bruto DOUBLE NOT NULL,
    cuota_patronal DOUBLE NOT NULL,
    porcentaje_jornada int NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    id_tecnico int NOT NULL,
    PRIMARY KEY (id_salario),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla vacaciones tecnicos
CREATE TABLE vacaciones_tecnicos (
  id_vacaciones_tecnicos INT NOT NULL AUTO_INCREMENT,
  id_tecnico int NOT NULL,
  fecha DATE NOT NULL,
  estado varchar(20) DEFAULT 'Pendiente',
  PRIMARY KEY (id_vacaciones_tecnicos),
  FOREIGN KEY(id_tecnico) REFERENCES tecnicos(id_tecnico) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla festivos
CREATE TABLE festivos (
	id_festivo INT NOT NULL AUTO_INCREMENT,
    id_sede INT NOT NULL,
    dia_mes INT NOT NULL,
    mes INT NOT NULL,
    PRIMARY KEY (id_festivo),
    FOREIGN KEY (id_sede) REFERENCES sedes(id_sede) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;
    
-- Creacion tabla bajas laborales
CREATE TABLE bajas_laborales (
	id_baja_laboral INT NOT NULL AUTO_INCREMENT,
    id_tecnico INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    PRIMARY KEY (id_baja_laboral),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla convocatorias
CREATE TABLE convocatorias (
  id_convocatoria int NOT NULL auto_increment,
  tipo varchar(50) NOT NULL,
  anio int NOT NULL,
  limite_coste_hora_cp_a double NOT NULL,
  limite_coste_hora_cp_b double NOT NULL,  
  limite_coste_hora_cp_c double NOT NULL,
  enlace_info_convocatoria varchar(200),
  PRIMARY KEY (id_convocatoria)
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla proyectos
-- Anadir (TO-DO):
-- 		Numero de expediente
-- 		Representante agrupacion
-- 		NIF Representante agrupacion
CREATE TABLE proyectos (
  id_proyecto int NOT NULL auto_increment,
  nombre varchar(100) NOT NULL,
  duracion int NOT NULL,
  presupuesto double NOT NULL,
  tipo varchar(50) NOT NULL,
  presupuesto_restante double NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date,
  id_sede INT NOT NULL,
  id_convocatoria INT,
  estado varchar(20) DEFAULT 'En desarrollo',
  PRIMARY KEY (id_proyecto),
  FOREIGN KEY (id_sede) REFERENCES sedes(id_sede) ON DELETE CASCADE,
  FOREIGN KEY (id_convocatoria) REFERENCES convocatorias(id_convocatoria) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla fases
CREATE TABLE fases (
  id_fase int NOT NULL auto_increment,
  id_proyecto int NOT NULL,
  nombre varchar(100) NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  horas int NOT NULL,
  PRIMARY KEY (id_fase),
  FOREIGN KEY(id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla jornadas teoricas
CREATE TABLE jornadas_teoricas (
  id_jornada int NOT NULL auto_increment,
  id_proyecto int NOT NULL,
  id_fase int NOT NULL,
  id_tecnico int NOT NULL,
  horas int NOT NULL,
  fecha date,
  bloqueado bool default false,
  PRIMARY KEY (id_jornada),
  FOREIGN KEY(id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
  FOREIGN KEY(id_tecnico) REFERENCES tecnicos(id_tecnico) ON DELETE CASCADE,
  FOREIGN KEY(id_fase) REFERENCES fases(id_fase) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla jornadas reales
CREATE TABLE jornadas_reales (
  id_jornada int NOT NULL auto_increment,
  id_proyecto int NOT NULL,
  id_tecnico int NOT NULL,
  horas int NOT NULL,
  fecha date,
  hora_entrada time,
  hora_salida time,
  PRIMARY KEY (id_jornada),
  FOREIGN KEY(id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
  FOREIGN KEY(id_tecnico) REFERENCES tecnicos(id_tecnico) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Creacion tabla asignaciones
CREATE TABLE asignaciones (
  id_asignacion int NOT NULL auto_increment,
  -- id_proyecto int NOT NULL,
  id_tecnico int,
  id_fase int NOT NULL,
  horas int NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  PRIMARY KEY (id_asignacion),
  -- FOREIGN KEY(id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
  FOREIGN KEY(id_tecnico) REFERENCES tecnicos(id_tecnico) ON DELETE CASCADE,
  FOREIGN KEY(id_fase) REFERENCES fases(id_fase) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=00000 DEFAULT CHARSET=utf8mb4;

-- Declarar funcion para obtener los dias laborables
DELIMITER $$

CREATE FUNCTION DiasLaboralesMes(
    FechaInicial DATE,
    FechaFinal DATE,
    Id_tecnico INT,
    Id_sede INT
)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE fecha DATE;
    DECLARE diaslaborales INT DEFAULT 0;
    DECLARE comprobacion_festivo INT DEFAULT 0;

    SET fecha = FechaInicial;

    WHILE fecha <= FechaFinal DO
        IF WEEKDAY(fecha) NOT IN (5, 6) THEN
			
            -- Verificar si la fecha no coincide con ningun festivo
			IF	1 NOT IN  (SELECT 1 FROM festivos F, sedes S WHERE dia_mes = DAY(fecha) AND mes = MONTH(fecha) AND F.id_sede = S.id_sede AND S.id_sede = Id_sede) THEN
				-- Verificar si la fecha no coincide con ninguna peticion de vacaciones
				IF fecha NOT IN (SELECT VT.fecha FROM vacaciones_tecnicos VT WHERE VT.id_tecnico = Id_tecnico) THEN
					-- Verificar si la fecha no coincide con una baja laboral
                    IF 1 NOT IN (SELECT 1 FROM bajas_laborales BL WHERE fecha BETWEEN BL.fecha_inicio AND BL.fecha_fin AND BL.id_tecnico = Id_tecnico) THEN
						SET diaslaborales = diaslaborales + 1;
					END IF;
				END IF;
			END IF;
                        
        END IF;
        SET fecha = fecha + INTERVAL 1 DAY;
    END WHILE;

    RETURN diaslaborales;
END$$

DELIMITER ;

-- ----------------
DELIMITER $$

CREATE FUNCTION ObtenerDiaLaborable(
    Fecha_dia DATE,
    Id_tecnico INT,
    Id_sede INT
)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE fecha DATE;
    DECLARE dialaboral BOOLEAN DEFAULT FALSE;

    SET fecha = Fecha_dia;
    
	IF WEEKDAY(fecha) != 5 AND WEEKDAY(fecha) != 6 THEN
		-- Verificar si la fecha no coincide con ningun festivo
		IF	1 NOT IN  (SELECT 1 FROM festivos F, sedes S WHERE dia_mes = DAY(fecha) AND mes = MONTH(fecha) AND F.id_sede = S.id_sede AND S.id_sede = Id_sede) THEN
			-- Verificar si la fecha no coincide con ninguna peticion de vacaciones
			IF fecha NOT IN (SELECT VT.fecha FROM vacaciones_tecnicos VT WHERE VT.id_tecnico = Id_tecnico) THEN
				-- Verificar si la fecha no coincide con una baja laboral
				IF 1 NOT IN (SELECT 1 FROM bajas_laborales BL WHERE fecha BETWEEN BL.fecha_inicio AND BL.fecha_fin AND BL.id_tecnico = Id_tecnico) THEN
					SET dialaboral = TRUE;
				END IF;
			END IF;
		END IF;
	END IF;

    RETURN dialaboral;
END$$

DELIMITER ;

-- -----------
DELIMITER $$

CREATE FUNCTION DiasLaboralesSemana(
    Dia DATE,
    Id_tecnico INT,
    Id_sede INT
)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE fecha_inicio DATE;
    DECLARE fecha_fin DATE;
    DECLARE fecha DATE;
    DECLARE diaslaborales INT DEFAULT 0;

    -- Calcular el inicio y el fin de la semana del dia proporcionado
    SET fecha_inicio = CASE 
							WHEN (Dia - INTERVAL (WEEKDAY(Dia)) DAY) < DATE_FORMAT(Dia, '%Y-%m-01')
								THEN DATE_FORMAT(Dia, '%Y-%m-01')
							ELSE (Dia - INTERVAL (WEEKDAY(Dia)) DAY) 
                        END;
    SET fecha_fin = CASE 
						WHEN (Dia + INTERVAL (4 - WEEKDAY(Dia)) DAY) > LAST_DAY(Dia)
							THEN LAST_DAY(Dia)
						ELSE (Dia + INTERVAL (4 - WEEKDAY(Dia)) DAY)
					END;

    SET fecha = fecha_inicio;

    WHILE fecha <= fecha_fin DO
        IF WEEKDAY(fecha) NOT IN (5, 6) THEN
            
            -- Verificar si la fecha no coincide con ningun festivo
            IF 1 NOT IN (SELECT 1 FROM festivos F, sedes S 
                         WHERE dia_mes = DAY(fecha) AND mes = MONTH(fecha) 
                         AND F.id_sede = S.id_sede AND S.id_sede = Id_sede) THEN
                -- Verificar si la fecha no coincide con ninguna peticion de vacaciones
                IF fecha NOT IN (SELECT VT.fecha FROM vacaciones_tecnicos VT 
                                 WHERE VT.id_tecnico = Id_tecnico) THEN
                    -- Verificar si la fecha no coincide con una baja laboral
                    IF 1 NOT IN (SELECT 1 FROM bajas_laborales BL 
                                 WHERE fecha BETWEEN BL.fecha_inicio AND BL.fecha_fin 
                                 AND BL.id_tecnico = Id_tecnico) THEN
                        SET diaslaborales = diaslaborales + 1;
                    END IF;
                END IF;
            END IF;

        END IF;
        SET fecha = fecha + INTERVAL 1 DAY;
    END WHILE;

    RETURN diaslaborales;
END$$

DELIMITER ;


-- INSERTAR DATOS
-- Insertar sedes
INSERT INTO sedes (nombre)
VALUES ('CO'),('LI'),('ZA');

-- INSERTAR CONVOCATORIAS
-- Depende de la categoria profesional hay un limite salarial u otro
INSERT INTO convocatorias (tipo, anio, limite_coste_hora_cp_a, limite_coste_hora_cp_b, limite_coste_hora_cp_c, enlace_info_convocatoria)
VALUES ('GRUPOS OPERATIVOS', 2022, 19.67, 17.67, 15.67, ""),
('GRUPOS OPERATIVOS', 2023, 19.67, 17.67, 15.67, ""),
('GRUPOS OPERATIVOS', 2024, 19.67, 17.67, 15.67, ""),
('EDIH', 2024, 19.67, 17.67, 15.67, "");


-- Insertar proyectos
INSERT INTO proyectos (nombre, duracion, presupuesto, tipo, presupuesto_restante, fecha_inicio, fecha_fin, id_sede, id_convocatoria)
VALUES ('AGROSEC', 23, 55999, 'GO', 55999, '2023-05-01', '2025-04-30', 1, 1), -- 1
('BIOTERRABOT', 23, 46975, 'AEI', 46975, '2023-07-01', '2025-06-30', 1, 2), -- 2
('GREEN APP', 23, 38500, 'GO', 38500, '2022-09-01', '2024-08-31', 1, 3), -- 3
('PREDIC I', 38, 52010, 'GO', 52010, '2021-05-01', '2024-06-30', 1, 4), -- 4
('GEDEFEC III', 11, 22110, 'GO', 22110, '2023-05-16', '2024-04-15', 2, 1), -- 5
('CLIMAFARM', 24, 20000, 'GO', 20000, '2023-04-01', '2025-03-31', 1, 2), -- 6
('INSIGNIA', 24, 25000, 'GO', 25000, '2023-05-01', '2025-04-30', 1, 3), -- 7
('OLIKE', 24, 25000, 'GO', 25000, '2023-04-01', '2025-03-31', 1, 4), -- 8
('OAPR Cordoba', 24, 392000, 'OAP', 392000,	'2022-08-29',	'2024-08-29',	1, 4) -- 9
;
-- METAL LEAD 01-01 31-12
-- MUHLTEN 

-- Insertar tecnicos
INSERT INTO tecnicos (id_tecnico, nombre, puesto, disminuciones_salariales, id_sede, horas_jornada, fecha_incorporacion, dni, usuario, contrasena, is_active, is_admin)
VALUES (-1, "Sin asignar", "-", 0, 1, 8, '1999-01-01',  "-", '-', '-', 0, 0);
 
INSERT INTO tecnicos (nombre, puesto, disminuciones_salariales, id_sede, horas_jornada, fecha_incorporacion, dni, usuario, contrasena, is_active, is_admin)
VALUES ('Alfonso Almenara', 'Ingeniero de Sistemas', 1, 1, 8, '2000-12-27', '123456789A', 'cetemet_aal',"prueba", 1, 0), -- 1
('Jose Manuel Martinez', 'Ingeniero de Sistemas', 1, 1, 8, '2000-12-27', '123456789A', 'cetemet_jmm', "prueba", 1, 0), -- 2
('T1', 'Ingeniero de Sistemas', 1, 1, 8, '2000-12-27', '123456789A', 'cetemet_t1',"prueba" , 1, 0), -- 3
('FP2', 'Ingeniero de Sistemas', 1, 1, 8, '2000-12-27', '123456789A', 'cetemet_fp2', "prueba",1, 0), -- 4
('Juan Antonio Cordon', 'GC2', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_jac', "prueba",1, 0), -- 5
('Eugenio Jesus Noguera', 'GC2', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_ejn', "prueba",1, 0), -- 6
('Francisco Javier Gracia','Ingeniero Electronico GC1', 1, 1, 8, '2000-12-27', '123456789A', 'cetemet_fjg',"prueba",1, 0), -- 7
('Jesus Rodero Perez', 'GC1', 1, 1, 8, '2000-12-27', '123456789A', 'cetemet_jrp',"prueba",1, 1), -- 8
('Rafa Arjona', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_rar', "prueba",1, 0), -- 9
('Aurora Ana Perez', 'GC2', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_aap', "prueba",1, 0), -- 10
('Fernando Cortijo','GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_fco',"prueba",1, 0), -- 11
('Alberto Adamuz', 'GC1', 1, 1, 8, '2000-12-27', '123456789A', 'cetemet_adp', "prueba",1, 1), -- 12
('Miguel de la O', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_mlo',"prueba",1, 0), -- 13
('Mari Carmen Lopez', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_mcl', "prueba",1, 1), -- 14
('Antonia Merino', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_ama', "prueba",1, 1), -- 15
('Isabel Madrid', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_ima', "prueba", 1, 1), -- 16
('Gema Padillo', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_gpa', "prueba", 1, 1), -- 17
('Jose Luis Aguayo', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_jla', "prueba", 1, 0), -- 18
('Raul Garcia', 'GC1', 1, 2, 8, '2000-12-27', '123456789A', 'cetemet_rgs', "prueba", 1, 0) -- 19
;

-- Insertar salarios
INSERT INTO salarios (grupo_cotizacion, salario_bruto, cuota_patronal, porcentaje_jornada, fecha_inicio, fecha_fin, id_tecnico)
VALUES 
( 1, 33000, 1000, 100, '2023-12-20', '2024-12-20',1),
( 2, 25000, 900, 100, '2023-12-20', '2024-12-20',1),
( 2, 28000, 900, 100, '2023-12-20', '2024-12-20',1);	

-- Insertar las fases de los proyectos
INSERT INTO fases (id_proyecto, nombre, fecha_inicio, fecha_fin, horas)
VALUES -- AGROSEC
(1, 'PT1 Estado del arte', '2023-05-01', '2023-06-30', 150), -- 1
(1, 'PT2 Valorizacion de restos de poda del olivar', '2023-06-01', '2023-10-31', 100), -- 2
(1, 'PT3 Diseno y fabricacion del sistema desecante', '2023-10-01', '2024-05-30', 1257), -- 3
(1, 'PT4 Implementacion de los sistemas desecantes', '2024-04-01', '2025-02-28', 400), -- 4
(1, 'PT5 Evaluacion de los sistemas desecantes', '2024-04-01', '2025-02-28', 700), -- 5
(1, 'PT6 Redaccion de informes finales', '2023-11-01', '2025-04-30', 250), -- 6

-- BIOTERRABOT
(2, 'PT01 Estudio Promenorizado del Estado del arte', '2023-07-01', '2023-10-31', 100), -- 7
(2, 'PT04 Desarrollo de AMR', '2023-07-01', '2024-12-31', 500), -- 8
(2, 'PT05 Diseno y programacion del algoritmo para ejecucion de tareas', '2023-07-01', '2025-02-28', 758), -- 9
(2, 'PT06 Diseno y fabricacion de apero de siega mecanica', '2024-08-01', '2025-03-31', 1300), -- 10
(2, 'PT07 Desarrollo aplicacion cloud', '2024-01-01', '2024-09-30', 250), -- 11
(2, 'PT08 Implementacion y Pruebas de campo', '2024-08-01', '2025-06-30', 310), -- 12
(2, 'PT09 Redaccion de informes finales', '2025-03-01', '2025-06-30', 256), -- 13
-- GREEN APP
(3, 'PT0 Estudio pormenorizado del estado del arte', '2022-09-26', '2022-12-02', 292), -- 14
(3, 'Diseno planta compostaje', '2022-10-31', '2024-08-02', 1522), -- 15
(3, 'Redaccion informes', '2023-04-03', '2024-08-30', 885), -- 16
-- PREDIC I
(4, 'Planificacion  campanas adquisicion datos y analisis', '2021-08-02', '2021-12-31', 669), -- 17
(4, 'Integracion informacion en base de datos', '2021-11-01', '2023-10-06', 2115), -- 18
(4, 'Informes', '2022-08-01', '2024-06-28', 522), -- 19
-- GEDEEFEC III
(5, 'PT1', '2023-08-21', '2024-04-19', 78), -- 20
(5, 'PT10', '2023-08-21', '2023-12-29', 135), -- 21
(5, 'PT11', '2023-08-21', '2024-12-29', 315), -- 22
(5, 'PT12', '2023-12-04', '2024-04-19', 325), -- 23
-- CLIMAFARM
(6, 'PT0 Gestion y Coordinacion del proyecto', '2023-02-27', '2025-03-28', 100), -- 24
(6, 'PT1 Estudio Promenorizado del Estado del Arte', '2023-02-27', '2023-06-02', 126), -- 25
(6, 'PT2 Planificar y Desarrollar la Adquisicion de Datos', '2023-03-27', '2025-03-28', 180), -- 26
(6, 'PT3 Integracion de la Informacion en una Base de Datos', '2023-06-05', '2024-11-29', 150), -- 27
(6, 'PT4 Diseno Prototipo', '2023-09-04', '2023-12-01', 180), -- 28
(6, 'PT5 Fabricacion y Validacion Prototipo', '2024-03-04', '2024-05-30', 149), -- 29
(6, 'PT6 Informes', '2023-12-04', '2024-03-01', 254), -- 30
-- INSIGNIA
(7, 'PT0 Gestion y Coordinacion del proyecto', '2023-05-01', '2025-05-02', 150), -- 31
(7, 'PT1 Estudio Pormenorizado del Estado del Arte', '2023-06-05', '2023-09-29', 105), -- 32
(7, 'PT2 Analisis de Comunicaciones y Dispositivos', '2023-05-01', '2024-03-01', 60), -- 33
(7, 'PT4 Desarrollo de Datos y Seguimiento', '2023-05-01', '2024-08-30', 60), -- 34
(7, 'PT5 Analisis de Datos y Seguimiento', '2024-07-01', '2025-02-28', 200), -- 35
(7, 'PT6 Desarrollo de Modelos Predictivos y de Actuacion', '2024-02-05', '2025-02-28', 605), -- 36
(7, 'PT7 Redaccion de Informes Finales', '2025-02-03', '2025-05-02', 240), -- 37
-- OLIKE
(8, 'PT1 Estudio Pormenorizado del Estado del Arte', '2023-04-03', '2023-12-01', 150), -- 38
(8, 'PT2 Planificacr y desarrollar la adquisicion de datos', '2023-04-03', '2025-05-28', 600), -- 39
(8, 'PT3 Integracion de la Informacion en una Base de Datos', '2023-06-05', '2023-11-01', 60), -- 40
(8, 'PT4 Diseno Prototipo', '2023-09-04', '2024-08-30', 50), -- 41
(8, 'PT5 Fabricacion y Validacion Prototipo', '2024-05-04', '2025-02-28', 45), -- 42
(8, 'PT6 Informes', '2023-12-04', '2025-03-28', 450), -- 43
-- OAP Cordoba
(9, 'L1 Linea de actuacion puesta en marcha de la OAPR.', '2022-08-29', '2022-11-29', 1080), -- 38
(9, 'L2 Linea de actuacion generacion, difusion.', '2022-08-29', '2024-08-29', 1920), -- 38
(9, 'L3 Linea de actuacion organizacion de eventos y D.T.', '2022-10-29', '2024-08-29', 1300), -- 38
(9, 'L4 Linea de actuacion captacion de empresas', '2022-08-29', '2024-08-29', 660), -- 38
(9, 'L5 Linea de actuacion apoyo y soporte tecnico.', '2022-09-29', '2024-08-29', 3750), -- 38
(9, 'L6 Linea de actuacion planes de transformacion digital', '2022-08-29', '2022-11-29', 0), -- 38
(9, 'L7 Linea de actuacion apoyo, soporte tecnico y ayudas.', '2022-09-29', '2024-08-29', 990), -- 38
(9, 'L8 Linea de networking', '2022-10-29', '2024-08-29', 560); -- 38


-- Insertar las asignaciones
-- AGROSEC
INSERT INTO asignaciones (id_tecnico, id_fase, horas, fecha_inicio, fecha_fin) 
VALUES ( 3, 1, 150, '2023-05-01','2023-06-30'),
( 2, 2, 100, '2023-06-01','2023-10-31'),
( 3, 3, 957, '2023-10-01', '2024-05-30'),
( 2, 3, 300, '2023-10-01', '2024-05-30'),
( 2, 4, 400, '2024-04-01','2025-02-28'),
( 3, 5, 700, '2024-04-01', '2025-02-28'),
( 3, 6, 62, '2023-11-01', '2023-11-30'),
( 3, 6, 63, '2024-02-01', '2024-02-29'),
( 3, 6, 125, '2025-03-01', '2025-04-30'),
-- BIOTERRABOT
-- id_proyecto: 2, Miguel de la O: 13, FP II: 4, Jose Manuel Martinez: 2
-- 'PT01 Estudio Promenorizado del Estado del arte', '2023-07-01', '2023-10-31'), -- 7
-- 'PT04 Desarrollo de AMR', '2023-07-01', '2024-12-31'), -- 8
-- 'PT05 Diseno y programacion del algoritmo para ejecucion de tareas', '2023-07-01', '2025-02-28'), -- 9
-- 'PT06 Diseno y fabricacion de apero de siega mecanica', '2024-08-01', '2025-03-31'), -- 10
-- 'PT07 Desarrollo aplicacion cloud', '2024-01-01', '2024-09-30'), -- 11
-- 'PT08 Implementacion y Pruebas de campo', '2024-08-01', '2025-06-30'), -- 12
-- 'PT09 Redaccion de informes finales', '2025-03-01', '2025-06-30'), -- 13
(13, 7, 20, '2023-07-01', '2023-10-31'),
(13, 8, 250, '2023-07-01', '2024-12-31'),
(13, 9, 118, '2023-07-01', '2025-02-28'),
(13, 10, 120, '2024-09-02', '2025-04-18'),
(13, 11, 10, '2024-03-04', '2024-11-29'),
(13, 12, 70, '2024-09-02', '2024-06-27'),
(13, 13, 79, '2025-03-03', '2025-06-27'),
(2, 7, 40, '2023-07-01', '2023-10-31'),
(2, 8, 206, '2023-07-01', '2024-12-31'),
(2, 9, 336, '2023-07-01', '2025-01-15'),
(2, 10, 590, '2024-09-02', '2025-01-15'),
(2, 11, 120, '2024-03-04', '2024-11-29'),
(2, 12, 58, '2024-09-02', '2025-01-15'),
(4, 7, 40, '2023-07-01', '2023-10-31'),
(4, 8, 44, '2023-07-01', '2024-12-31'),
(4, 9, 304, '2025-01-15', '2025-02-28'),
(4, 10, 590, '2025-01-15', '2025-05-09'),
(4, 11, 120, '2024-03-04', '2024-11-29'),
(4, 12, 182, '2025-01-15', '2025-06-27'),
(4, 13, 177, '2025-03-03', '2025-06-27'),
-- GREEN APP
-- id_proyecto: 3, Juan Antonio: 5, Eugenio Jesus: 6, Francisco Javier Gracia: 7
(5, 14, 62, '2022-09-26', '2022-12-02'),
(5, 15, 461, '2022-10-31', '2024-08-02'),
(5, 16, 92, '2023-03-20', '2023-04-28'),
(5, 16, 24, '2023-10-09', '2023-10-27'),
(5, 16, 74, '2023-11-27', '2023-12-29'),
(5, 16, 33, '2024-08-05', '2024-08-30'),
(6, 15, 692, '2023-07-31', '2024-07-21'),
(6, 16, 70, '2023-12-04', '2023-12-29'),
(6, 16, 227, '2024-07-01', '2024-08-30'),
(7, 14, 192, '2022-09-26', '2022-12-09'),
(7, 14, 38, '2023-01-16', '2023-02-10'),
(7, 15, 56, '2023-01-16', '2023-02-17'),
(7, 15, 20, '2023-03-06', '2023-03-31'),
(7, 15, 84, '2023-05-08', '2023-06-30'),
(7, 15, 72,'2023-07-17', '2023-08-11'),
(7, 15, 48,'2023-09-04','2023-10-13'),
(7, 15, 33,'2023-11-06', '2023-11-24'),
(7, 15, 56, '2024-01-08', '2024-02-23'),
(7, 16, 125, '2023-03-27', '2023-05-05'),
(7, 16, 104, '2023-11-27', '2024-01-05'),
(7, 16, 136, '2024-07-08', '2024-08-30'),
-- Las horas que estaban asignadas aunque fuesen fuera de lo coloreado las he anadido
-- PREDIC I, Jesus Rodero: 8, Rafa Arjona: 9, Aurora Ana Perez: 10
(8, 17, 195, '2021-08-02', '2021-12-31'),
(8, 18, 0, '2021-11-01', '2022-09-02'),
(8, 18, 725, '2023-02-06', '2024-01-26'),
(8, 19, 8,'2022-09-05', '2022-10-14'),
(8, 19, 77, '2023-07-03', '2023-09-01'),
(8, 19, 31, '2024-04-01', '2024-06-28'),
(9, 17, 136, '2021-07-19', '2021-12-31'),
(9, 17, 40, '2022-08-01', '2022-09-02'),
(9, 17, 88, '2022-10-03', '2022-11-25'),
(9, 18, 16, '2021-11-01', '2022-10-21'),
(9, 18, 240, '2023-05-01', '2023-11-10'),
(9, 19, 40, '2022-08-01', '2022-09-30'),
(9, 19, 62, '2023-07-03', '2023-09-08'),
(9, 19, 48, '2023-10-30', '2023-12-22'),
(10, 17, 210, '2022-09-05', '2022-10-21'),
(10, 18, 1134, '2023-05-01', '2024-03-29'),
(10, 19, 76, '2023-06-19', '2023-08-18'),
(10, 19, 180, '2024-04-01', '2024-06-28'),
-- GEDEFEC III
(11, 20, 22, '2023-08-21', '2023-09-15'),
(11, 20, 16, '2023-11-20', '2023-12-22'),
(11, 20, 16, '2024-02-05', '2024-02-16'),
(11, 20, 16, '2024-03-04', '2024-03-15'),
(11, 20, 8, '2024-04-01', '2024-04-12'),
(11, 21, 135, '2023-08-21', '2023-12-29'),
(11, 22, 315, '2023-08-21', '2023-12-29'),
(11, 23, 325, '2023-12-04', '2024-04-19'),
-- CLIMAFARM
(8, 24, 100,'2023-02-27', '2025-03-28'),
(8, 25, 126, '2023-02-27', '2023-06-02'),
(8, 26, 180, '2023-03-27', '2025-03-28'),
(8, 27, 150, '2023-06-05', '2024-11-29'),
(8, 28, 180, '2023-12-11', '2023-12-15'),
(8, 29, 148.5, '2024-03-04', '2025-05-30'),
(8, 30, 84, '2023-12-04', '2024-03-01'),
(8, 30, 170, '2025-02-03', '2025-05-30'),
-- INSIGNIA
-- id_proyecto: 7, Francisco Javier Gracia: 7, Alberto Adamuz: 12
(7, 31, 130,'2023-05-01', '2025-05-02'),
(7, 32, 40,'2023-06-05', '2023-09-29'),
(7, 33, 25,'2023-05-01', '2024-03-01'),
(7, 34, 30,'2023-05-01', '2024-08-30'),
(7, 35, 120,'2024-07-01', '2025-02-28'),
(7, 36, 270,'2024-02-05', '2025-02-28'),
(7, 37, 140,'2025-02-03', '2025-05-02'),
(12, 31, 20,'2023-07-10', '2025-05-02'),
(12, 32, 65,'2023-07-10', '2023-09-29'),
(12, 33, 35,'2023-07-10', '2024-03-01'),
(12, 34, 30,'2023-07-10', '2024-08-30'),
(12, 35, 80,'2024-07-01', '2025-02-28'),
(12, 36, 335,'2024-02-05', '2025-02-28'),
(12, 37, 100,'2025-02-03', '2025-05-02'),
-- OLIKE
-- id_proyecto: , Eugenio Jesus Noguera: 6;
(6, 38, 150,'2023-04-03', '2023-12-01'),
(6, 39, 600, '2023-04-03', '2025-05-28'),
(6, 40, 60, '2023-06-05', '2023-11-01'),
(6, 41, 50, '2023-09-04', '2024-08-30'),
(6, 42, 45, '2024-05-04', '2025-02-28'), 
(6, 43, 150, '2023-12-04', '2024-03-01'), 
(6, 43, 150, '2024-07-03', '2024-09-13'),
(6, 43, 150, '2024-12-02', '2025-03-28'),
-- OAP Rural
(14, 44, 480, '2022-08-29', '2022-11-29'),
(14, 45, 408, '2022-08-29', '2024-08-29'),
(14, 46, 337, '2022-10-28', '2024-08-29'),
(14, 47, 548, '2022-08-29', '2024-08-29'),
(14, 48, 657, '2022-09-29', '2024-08-29'),
(14, 50, 188, '2022-09-29', '2024-08-29'),
(14, 51, 347, '2024-10-29', '2024-08-29'),
(15, 44, 400, '2022-08-29', '2022-11-29'),
(15, 45, 1400, '2022-08-29', '2024-08-29'),
(15, 48, 300, '2022-09-29', '2024-08-29'),
(15, 51, 250, '2022-09-29', '2024-08-29'),
(16, 44, 200, '2022-08-29', '2022-11-29'),
(16, 46, 294, '2022-10-28', '2024-08-29'),
(16, 47, 244, '2022-08-29', '2024-08-29'),
(16, 48, 324, '2022-09-29', '2024-08-29'),
(16, 50,	934, '2022-09-29', '2024-08-29'),
(16, 51,	94, '2022-10-28', '2024-08-29'),
(19, 45,	253, '2022-08-29', '2024-08-29'),
(17, 45,	253, '2022-08-29', '2024-08-29'),
(18, 45,	254,  '2022-08-29', '2024-08-29'),
(19, 46,	454, '2022-10-28', '2024-08-29'),
(17, 46,	453, '2022-10-28', '2024-08-29'),
(18, 46,	453, '2022-10-28', '2024-08-29'),
(19, 48,	1053, '2022-09-29', '2024-08-29'),
(17, 48,	1054, '2022-09-29', '2024-08-29'),
(18, 48, 1053, '2022-09-29', '2024-08-29');

-- Insertar los festivos para Cordoba (id_sede = 1)
INSERT INTO festivos (id_sede, dia_mes, mes) VALUES
(1, 1, 1),   -- Ano Nuevo
(1, 6, 1),   -- Epifania del Senor
(1, 28, 2),  -- Dia de Andalucia
(1, 1, 5),   -- Dia del Trabajador
(1, 15, 8),  -- Asuncion de la Virgen
(1, 12, 10), -- Dia de la Hispanidad
(1, 24, 10), -- San Rafael
(1, 1, 11),  -- Todos los Santos
(1, 6, 12),  -- Dia Constitucion
(1, 8, 12),  -- Inmaculada Concepcion
(1, 25, 12); -- Navidad

-- Insertar los festivos para Linares (id_sede = 2)
INSERT INTO festivos (id_sede, dia_mes, mes) VALUES
(2, 1, 1),   -- Ano Nuevo
(2, 6, 1),   -- Epifania del Senor
(2, 28, 2),  -- Dia de Andalucia
(2, 1, 5),   -- Dia del Trabajador
(2, 5, 8),   -- Virgen de Linarejos
(2, 15, 8),  -- Asuncion de la Virgen
(2, 28, 8),  -- San Agustin
(2, 12, 10), -- Dia de la Hispanidad
(2, 1, 11),  -- Todos los Santos
(2, 6, 12),  -- Dia Constitucion
(2, 8, 12),  -- Inmaculada Concepcion
(2, 25, 12); -- Navidad

-- Insertar las vacaciones
-- Alfonso Almenara: 1
-- Jose Manuel Martinez: 2
-- T1: 3
-- FP2: 4
-- Juan Antonio Cordon: 5
-- Eugenio Jesus Noguera: 6
-- Francisco Javier Gracia: 7
-- Jesus Rodero Perez: 8
-- Rafa Arjona: 9
INSERT INTO vacaciones_tecnicos (id_tecnico, fecha) VALUES
(8, '2021-08-02'), (8, '2021-08-03'), (8, '2021-08-04'), (8, '2021-08-05'), (8, '2021-08-06'), (8, '2021-08-09'), (8, '2021-08-10'),
(8, '2021-08-11'), (8, '2021-08-12'), (8, '2021-08-13'), (8, '2021-09-06'), (8, '2021-10-11'), (8, '2021-12-07'), (8, '2021-12-27'),
(8, '2021-12-28'), (8, '2021-12-29'), (8, '2021-12-30'), (8, '2021-12-31'), (8, '2022-01-03'), (8, '2022-01-04'), (8, '2022-01-05'),
(8, '2022-01-07'), (8, '2022-08-04'), (8, '2022-08-05'), (8, '2022-08-08'), (8, '2022-08-09'), (8, '2022-08-10'), (8, '2022-08-11'),
(8, '2022-08-12'), (8, '2022-09-01'), (8, '2022-09-02'), (8, '2022-09-05'), (8, '2022-09-06'), (8, '2022-09-07'), (8, '2022-09-09'),
(8, '2022-10-13'), (8, '2022-10-14'), (8, '2022-12-05'), (8, '2022-12-07'), (8, '2022-12-09'), (8, '2022-12-27'), (8, '2022-12-28'),
(8, '2022-12-29'), (8, '2022-12-30'), (8, '2023-01-02'), (8, '2023-01-03'), (8, '2023-01-04'), (8, '2023-07-31'), (8, '2023-08-01'),
(8, '2023-08-02'), (8, '2023-08-03'), (8, '2023-08-04'), (8, '2023-08-07'), (8, '2023-08-08'), (8, '2023-08-09'), (8, '2023-08-10'),
(8, '2023-08-11'), (8, '2023-12-04'), (8, '2023-12-05'), (8, '2023-12-07'), (8, '2023-12-26'), (8, '2023-12-27'), (8, '2023-12-28'),     
(8, '2023-12-29'), (8, '2024-01-02'), (8, '2024-01-03'), (8, '2024-01-04'), (8, '2024-01-05'), (8, '2024-07-29'), (8, '2024-07-30'),
(8, '2024-07-31'), (8, '2024-08-01'), (8, '2024-08-02'), (8, '2024-08-05'), (8, '2024-08-06'), (8, '2024-08-07'), (8, '2024-08-08'), 
(8, '2024-08-09'), (8, '2024-08-12'), (8, '2024-08-13'), (8, '2024-08-14'), (8, '2024-08-16'), (8, '2024-09-30'), (8, '2024-12-26'), 
(8, '2024-12-27'), (8, '2024-12-30'), (8, '2024-12-31'), (14, '2022-08-29'), (14, '2022-08-30'), (14, '2022-08-31'), (14, '2022-09-01'), 
(14, '2022-09-02'), (14, '2022-10-31'), (14, '2022-11-02'), (14, '2022-11-03'), (14, '2022-11-04'), (16, '2022-10-31');

-- Insertar las bajas laborales
INSERT INTO bajas_laborales (id_tecnico, fecha_inicio, fecha_fin) VALUES
(9, '2022-12-24', '2023-04-17');
