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

export const dataWarehousesByUser = [
    {
        "id": 1,
        "name": "almacén 1",
        "address": "Av girón 34",
        "serieWarehouse": 1,
        "isActive": true,
        "createdAt": "2025-10-02T02:22:19.321Z",
        "updatedAt": "2025-10-03T03:58:31.593Z"
    },
    {
        "id": 2,
        "name": "almacén 2",
        "address": "Av 28 de julio",
        "serieWarehouse": 2,
        "isActive": true,
        "createdAt": "2025-10-02T21:24:39.988Z",
        "updatedAt": "2025-10-03T03:58:33.569Z"
    },
    {
        "id": 3,
        "name": "almacén 3 update",
        "address": "Av 23 de julio",
        "serieWarehouse": 3,
        "isActive": true,
        "createdAt": "2025-10-02T21:24:48.710Z",
        "updatedAt": "2025-10-03T03:58:34.849Z"
    },
    {
        "id": 4,
        "name": "almacén 4",
        "address": "Av 25 de julio",
        "serieWarehouse": 4,
        "isActive": true,
        "createdAt": "2025-10-03T03:42:12.798Z",
        "updatedAt": "2025-10-03T04:06:07.460Z"
    }
]

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
                role: "manager",
                warehouses: [
                    {
                        id: 1,
                        name: "almacén 1",
                        address: "Av girón 34",
                        serieWarehouse: 1,
                        isActive: true,
                        createdAt: "2025-10-02T02:22:19.321Z",
                        updatedAt: "2025-10-03T03:58:31.593Z"
                    },
                ]
            },
            state: "registrado",
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
        },
        {
            id: 13,
            emissionDate: "2025-10-01T05:00:00.000Z",
            serie: "INV",
            user: {
                id: 9,
                username: "pedro.sandoval",
                entityRelation: {
                    id: 2,
                    name: "Pedro Sandoval",
                    docType: "DNI",
                    docNumber: "72698533",
                    address: "MZ P4 LT22",
                    phone: "933288124"
                },
                role: "manager",
                warehouses: [
                    {
                        id: 1,
                        name: "almacén 1",
                        address: "Av girón 34",
                        serieWarehouse: 1,
                        isActive: true,
                        createdAt: "2025-10-02T02:22:19.321Z",
                        updatedAt: "2025-10-03T03:58:31.593Z"
                    },
                    {
                        id: 2,
                        name: "almacén 2",
                        address: "Av 28 de julio",
                        serieWarehouse: 2,
                        isActive: true,
                        createdAt: "2025-10-02T21:24:39.988Z",
                        updatedAt: "2025-10-03T03:58:33.569Z"
                    },
                    {
                        id: 3,
                        name: "almacén 3 update",
                        address: "Av 23 de julio",
                        serieWarehouse: 3,
                        isActive: true,
                        createdAt: "2025-10-02T21:24:48.710Z",
                        updatedAt: "2025-10-03T03:58:34.849Z"
                    },
                    {
                        id: 4,
                        name: "almacén 4",
                        address: "Av 25 de julio",
                        serieWarehouse: 4,
                        isActive: true,
                        createdAt: "2025-10-03T03:42:12.798Z",
                        updatedAt: "2025-10-03T04:06:07.460Z"
                    }
                ]
            },
            state: "registrado",
            warehouse: {
                id: 3,
                name: "almacén 3 update",
                address: "Av 23 de julio",
                serieWarehouse: 3,
                isActive: true
            },
            details: [
                {
                    id: 43,
                    productId: "WATER-CIELO-3L",
                    quantity: "30.00",
                    unit: "unidades",
                    price: "30.00"
                },
                {
                    id: 44,
                    productId: "WATER-CIELO-1L",
                    quantity: "10.00",
                    unit: "unidades",
                    price: "10.00"
                },
                {
                    id: 45,
                    productId: "WATER-CIELO-2L",
                    quantity: "20.00",
                    unit: "unidades",
                    price: "20.00"
                }
            ],
            createdAt: "2025-10-03T20:44:47.739Z",
            updatedAt: "2025-10-03T20:44:47.739Z"
        }
    ],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1
}

export const entities = {
    data: [
        {
            id: 1,
            name: "Pedro",
            docType: "DNI",
            docNumber: "72698534",
            address: "MZ P4 LT22",
            phone: "933288124",
        },
        {
            id: 2,
            name: "Pedro Sandoval",
            docType: "DNI",
            docNumber: "72698533",
            address: "MZ P4 LT22",
            phone: "933288124",
        },
    ]
}

export const productosMockData = {
    "data": {
        "data": [
            {
                "id": 1,
                "name": "Arroz Blanco",
                "unit": "kg",
                "barcode": "1234567890123",
                "price": 18.50
            },
            {
                "id": 2,
                "name": "Aceite de Oliva",
                "unit": "lt",
                "barcode": "2345678901234",
                "price": 55.00
            },
            {
                "id": 3,
                "name": "Leche Entera",
                "unit": "lt",
                "barcode": "3456789012345",
                "price": 22.75
            },
            {
                "id": 4,
                "name": "Pan Integral",
                "unit": "pieza",
                "barcode": "4567890123456",
                "price": 12.00
            },
            {
                "id": 5,
                "name": "Huevos Orgánicos",
                "unit": "docena",
                "barcode": "5678901234567",
                "price": 38.90
            }
        ]
    }
}