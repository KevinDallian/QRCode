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

    async function updateAggregations(updatedAggregations) {
        apiService.updateData(id, updatedData)
        .then((response) => {
            if (response.status === 200) {
                alert('Data aggregasi berhasil diupdate!');
            } else {
                alert(`Gagal mengupdate data aggregasi! ${response.error}`);
            }
        });
    }

    async function insertAggregation(aggregationsData) {
        
    }
    
}

export default AggregationAPI