# Proyección de Ahorros - Aplicación
Esta aplicación permite a los usuarios realizar proyecciones financieras basadas en sus ahorros actuales y futuros. Integra datos de ingresos, gastos y ahorros, considerando tasas de interés y periodicidad de las contribuciones.

## Características
1. **Cálculo de Proyecciones**:
   - Genera proyecciones detalladas de los ahorros hasta 60 años.
   - Considera contribuciones recurrentes (mensuales) y puntuales (única vez en la fecha específica).
   - Aplica tasas de interés mensuales para calcular el crecimiento acumulado de los ahorros.

2. **Interfaz Interactiva**:
   - Botones de rango para seleccionar proyecciones de 1, 3, 5, 10, 20, 30, 40, 50 y 60 años.
   - Gráficos dinámicos que muestran el crecimiento de los ahorros a lo largo del tiempo.

3. **Gestión de Fechas**:
   - Las contribuciones puntuales solo se aplican en la fecha específica correspondiente.
   - Las contribuciones recurrentes comienzan desde su fecha inicial y se acumulan mes a mes.

## Tecnologías Utilizadas
- **React.js**: Para la creación de componentes interactivos.
- **Chart.js**: Para generar gráficos dinámicos y visualización de datos.
- **Context API**: Para la gestión de estado global (ahorros, ingresos, gastos).
- **Electron**: Para el desarrollo del entorno de la aplicacion.

## Archivos Clave
1. **`ProjectionPage.js`**:
   - Contiene la lógica para calcular las proyecciones de ahorros.
   - Administra los gráficos y botones de rango.

2. **`FinanceManagerContext.js`**:
   - Proporciona el contexto global para acceder a los datos financieros (ingresos, gastos y ahorros).

3. **Estilos (`summaryPage.css`)**:
   - Define la apariencia y disposición de los gráficos, botones y contenedores de datos.

## Cálculos y Lógica

### Ahorros Recurrentes

Se acumulan mes a mes desde la fecha de inicio hasta el final del rango seleccionado. Cada mes, se aplica la tasa de interés al total acumulado.

### Ahorros Puntuales

Se suman únicamente en el mes y año definidos por su fecha. No se acumulan en meses posteriores.

### Intereses

Los intereses se calculan mensualmente con la fórmula:

```math
Interés Mensual = Total Acumulado × (Tasa de Interés / 12 / 100)
```

### Beneficio Neto

En el futuro, se incorporará el **beneficio neto acumulado** a lo largo de los años en las proyecciones. Esto significa que las diferencias entre ingresos y gastos proyectados impactarán directamente en el total acumulado y el cálculo de interés compuesto.

## Cómo Usar

1. Selecciona un rango de años en los botones disponibles.
2. Observa cómo se proyectan tus ahorros a lo largo del tiempo en el gráfico.
3. Revisa los cálculos en la consola para validar los valores generados.

## Próximas Mejoras

1. **Cálculo del Beneficio Neto**:
   - Incorporar las diferencias entre ingresos y gastos acumulados al cálculo de la proyección.

2. **Mejoras Visuales**:
   - Añadir etiquetas detalladas a los gráficos.
   - Opciones para personalizar tasas de interés y contribuciones futuras.

3. **Exportación de Datos**:
   - Permitir exportar proyecciones a archivos CSV o PDF.

---

Este proyecto sigue en desarrollo activo. Si tienes sugerencias o encuentras errores, no dudes en contribuir o reportarlos.

