# Finanzapp

Esta aplicación permite a los usuarios gestionar y proyectar sus finanzas personales, integrando datos de ingresos, gastos y ahorros. Proporciona herramientas avanzadas para el análisis financiero, visualización interactiva y exportación de datos.

## Características
1. **Cálculo de Proyecciones**:
   - Genera proyecciones detalladas de los ahorros hasta 60 años.
   - Incluye contribuciones recurrentes (mensuales) y puntuales (única vez).
   - Aplica tasas de interés mensuales para calcular el crecimiento acumulado.

2. **Resumen Financiero**:
   - Resumen mensual de ingresos, gastos y balance.
   - Detalle de ingresos, gastos y ahorros, incluyendo categorías, fechas y tipo.

3. **Exportación de Datos**:
   - Exporta el resumen financiero y detalles a archivos Excel y PDF.

4. **Visualización Interactiva**:
   - Gráficos dinámicos (circular y de línea) para analizar tendencias y distribución.
   - Filtros por mes, año y rango de tiempo.

5. **Gestión de Datos**:
   - Administración de ingresos, gastos y ahorros con categorías y fechas específicas.

## Tecnologías Utilizadas
- **React.js**: Para la creación de una interfaz de usuario dinámica e interactiva.
- **Electron**: Para desarrollar la aplicación como un entorno de escritorio multiplataforma.
- **Chart.js**: Para gráficos dinámicos y visualización avanzada de datos financieros.
- **Context API**: Para la gestión de estado global de la aplicación (ingresos, gastos, ahorros).
- **XLSX**: Para la exportación de datos financieros a Excel.
- **jsPDF**: Para la generación y exportación de reportes en PDF.

## Cómo Usar
1. Registra tus ingresos, gastos y ahorros con sus respectivas fechas, cantidades y categorías.
2. Selecciona un rango de tiempo o un mes y año específicos para visualizar el resumen financiero.
3. Analiza tus finanzas a través de gráficos y resúmenes interactivos.
4. Exporta los datos detallados y resúmenes a archivos Excel o PDF para un análisis más profundo.

## Pasos
Clonar repositorio: 
`git clone git@github.com:Alfonsoalm/Finanzapp.git`
Entrar en carpeta:
`cd Finanzapp`
Instalar dependencias
`npm install`
Compilar la aplicación (opcional, solo para produccion):
`npm run build`
Ejecutar la aplicacion en modo desarrollo
`npm run dev`

***Este proyecto está en constante evolución, y estamos abiertos a recibir sugerencias y contribuciones para seguir mejorando la experiencia del usuario***
