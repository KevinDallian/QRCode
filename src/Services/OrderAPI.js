import { useEffect, useState } from "react";
import API_ENDPOINTS from "../Utilities/API/APICalls";
import APIService from "../Utilities/API/Api";

function OrderAPI(){
    const apiService = APIService(API_ENDPOINTS.orders);
    const [ordersData, setOrdersData] = useState([]);

    async function fetchOrdersFromJobId(jobId){
        apiService.fetchDataFromId(jobId)
            .then((response)=> {
                if (response.status === 200) {
                    setOrdersData(response.data);
                } else {
                    alert(`Gagal mengambil data order! ${response.error}`);
                }
            });
    }

    async function updateOrders(orders){
        const jsonData = orders.map(order => order.toJSON());
        apiService.updateBatchDatas(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    alert('Data orders berhasil diupdate!');
                } else {
                    alert(`Gagal mengubah data order! ${response.error}`);
                }
            });
    }

    async function updateOrdersMasterbox(orders, masterboxId) {
        const jsonData = {
            masterbox_id : masterboxId,
            orders : orders.map(order => order.id)
        }

        fetch(`${API_ENDPOINTS.orders}/orders`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
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

    return { ordersData, fetchOrdersFromJobId, updateOrders, updateOrdersMasterbox, insertOrders, deleteOrders };
}

export default OrderAPI;