import { toast } from "react-toastify";

export const getErrorToEndpoints = (data) => {
    if (data.message) {
        toast.error(data.message || "Error desconocido");
    } else {
        toast.success("Operación realizada con éxito");
    }
}