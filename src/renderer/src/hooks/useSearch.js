import { useEffect, useState } from "react"


export const useSearch = ({list, searchText, field}) => {

    const [filteredList, setFilteredList] = useState([])

    useEffect(() => {
    
        if (!list || !Array.isArray(list)) {
            setFilteredList([])
        }else{
            setFilteredList(
                list.filter((item) => {
                    const { [field]: propertyValue } = item; // Extrae la propiedad
            
                    if (propertyValue && typeof propertyValue === "string") {
                        return propertyValue.toLowerCase().includes(searchText?.toLowerCase() || "");
                    }
            
                    return false; // Ignorar elementos donde la propiedad no es una cadena
                })
            )
        }
    }, [list, searchText, field])
    
    return {filteredList}
}
