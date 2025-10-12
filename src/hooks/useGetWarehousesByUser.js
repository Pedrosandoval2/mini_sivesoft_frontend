import { getWarehousesByUser } from '@/services/warehouse/getWarehouseByUser'
import React from 'react'

export const useGetWarehousesByUser = () => {
    const [data, setData] = React.useState([])

    const fetchWarehousesByUser = async () => {
        try {
            const response = await getWarehousesByUser()
            setData(response.data)
        } catch {
            // Error fetching warehouses
        }
    }

    return {
        fetchWarehousesByUser,
        data
    }
}

