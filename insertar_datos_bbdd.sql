-- Insertar datos de ejemplo en la tabla de ingresos
INSERT INTO incomes (amount, category, type, description, date) VALUES
(2000, 'Salario', 'recurrent', 'Salario mensual', '2023-01-01'),
(500, 'Freelance', 'one-time', 'Proyecto de diseño', '2023-03-15'),
(700, 'Freelance', 'one-time', 'Proyecto de diseño 2', '2023-07-15'),
(700, 'Venta', 'one-time', 'Venta de artículos', '2023-08-20'),

-- Insertar datos de ejemplo en la tabla de gastos
INSERT INTO expenses (amount, category, type, description, date) VALUES
(800, 'Alquiler', 'recurrent', 'Pago mensual del alquiler', '2023-01-01'),
(150, 'Servicios', 'recurrent', 'Pago de electricidad', '2023-01-01'),
(100, 'Comida', 'one-time', 'Cena con amigos', '2023-02-10'),
(200, 'Transporte', 'recurrent', 'Pago mensual del transporte', '2023-03-01'),
(500, 'Educación', 'one-time', 'Curso de desarrollo web', '2023-04-15'),
(50, 'Ocio', 'one-time', 'Cine y palomitas', '2023-05-05'),
(800, 'Alquiler', 'recurrent', 'Pago mensual del alquiler', '2023-06-01'),
(200, 'Ropa', 'one-time', 'Compra de ropa de verano', '2023-07-10');

-- Insertar datos de ejemplo en la tabla de ahorros
INSERT INTO savings (amount, category, interest_rate, type, description, date) VALUES
(300, 'Fondo indexado', 5.00, 'recurrent', 'Aportación mensual al fondo', '2023-01-01'),
(200, 'Cuenta de ahorros remunerada', 3.00, 'one-time', 'Aportación inicial', '2023-02-15'),
(300, 'Fondo indexado S&P500', 8.00, 'recurrent', 'Aportación mensual al fondo', '2023-03-01'),
(350, 'Fondo indexado MSCI', 8.00, 'recurrent', 'Aportación mensual al fondo', '2023-04-01'),
(500, 'Cuenta de ahorros', 1.50, 'one-time', 'Ingreso extraordinario', '2023-05-20'),
