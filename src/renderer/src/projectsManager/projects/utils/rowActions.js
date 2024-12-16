
export class RowActions {
    constructor(data, setData, setChanges, fetchData) {
      this.data = data;
      this.setData = setData;
      this.setChanges = setChanges;
      this.fetchData = fetchData;
    }
  
    handleAddClick(rowId) {
      const index = this.data.findIndex(item => item.id === rowId);
      if (index !== -1) {
        const newAssignment = {
          technician: -1,
          phase: this.data[index].id,
          hours: 0,
          startDate: this.data[index].startDate,
          endDate: this.data[index].endDate,
        };
        this.addAssignment(newAssignment);
        this.fetchData();
      }
    } 
    async addAssignment(newAssignment) {
      // Logic to add assignment goes here (e.g., calling an API or context)
    }
  
    handleDeleteClick(deletedRow) {
      // Logic to delete a row goes here
    }
  }
  