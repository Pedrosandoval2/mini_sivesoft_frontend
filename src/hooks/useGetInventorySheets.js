import { getInventorySheets } from "@/services/inventory/getInventorySheets";
import { useState } from "react";

export const useGetInventorySheets = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInventorySheets = async ({ page, limit, query, state, dateFrom, dateTo, warehouseId, entity }) => {
        setIsLoading(true);
        try {
            const response = await getInventorySheets({ page, limit, query, state, dateFrom, dateTo, warehouseId, entity });
            setData(response.data.data);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching inventory sheets:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        fetchInventorySheets,
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
};