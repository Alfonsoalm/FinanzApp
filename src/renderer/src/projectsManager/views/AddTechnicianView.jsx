import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TechnicianForm } from '../components/TechnicianForm';

export const AddTechnicianView = () => {
    
    const navigate = useNavigate()

    const goToTechniciansView = () => {
      navigate("/technicians")
    }

    return (
      <Grid2
        container
        sx={{
          height: "100%",
          width: "100%",
          pt: 2,
          pr: 4,
          mt: 2,
          position: "relative",
        }}
      >
        <Button
            onClick={goToTechniciansView}
            sx={{
              position: "absolute",
              top: 10,
              right: 60,
              color: "black",
            }}
          >
          <CloseIcon/> 
        </Button>
          
        <TechnicianForm closeView={goToTechniciansView} />

      </Grid2>
    )
}
