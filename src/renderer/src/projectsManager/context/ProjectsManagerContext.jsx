import { createContext, useState } from "react";

export const ProjectManagerContext = createContext();

export const ProjectManagerProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [calls, setCalls] = useState([]);
    const [headquarters, setHeadquarters] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const getCalls = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const result = await window.api.getCalls()

          if(result.success){
            setCalls(result.data)
          }
          else{
            setError(result.error)
          }
        }catch(error){
            setError(error)
        }finally{
          setIsLoading(false)
        }
    };

    const insertCall = async (call) => {
        try {
            setIsLoading(true)
            setError(null)
            const result = await window.api.insertCall(call)
  
            if(result.success){
              getCalls()
            }
            else{
              setError(result.error)
            }
        }catch(error){
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }

    const getHeadquarters = async () => {
        try {
            setIsLoading(true)
            setError(null)  
            const result = await window.api.getHeadquarters()
  
            if(result.success){
              setHeadquarters(result.data)
            }
            else{
              setError(result.error)
            }
        }catch(error){
            setError(error)
        }finally{
          setIsLoading(false)
        }
    };

    const getProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await window.api.getProjects()
        
        if(result.success){
          setProjects(result.data)
        }
        else{
          setError(result.error)
        }
      }catch(error){
          setError(error)
      }finally{
        setIsLoading(false)
      }
    };

    const deleteProject = async (id_project) => {
          try {
            setIsLoading(true)
            setError(null)
            const result = await window.api.deleteProject(id_project)

            if(result.success){
              getProjects()
            }
            else{
              setError(result.error)
            }
        }catch(error){
            setError(error)
        }finally{
          setIsLoading(false)
        }
    }

    const insertProject = async (project) => {
        try {
            setIsLoading(true)
            setError(null)
            const result = await window.api.insertProject(project)
  
            if(result.success){
              getProjects()
            }
            else{
              setError(result.error)
            }
        }catch(error){
            setError(error)
        }finally{
          setIsLoading(false)
        }
    };

    const getProjectDetails = async (id_project) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await window.api.getProjectDetails(id_project)
        console.log(result)

        if(result.success){
          return result.data;
        }
        else{
          setError(result.error)
        }
      }catch(error){
          setError(error)
      }finally{
        setIsLoading(false)
      }
    };

    const getTechnicianDetails = async (id_technician) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await window.api.getTechnicianDetails(id_technician)
        if(result.success){
          return result.data;
        }
        else{
          setError(result.error)
        }
      }catch(error){
          setError(error)
      }finally{
        setIsLoading(false)
      }
    };
  
    const getTechnicians = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await window.api.getTechnicians()
        
        if(result.success){
          setTechnicians(result.data)
        }
        else{
          setError(result.error)
        }
      }catch(error){
          setError(error)
      }finally{
        setIsLoading(false)
      }
    };

    const deleteTechnician = async (id_technician) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await window.api.deleteTechnician(id_technician)

        if(result.success){
          getTechnicians()
        }
        else{
          setError(result.error)
        }
    }catch(error){
        setError(error)
    }finally{
      setIsLoading(false)
    }
  }

  const deleteSoftTechnician = async (id_technician) => {
    try {
      setError(null)
      const result = await window.api.deleteSoftTechnician(id_technician)

      if(result.success){
        getTechnicians()
      }
      else{
        setError(result.error)
      }
  }catch(error){
      setError(error)
  }
}

    const insertTechnician = async (technician) => {
        try {
          setIsLoading(true)
          setError(null)
          const result = await window.api.insertTechnician(technician)

          if(result.success){
            getTechnicians()
          }
          else{
            setError(result.error)
          }
      }catch(error){
          setError(error)
      }finally{
        setIsLoading(false)
      }
    };
    
    const getSalaries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await window.api.getSalaries();
        if(result.success){
          setSalaries(result.data);
        }
        else{
          setError(result.error);
        }
      }catch(error){
        setError(error);
      }finally{
        setIsLoading(false);
      }
    };

    const getSalariesByTechnician = async (id) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await window.api.getSalariesByTechnician(id);
        if(result.success){
          return result.data;
        }
        else{
          setError(result.error);
        }
      }catch(error){
        setError(error);
      }finally{
        setIsLoading(false);
      }
    };

    const getAssignmentsByTechnician = async (id) => {
      try {
        setError(null);
        const result = await window.api.getTechnicianAssignments(id);
        console.log("resultado_asignaciones:",result);
        if(result.success){
          return result.data;
        }
        else{
          setError(result.error);
        }
      }catch(error){
        setError(error);
      }
    }

    const insertSalary = async (salary) => {
      console.log(salary);
      try {
        setIsLoading(true);
        setError(null);
        const result = await window.api.insertSalary(salary);

        if(result.success){
          getSalaries();
        }
        else{
          setError(result.error);
        }
    }catch(error){
        setError(error);
    }finally{
      setIsLoading(false);
    }
  };

    const deleteSalary = async (id_salary) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await window.api.deleteSalary(id_salary);

        if(result.success){
          getSalaries();
        }
        else{
          setError(result.error);
        }
    }catch(error){
        setError(error);
    }finally{
      setIsLoading(false);
    }
  }

    const editSalary = async (salary) => {
      try {
        setError(null);
        const result = await window.api.editSalary(salary);

        if(result.success){
          console.log("Salario editado con exito")
        }
        else{
          setError(result.error);
        }
    }catch(error){
        setError(error);
    }
  }

    return (
      <ProjectManagerContext.Provider value={{
        error, projects, calls, headquarters, technicians,
        getCalls, getHeadquarters, getProjects, deleteProject,
        insertProject, insertCall, getProjectDetails, 
        setTechnicians, getTechnicians, deleteTechnician, deleteSoftTechnician,
        insertTechnician, getTechnicianDetails, getAssignmentsByTechnician,
        getSalaries,  getSalariesByTechnician, insertSalary, deleteSalary, editSalary }}>
        {children}
      </ProjectManagerContext.Provider>
    );
  };