import { useEffect, useState } from "react"


export const useWindowApi = (apiMethod) => {
  
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setData(null);

        const result = await apiMethod(); // Llamada al único apiMethod

        if (result.success) {
          setData(result.data); // Si la llamada es exitosa, guarda los datos
        } else {
          setError(result.error || 'Error desconocido'); // Si hubo un error, guarda el mensaje de error
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiMethod]);
  
  
  
  return {
        data,
        error,
        isLoading
  }
}
