import { useEffect, useState } from "react";
import APIService from "../Utilities/API/Api";
import API_ENDPOINTS from "../Utilities/API/APICalls";

function ProductAPI() {
    const apiService = APIService(API_ENDPOINTS.products);
    const [productData, setProductData] = useState(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        apiService.fetchData()
            .then((response) => {
                if (response.status === 200) {
                    setProductData(response.data);
                }
            });
    }, []);

    async function updateProduct(id, updatedData, completion) {
        const jsonData = updatedData.toJSON();
        apiService.updateData(id, jsonData)
        .then((response) => {
            if (response.status === 200) {
                completion();
                alert('Data produk berhasil diupdate!');
            } else {
                alert(`Gagal mengupdate data produk! ${response.error}`);
            }
        });
    }

    async function insertProduct(data, completion) {
        const jsonData = data.toJSON();
        apiService.insertData(jsonData)
        .then((response) => {
            if (response.status === 200) {
                completion();
                alert('Data produk berhasil ditambahkan!');
            } else {
                alert(`Gagal menambahkan data produk! ${response.error}`);
            }
        });
    }

    async function deleteProduct(id, completion) {
        apiService.deleteData(id)
        .then((response) => {
            if (response.status === 200) {
                completion();
                alert('Data produk berhasil dihapus!');
            } else {
                alert(`Gagal menghapus data produk! ${response.error}`);
            }
        });
    }

    return { productData, updateProduct, insertProduct, deleteProduct};
}

export default ProductAPI;