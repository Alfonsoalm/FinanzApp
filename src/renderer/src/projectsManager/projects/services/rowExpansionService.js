export class RowExpansionService {
    constructor(expandedRows) {
      this.expandedRows = expandedRows;
    }
  
    toggleRow(id) {
      this.expandedRows = { ...this.expandedRows, [id]: !this.expandedRows[id] };
    }
  
    getExpandedRows() {
      return this.expandedRows;
    }
  }