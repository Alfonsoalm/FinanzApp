# Finanzapp

Esta aplicación permite a los usuarios gestionar y proyectar sus finanzas personales, integrando datos de ingresos, gastos y ahorros. Proporciona herramientas avanzadas para el análisis financiero, visualización interactiva y exportación de datos.

## Características
1. **Registro de ingresos y gastos para finanzas personales**
   - Permite añadir los ingresos mensuales ya sean recurrentes o puntuales.
   - Añade los gastos mensuales ya sean fijos o puntuales.
   - Todos los cambios visualizados al instante y editables

2. **Vista de ahorros**
   - Permite registrar los ahorros existentes y futuros a partir del balance mensual
   - Establece inversiones de fondos indexados, cuentas remuneradas o sin remunerar, fondos monetarios, etc.

3. **Resumen Financiero**:
   - Resumen mensual de ingresos, gastos y balance.
   - Gráficos dinámicos (circular y de línea) para analizar tendencias y distribución.
   - Detalle de ingresos, gastos y ahorros totales, incluyendo categorías, fechas y tipo.
   - Permite la exportación del resumen financiero anual y detallado en archivos Excel y PDF.

4. **Cálculo de Proyecciones**:
   - Genera proyecciones detalladas de los ahorros hasta 60 años.
   - Incluye contribuciones recurrentes (mensuales) y puntuales (única vez).
   - Aplica tasas de interés mensuales para calcular el crecimiento acumulado.

## Tecnologías Utilizadas
- **React.js**: Para la creación de una interfaz de usuario dinámica e interactiva.
- **Electron**: Para desarrollar la aplicación como un entorno de escritorio multiplataforma.
- **Chart.js**: Para gráficos dinámicos y visualización avanzada de datos financieros.
- **Context API**: Para la gestión de estado global de la aplicación (ingresos, gastos, ahorros).
- **XLSX**: Para la exportación de datos financieros a Excel.
- **jsPDF**: Para la generación y exportación de reportes en PDF.

## Cómo Usar
1. Registra tus ingresos, gastos con sus respectivas fechas, cantidades y categorías.
2. En la vista de ahorros en base al balance mensual promedio establece ahorros actuales y del mes.
3. Selecciona un rango de tiempo o un mes y año específicos para visualizar el resumen financiero.
4. Analiza tus finanzas a través de gráficos y resúmenes interactivos.
5. Exporta los datos detallados y resúmenes a archivos Excel o PDF para un análisis más profundo.
6. Observa la proyeccion de como van a ir tus finanzas a corto, medio y largo plazo.
7. Obten un consejo financiero para mejorar tus finanzas (en proceso)

## Pasos
- Clonar repositorio: 
`git clone git@github.com:Alfonsoalm/Finanzapp.git`
- Entrar en carpeta:
`cd Finanzapp`
- Instalar dependencias
`npm install`
- Compilar la aplicación (opcional, solo para produccion):
`npm run build`
- Ejecutar la aplicacion en modo desarrollo
`npm run dev`

***Este proyecto está en constante evolución, y estamos abiertos a recibir sugerencias y contribuciones para seguir mejorando la experiencia del usuario***
