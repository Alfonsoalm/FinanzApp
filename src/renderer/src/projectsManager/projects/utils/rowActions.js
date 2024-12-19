import { NetworkWifiSharp } from "@mui/icons-material";

export class RowActions {
    constructor(data, setData, changes, setChanges, fetchData) {
      this.data = data;
      this.setData = setData;
      this.changes = changes;
      this.setChanges = setChanges;
      this.fetchData = fetchData;
    }
  
    handleAddClick(rowId) {
      console.log("HANDCLICK")
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
    
    editAssignment(newRow) {

      const prevData = this.data.find((row) => (row.id === newRow.index))
      const newData =  structuredClone(prevData);

      newData.technicians[newRow.index_tech] = newRow.technicians
      newData.techniciansIds[newRow.index_tech]  = newRow.technician_id
      newData.assignmentHours[newRow.index_tech] = Number(newRow.hours_assigned)
      newData.hours_assigned = newData.assignmentHours.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


      const newChange = {
        type:"assignment",
        action: "edit",
        prevData: prevData,
        newData: newData,
      }

      this.addNewChange(newChange)
      console.log(this.data.find(item => item.id === newRow.index))
      
      this.setData(
        this.data.map(item => {
          if (item.id === newRow.index) {
            return newData; // Actualización basada en index
          }
          if (item.id === newRow.id) {
            return newRow; // Actualización basada en id
          }
          return item; // Mantener sin cambios
        })
      );

    }

    editPhase(newRow) {
      
      const prevRow = this.data.find((item) => (item.id === newRow.id))
  
      const newChange = {
        type:"phase",
        action:"edit",
        prevData:prevRow,
        newData:newRow,
      }
      this.addNewChange(newChange)
      this.setData(this.data.map(item => item.id === newRow.id ? newRow : item))
    }
  


    addNewChange(newChange){
      this.setChanges([...this.changes, newChange])
    }
  }
  