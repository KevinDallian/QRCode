import { useEffect, useState } from "react";
import APIService from "../Utilities/API/Api";
import APICalls from "../Utilities/API/APICalls";

function ProductAPI() {
    const apiService = APIService(APICalls.baseProducts);
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        apiService.fetchData()
            .then((response) => {
                if (response.status === 200) {
                    setProductData(response.data);
                } else {
                    alert(`Gagal mengambil data produk! ${response.error}`);
                }
            });
    }, []);

    async function updateProduct(id, updatedData, completion) {
        apiService.updateData(id, updatedData)
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
        apiService.insertData(data)
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