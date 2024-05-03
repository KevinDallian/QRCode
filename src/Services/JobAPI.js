import { useEffect, useState } from "react";
import API_ENDPOINTS from "../Utilities/API/APICalls";
import APIService from "../Utilities/API/Api";

function JobAPI() {
    const apiService = APIService(API_ENDPOINTS.jobs);
    const [jobsData, setJobsData] = useState(null);

    useEffect(() => {
        apiService.fetchData()
            .then((response) => {
                if (response.status === 200) {
                    setJobsData(response.data);
                } else {
                    alert(`Gagal mengambil data pekerjaan! ${response.error}`);
                }
            });
    }, []);

    async function insertJobs(jobsData) {
        const jsonData = {
            jobs : jobsData.map((job) => job.toJSON())
        }
        apiService.insertData(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    alert('Data pekerjaan berhasil ditambahkan!');
                } else {
                    alert(`Gagal menambahkan data pekerjaan! ${response.error}`);
                }
            });
    }

    async function updateJobs(jobsData) {
        const jsonData = {
            jobs : jobsData.map((job) => job.toJSON())
        }
        apiService.updateBatchDatas(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    alert('Data pekerjaan berhasil diupdate!');
                } else {
                    alert(`Gagal mengupdate data pekerjaan! ${response.error}`);
                }
            })
    }

    async function deleteJobs(jobId) {
        apiService.deleteData(jobId)
            .then((response) => {
                if (response.status === 200) {
                    alert('Data pekerjaan berhasil dihapus!');
                } else {
                    alert(`Gagal menghapus data pekerjaan! ${response.error}`);
                }
            });
    }

    return { jobsData, insertJobs, updateJobs, deleteJobs};
}

export default JobAPI;