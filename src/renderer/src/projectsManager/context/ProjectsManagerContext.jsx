import { createContext, useState } from "react";

export const ProjectManagerContext = createContext();

export const ProjectManagerProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [calls, setCalls] = useState([]);
    const [headquarters, setHeadquarters] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [workdays, setWorkdays] = useState([]);
    const [vacations, setVacations] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const id = 1;

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
              console.log("delete")
              // getProjects()
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

    const addAssignment = async (assignment) => {

      try {
        setIsLoading(true);
        setError(null);
        console.log("ADD")
        const result = await window.api.addAssignment(assignment);
        if(result.success){
          console.log(result)
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

    const deleteAssignment = async (phase_id, technician_id) => {

      try {
        setIsLoading(true);
        setError(null);
        console.log("DELETE")
        const result = await window.api.deleteAssignment(phase_id, technician_id);
        if(result.success){
          console.log(result)
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

  const insertWorkday = async (workday) => {
    console.log(workday);
    try {
      setError(null);
      const result = await window.api.insertWorkday(workday);

      if(result.success){
        getWorkdays();
      }
      else{
        setError(result.error);
      }
    }catch(error){
        setError(error);
    }
  };

  const getWorkdays = async () => {
    try {
      setError(null);
      const result = await window.api.getWorkdays();
      if(result.success){
        setWorkdays(result.data);
      }
      else{
        setError(result.error);
      }
    }catch(error){
      setError(error);
    }
  };

  const insertVacation = async (vacation) => {
    console.log(vacation);
    try {
      setError(null);
      const result = await window.api.insertVacation(vacation);

      if(result.success){
        getVacations();
      }
      else{
        setError(result.error);
      }
    }catch(error){
        setError(error);
    }
  };

  const getVacations = async () => {
    try {
      setError(null);
      const result = await window.api.getVacations();
      if(result.success){
        setVacations(result.data);
      }
      else{
        setError(result.error);
      }
    }catch(error){
      setError(error);
    }
  };

  const insertHoliday = async (holiday) => {
    console.log(holiday);
    try {
      setError(null);
      const result = await window.api.insertHoliday(holiday);

      if(result.success){
        getHolidays();
      }
      else{
        setError(result.error);
      }
    }catch(error){
        setError(error);
    }
  };

  const getHolidays = async () => {
    try {
      setError(null);
      const result = await window.api.getHolidays();
      if(result.success){
        setHolidays(result.data);
      }
      else{
        setError(result.error);
      }
    }catch(error){
      setError(error);
    }
  };

    return (
      <ProjectManagerContext.Provider value={{
        id, error, projects, calls, headquarters, technicians, 
        salaries, workdays, vacations, holidays,
        getCalls, getHeadquarters, getProjects, deleteProject,
        insertProject, insertCall, getProjectDetails, 
        setTechnicians, getTechnicians, deleteTechnician, deleteSoftTechnician,
        insertTechnician, getTechnicianDetails, getAssignmentsByTechnician,
        getSalaries, getSalariesByTechnician, insertSalary, deleteSalary, editSalary,
        insertWorkday, getWorkdays, insertVacation, getVacations, insertHoliday, getHolidays,
        deleteAssignment, addAssignment
        }}>
        {children}
      </ProjectManagerContext.Provider>
    );
  };