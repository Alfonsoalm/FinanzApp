import { Button, Grid2 } from "@mui/material"
import { CallForm, ProjectForm } from "../components"
import CloseIcon from '@mui/icons-material/Close';

export const AddProjectView = ({changeView}) => {

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
            onClick={()=>changeView("projects")}
            sx={{
              position: "absolute",
              top: 10,
              right: 60,
              color: "black", // Cambia el color del ícono si es necesario
            }}
          >
          <CloseIcon/> 
        </Button>

          
        <ProjectForm />
        <CallForm />

      </Grid2>
    )
}
