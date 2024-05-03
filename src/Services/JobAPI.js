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

    async function insertJob(jobData, completion) {
        const jsonData = jobData.toJSON();
        apiService.insertData(jsonData)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                    alert('Data pekerjaan berhasil ditambahkan!');
                } else {
                    alert(`Gagal menambahkan data pekerjaan! ${response.error}`);
                }
            });
    }

    async function updateJob(jobId, jobData, completion) {
        const jsonData = jobData.toJSON();
        apiService.updateData(jobId, jsonData)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                    alert('Data pekerjaan berhasil diubah!');
                } else {
                    alert(`Gagal mengubah data pekerjaan! ${response.error}`);
                }
            });
    }

    async function deleteJob(jobId, completion) {
        apiService.deleteData(jobId)
            .then((response) => {
                if (response.status === 200) {
                    completion();
                    alert('Data pekerjaan berhasil dihapus!');
                } else {
                    alert(`Gagal menghapus data pekerjaan! ${response.error}`);
                }
            });
    }

    return { jobsData, insertJob, updateJob, deleteJob};
}

export default JobAPI;