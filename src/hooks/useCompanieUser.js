import { useState } from "react";
import { getCompanyById } from "@/services/companies/companiesById";

export const useCompanieUser = () => {
    const [data, setData] = useState(null);

    const getCompanieUser = async () => {
        try {
            const response = await getCompanyById({ id: 1 });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching company data:", error);
        }
    }

    return { data, setData,  getCompanieUser };
}
