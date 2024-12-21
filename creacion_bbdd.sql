-- Borrar la base de datos si ya existe
DROP DATABASE IF EXISTS gestion_finanzas_personales;

-- Crear la base de datos
CREATE DATABASE gestion_finanzas_personales;

-- Seleccionar la base de datos
USE gestion_finanzas_personales;

-- Crear el usuario
CREATE USER IF NOT EXISTS 'user_finanzas'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_finanzas';

-- Asignar privilegios al usuario
GRANT ALL PRIVILEGES ON gestion_finanzas_personales.* TO 'user_finanzas'@'localhost';

-- Recargar los privilegios
FLUSH PRIVILEGES;

-- Crear las tablas
-- Tabla de ingresos
CREATE TABLE incomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type ENUM('recurrent', 'one-time') NOT NULL,
    description VARCHAR(100) NOT NULL, -- Descripción del ingreso
    date DATE NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Tabla de gastos
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type ENUM('recurrent', 'one-time') NOT NULL,
    description VARCHAR(100) NOT NULL, -- Descripción del gasto
    date DATE NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Tabla de ahorros
CREATE TABLE savings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Clasificación del ahorro
    interest_rate DECIMAL(5, 2) DEFAULT 0, -- Porcentaje de interés
    description VARCHAR(100) NOT NULL, -- Descripción del ahorro
    type ENUM('recurrent', 'one-time') NOT NULL, -- Tipo de ahorro (recurrente o puntual)
    date DATE NOT NULL -- Fecha del ahorro
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;