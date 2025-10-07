import { getEntities } from "@/services/entities/getEntites";
import { useState } from "react";

export const useGetEntities = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchEntities = async ({ page, limit, query }) => {
        setIsLoading(true);
        try {
            const response = await getEntities({ page, limit, query });
            setData(response.data.data);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching entities:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        fetchEntities,
        data,
        page,
        setPage,
        limit,
        setLimit,
        total,
        setTotal,
        totalPages,
        isLoading
    };
}
