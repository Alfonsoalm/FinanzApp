import { Button } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';

export const EditToolbar = ({setDetails, setChanges, id_project}) => {
    
    const handleClick = () => {  
        const id = Date.now();
        const newPhase = {
            id,
            name: '',
            project: id_project, 
            hours:0, 
            startDate:Date.now(), 
            endDate:Date.now(), 
            technicians:[], 
            techniciansIds:[], 
            assignmentHours:[], 
            hours_assigned:0 ,
            isNew: true 
        }

        setDetails((oldRows) => [
            ...oldRows,
            newPhase,
        ]);

        const newChange = {
            type:"phase",
            action:"add",
            prevData: {},
            newData: newPhase,
        }

        setChanges((oldChanges) => [
            ...oldChanges,
            newChange
        ])
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Añadir Paquete
        </Button>
      </GridToolbarContainer>
    );
}
