import { useEffect, useState } from "react"


export const useWindowApi = ({apiMethods=[]}) => {
  
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null)



  useEffect(() => {
    const fetchProjects = async () => {
        try{
            setIsLoading(true)
            setError("")
            setData({})

            const results = await Promise.all(
                apiMethods.map((apiMethod, index) => {
                  return apiMethod().then(result => ({
                    success: result.success,
                    data: result.data,
                    error: result.error,
                    apiIndex: index, // Añadimos el índice para identificar la promesa
                  }));
                })
              );
      
            // Procesamos los resultados con el identificador 'apiIndex'
            const processedData = results.reduce((acc, { success, data, error, apiIndex }) => {
                if (success) {
                  // Si es exitoso, agregamos los datos
                  acc.push({ data, apiIndex });
                } else {
                  // Si hay un error, lo guardamos con el índice correspondiente
                  setError(`Error en la consulta ${apiIndex + 1}: ${error || 'Desconocido'}`);
                }
                return acc;
              }, []);
      
            setData(processedData);

        }catch(error){
            console.error(error)
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }

    fetchProjects()
  
  }, [apiMethods])
  
  
  
  return {
        data,
        error,
        isLoading
  }
}
