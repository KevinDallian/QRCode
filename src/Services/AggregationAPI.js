import { useEffect, useState } from "react";
import APICalls from "../Utilities/API/APICalls";
import APIService from "../Utilities/API/Api";

function AggregationAPI() {
    const apiService = APIService(APICalls.baseAggregations);
    const [aggregationsData, setAggregationsData] = useState(null);

    useEffect(() => {
        apiService.fetchData()
            .then((response) => {
                if (response.status === 200) {
                    setAggregationsData(response.data);
                } else {
                    alert(`Gagal mengambil data aggregasi! ${response.error}`);
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