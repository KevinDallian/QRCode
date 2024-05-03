function APIService(baseUrl) {

    async function fetchData(){
        const response = await fetch(baseUrl, {method: 'GET'});
        return response.json();
    }

    async function fetchDataFromId(id){
        const response = await fetch(`${baseUrl}/${id}`, {method: 'GET'});
        return response.json();
    }

    async function updateDatabyId(id, updatedData) {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        return response.json();
    }

    async function updateBatchDatas(updatedData) {
        const response = await fetch(`${baseUrl}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        return response.json();
    }

    async function insertData(data) {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    async function deleteData(id) {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
    
    return { fetchData, fetchDataFromId, updateData: updateDatabyId, updateBatchDatas, insertData, deleteData};
}

export default APIService;