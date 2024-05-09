import API_ENDPOINTS from "../Utilities/API/APICalls";
import APIService from "../Utilities/API/Api";

function OrderAPI(){
    const apiService = APIService(API_ENDPOINTS.orders);

    async function fetchOrdersFromJobId(jobId, completion){
        apiService.fetchDataFromId(jobId)
            .then((response)=> {
                if (response.status === 200) {
                    completion(response.data);
                } else {
                    return [];
                }
            });
    }

    async function fetchOrdersFromQuery(query){
        apiService.fetchDataFromQuery(query)
            .then((response) => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return [];
                }
            });
    }

    async function updateOrders(orders, completion){
        const jsonData = {
            orders: orders.map(order => order.toJSON())
        };
        apiService.updateBatchDatas(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                    alert('Data orders berhasil diupdate!');
                } else {
                    alert(`Gagal mengubah data order! ${response.error}`);
                }
            });
    }

    async function updateOrdersMasterbox(orders, masterboxId, completion) {
        const jsonData = {
            masterbox_id : masterboxId,
            orders: orders
        }

        fetch(`${API_ENDPOINTS.orders}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                completion();
                alert('Data order berhasil diupdate!');
            } else {
                alert(`Gagal mengubah data order! ${data.error}`);
            }
        });
    }

    async function insertOrders(orders, completion){
        const jsonData = {
            orders : orders.map(order => order.toJSON())
        }
        apiService.insertData(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                    alert('Data orders berhasil ditambahkan!');
                } else {
                    alert(`Gagal menambahkan data order! ${response.error}`);
                }
            });
    }

    async function deleteOrders(orders){
        const orderIds = orders.map(order => order.id);
        orderIds.forEach(orderId => {
            apiService.deleteData(orderId)
                .then((response) => {
                    if (response.status !== 200) {
                        alert(`Gagal menghapus data order! ${response.error}`);
                    }
                })
        });
    }

    return { fetchOrdersFromJobId, fetchOrdersFromQuery, updateOrders, updateOrdersMasterbox, insertOrders, deleteOrders };
}

export default OrderAPI;