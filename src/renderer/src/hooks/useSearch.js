import { useEffect, useState } from "react"


export const useSearch = ({list, searchText, field}) => {

    const [filteredList, setFilteredList] = useState([])

    useEffect(() => {
    
        if (!list || !Array.isArray(list)) {
            setFilteredList([])
        }else{
            setFilteredList(
                list.filter((item) => {
                    const { [field]: propertyValue } = item;
            
                    if (propertyValue && typeof propertyValue === "string") {
                        return propertyValue.toLowerCase().includes(searchText?.toLowerCase() || "");
                    }
            
                    return false;
                })
            )
        }
    }, [list, searchText, field])
    
    return {filteredList}
}
