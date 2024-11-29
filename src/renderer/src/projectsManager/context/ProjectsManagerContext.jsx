import { createContext, useState } from "react";
import { useWindowApi } from "../../hooks";


export const ProjectManagerContext = createContext();


export const ProjectManagerProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [calls, setCalls] = useState([]);
    const [headquarters, setHeadquarters] = useState([]);
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
    }
  
    return (
      <ProjectManagerContext.Provider value={{error, projects, calls, headquarters, getCalls, getHeadquarters, getProjects, insertProject, insertCall }}>
        {children}
      </ProjectManagerContext.Provider>
    );
  };