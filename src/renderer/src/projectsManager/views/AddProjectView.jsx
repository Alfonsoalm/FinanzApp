import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CallForm, ProjectForm } from "../components";

export const AddProjectView = () => {
    
    const navigate = useNavigate()

    const goToProjectsView = () => {
      navigate("/projects")
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
            onClick={goToProjectsView}
            sx={{
              position: "absolute",
              top: 10,
              right: 60,
              color: "black",
            }}
          >
          <CloseIcon/> 
        </Button>

          
        <ProjectForm closeView={goToProjectsView} />
        <CallForm />

      </Grid2>
    )
}
