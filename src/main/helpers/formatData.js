export const formatData = (data) => {
  if (Array.isArray(data)) {
    // Si es un array, mapeamos cada elemento
    const formattedData = data.map(item => {
      const formattedItem = { ...item.dataValues };

      // Si el elemento tiene un objeto relacionado (como Headquarter), extraemos solo los valores
      if (formattedItem.Headquarter) {
        formattedItem.Headquarter = formattedItem.Headquarter.dataValues; // Extraemos los datos del Headquarter
      }

      return formattedItem;
    });

    return formattedData;
  } else {
    // Si no es un array, solo procesamos un solo elemento
    const formattedItem = { ...data.dataValues };

    // Si tiene el objeto relacionado, extraemos solo los datos
    if (formattedItem.Headquarter) {
      formattedItem.Headquarter = formattedItem.Headquarter.dataValues;
    }

    // Si el dato tiene un password, lo convertimos a hexadecimal (como ya lo haces)
    if (formattedItem.password) {
      formattedItem.password = formattedItem.password.toString('hex');
    }

    return formattedItem;
  }
};
