export const dataWarehouse = {
    data: [
        {
            id: 1,
            name: "almacén 1",
            address: "Av girón 34",
            isActive: true,
            createdAt: "2025-10-02T02:22:19.321Z",
            updatedAt: "2025-10-02T02:23:54.000Z"
        },
        {
            id: 2,
            name: "almacén 2",
            address: "Av 28 de julio",
            isActive: true,
            createdAt: "2025-10-02T21:24:39.988Z",
            updatedAt: "2025-10-02T21:24:39.988Z"
        },
        {
            id: 3,
            name: "almacén 3 update",
            address: "Av 23 de julio",
            isActive: true,
            createdAt: "2025-10-02T21:24:48.710Z",
            updatedAt: "2025-10-02T21:26:22.000Z"
        }
    ],
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1
}

export const dataInventorySheets = {
    data: [
        {
            id: 12,
            emissionDate: "2025-10-01T05:00:00.000Z",
            serie: "INV",
            user: {
                id: 12,
                username: "pedro.prueba",
                entityRelation: {
                    id: 1,
                    name: "Pedro",
                    docType: "DNI",
                    docNumber: "72698534",
                    address: "MZ P4 LT22",
                    phone: "933288124"
                },
                role: "manager"
            },
            state: "registered",
            warehouse: {
                id: 6,
                name: "almacén 6",
                address: "Av 26 de julio",
                serieWarehouse: 6,
                isActive: true
            },
            details: [
                {
                    id: 40,
                    productId: "WATER-CIELO-3L",
                    quantity: "10.00",
                    unit: "unidades",
                    price: "10.00"
                },
                {
                    id: 41,
                    productId: "WATER-CIELO-1L",
                    quantity: "20.00",
                    unit: "unidades",
                    price: "20.00"
                },
                {
                    id: 42,
                    productId: "WATER-CIELO-2L",
                    quantity: "30.00",
                    unit: "unidades",
                    price: "30.00"
                }
            ],
            createdAt: "2025-10-03T04:32:26.494Z",
            updatedAt: "2025-10-03T04:36:32.000Z"
        }
    ],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1
}