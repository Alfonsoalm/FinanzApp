

export class RowValidator {
    static isCellEditable({ row, field }) {
      const editableFields = {
        main: ["name","hours", "startDate", "endDate"],
        sub: ["technicians", "hours_assigned"],
      };
  
      return editableFields[row.isMain ? "main" : "sub"].includes(field);
    }
  }
  