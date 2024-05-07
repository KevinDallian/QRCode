import { useState, useEffect} from 'react';
import APIService from '../Utilities/API/Api';
import API_ENDPOINTS from '../Utilities/API/APICalls';

function MasterboxAPI(){
    const apiService = APIService(API_ENDPOINTS.masterboxs);
    const [masterboxsData, setMasterboxsData] = useState([]);

    useEffect(() => {
        
    }, []);

    async function fetchData(){
        apiService.fetchData()
            .then((response) => {
                if (response.status === 200) {
                    setMasterboxsData(response.data);
                } else {
                    alert(`Gagal mengambil data masterbox! ${response.error}`);
                }
            });
    }

    async function fetchDataFromJobId(jobId, completion){
        apiService.fetchDataFromId(jobId)
            .then((response) => {
                if (response.status === 200) {
                    completion(response.data);
                } else {
                    alert(`Gagal mengambil data masterbox! ${response.error}`);
                }
            });
    }

    async function insertMasterbox(masterboxData, completion){
        const jsonData = masterboxData.toJSON();
        apiService.insertData(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                } else {
                    alert(`Gagal menambahkan data masterbox! ${response.error}`);
                }
            });
    }

    async function updateMasterbox(masterboxId, masterboxData, completion){
        const jsonData = masterboxData.toJSON();
        apiService.updateData(masterboxId, jsonData)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                    alert('Data masterbox berhasil diubah!');
                } else {
                    alert(`Gagal mengubah data masterbox! ${response.error}`);
                }
            });
    }

    async function deleteMasterbox(masterboxId, completion){
        apiService.deleteData(masterboxId)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                    alert('Data masterbox berhasil dihapus!');
                } else {
                    alert(`Gagal menghapus data masterbox! ${response.error}`);
                }
            });
    }

    return { masterboxsData, fetchDataFromJobId, insertMasterbox, updateMasterbox, deleteMasterbox};
}

export default MasterboxAPI;