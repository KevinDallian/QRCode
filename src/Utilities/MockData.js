export const productsMockData = [
    {
      id: "PR001",
      name: "Bundavin",
      nie: "SD181551741",
      het: 11300,
      storage : "Simpan dalam suhu ruangan",
      aggregations: [
        {name: "Box", quantity: 10, prefix:'BX', level: 1},
        {name: "Palet", quantity: 5, prefix:'PX', level: 2}
      ]
    },
    {
      id: "PR002",
      name: "Samcobion",
      nie: "SD171349921",
      het: 5000,
      storage : "Simpan dalam suhu ruangan",
      aggregations: [
        {name: "Box", quantity: 10, prefix:'BX', level: 1},
        {name: "Palet", quantity: 5, prefix:'PX', level: 2}
      ]
    },
    {
      id: "PR003",
      name: "Horvita G",
      nie : "SD171550761",
      het : 11000,
      storage : "Simpan dalam suhu ruangan",
      aggregations: [
        {name: "Box", quantity: 10, prefix:'BX', level: 1},
        {name: "Palet", quantity: 5, prefix:'PX', level: 2}
      ]
    },
    {
      id: "PR004",
      name: "Samcorbex",
      nie: "SD191553861",
      het: 11000,
      storage : "Simpan dalam suhu ruangan",
      aggregations: [
        {name: "Box", quantity: 10, prefix:'BX', level: 1},
        {name: "Palet", quantity: 5, prefix:'PX', level: 2}
      ]
    }
];

export const jobsMockData = [
    {
        id : "J001",
        productID : "PR001",
        batchNo : "UX123",
        expiredDate : new Date(),
        topAggregationQty : 1,
        productQty: 50,
        jobStatus : "Active"
    }
];