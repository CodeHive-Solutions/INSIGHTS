// src/utils/errorHandler.js

export const handleError = async (response, showSnack) => {
    let errorMessage = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.";

    if (!response.ok) {
        
        switch (response.status) {
            case 400:
                const data = await response.json();
                const firstKey = Object.keys(data)[0];
                errorMessage = firstKey ? data[firstKey] : "Por favor, verifica la información ingresada y vuelve a intentarlo.";
                break;
            case 401:
            case 403:
                errorMessage = "No tiene permiso para realizar esta acción.";
                break;
            case 404:
                errorMessage = "No se encontraron registros para actualizar.";
                break;
            case 409:
                errorMessage = "El archivo ya existe.";
                break;
            case 422:
                errorMessage = "El archivo no cumple con el formato.";
                break;
            case 500:
                errorMessage = "Lo sentimos, se ha producido un error inesperado.";
                break;
            default:
                const defaultData = await response.json();
                errorMessage = defaultData.error || "Ocurrió un error inesperado.";
        }
        showSnack("error", errorMessage);
        throw new Error(errorMessage);
    }
};
