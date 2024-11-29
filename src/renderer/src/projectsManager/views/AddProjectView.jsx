import { Button, Grid2 } from "@mui/material"
import { CallForm, ProjectForm } from "../components"
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";

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
          ml: 1,
          pt: 2,
          pl: 4,
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
