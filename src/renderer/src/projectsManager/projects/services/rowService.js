export class RowService {
  static formatRowData(data, expandedRows, options) {
    const { getMainRow, getSubRows } = options;

    return data.flatMap((row) => {
      const mainRow = getMainRow(row); // Función proporcionada para obtener la fila principal
      if(mainRow){
        const isExpanded = expandedRows[row.id];
        const subRows = isExpanded ? getSubRows(row) : []; // Función proporcionada para obtener las sub-filas si está expandida
        return [mainRow, ...subRows];
      }

      return [];
    });
  }

}