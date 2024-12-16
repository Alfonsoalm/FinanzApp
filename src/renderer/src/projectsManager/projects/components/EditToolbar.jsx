import { Button } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';

export const EditToolbar = (props) => {

    const {setData, setChanges, id} = props
    
    const handleClick = () => {  
        const id = Date.now();
        const newPhase = {
            id,
            name: '',
            project: id, 
            hours:0, 
            startDate:Date.now(), 
            endDate:Date.now(), 
            technicians:[], 
            techniciansIds:[], 
            assignmentHours:[], 
            hours_assigned:0 ,
            isNew: true 
        }

        setData((oldRows) => [
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
