import { toast } from "react-toastify";

export const getErrorToEndpoints = (data) => {
    console.log("🚀 ~ getErrorToEndpoints ~ data:", data)
    if (data.message) {
        toast.error(data.message || "Error desconocido");
    } else {
        toast.success("Operación realizada con éxito");
    }
}