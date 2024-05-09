import { useEffect, useState } from "react";
import API_ENDPOINTS from "../Utilities/API/APICalls";
import APIService from "../Utilities/API/Api";

function AggregationAPI() {
    const apiService = APIService(API_ENDPOINTS.aggregations);
    const [aggregationsData, setAggregationsData] = useState(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        apiService.fetchData()
            .then((response) => {
                if (response.status === 200) {
                    setAggregationsData(response.data);
                } else {
                    return [];
                }
            });
    }, []);

    async function insertAggregations(aggregationsData) {
        const jsonData = {
            aggregations : aggregationsData.map((aggregation) => aggregation.toJSON())
        }
        apiService.insertData(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    alert('Data aggregasi berhasil ditambahkan!');
                } else {
                    alert(`Gagal menambahkan data aggregasi! ${response.error}`);
                }
            });
    }

    async function updateAggregations(aggregationsData) {
        const jsonData = {
            aggregations : aggregationsData.map((aggregation) => aggregation.toJSON())
        }
        apiService.updateBatchDatas(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    alert('Data aggregasi berhasil diupdate!');
                } else {
                    alert(`Gagal mengupdate data aggregasi! ${response.error}`);
                }
            })
    }

    async function deleteAggregations(aggregationId) {
        apiService.deleteData(aggregationId)
            .then((response) => {
                if (response.status === 200) {
                    alert('Data aggregasi berhasil dihapus!');
                } else {
                    alert(`Gagal menghapus data aggregasi! ${response.error}`);
                }
            });
    }

    return { aggregationsData, insertAggregations, updateAggregations, deleteAggregations};
    
}

export default AggregationAPI