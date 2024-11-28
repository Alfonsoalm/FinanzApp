

export const searchBy = (dataArray, propertyName, searchText) => {

    if (!dataArray || !Array.isArray(dataArray)) {
        return []; // Retorna un arreglo vacío si el input no es válido
    }

    return dataArray.filter((item) => {
        const { [propertyName]: propertyValue } = item; // Extrae la propiedad

        if (propertyValue && typeof propertyValue === "string") {
            return propertyValue.toLowerCase().includes(searchText?.toLowerCase() || "");
        }

        return false; // Ignorar elementos donde la propiedad no es una cadena
    });
};


