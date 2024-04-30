import { useState, useEffect } from "react";
import APICalls from "../Utilities/API/APICalls";

export function useFetch(url) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url, {method: 'GET'})
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            }); 
    }, [url]);

    return {data, loading, error};
}

export async function updateProduct(productId, updatedProduct) {
    const response = await fetch(`${APICalls.baseProducts}/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct.toJSON())
    });

    return response.json();
}

export async function insertProduct(product) {
    const response = await fetch(APICalls.baseProducts, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product.toJSON())
    });

    return response.json();
}

export async function deleteProduct(productId) {
    const response = await fetch(`${APICalls.baseProducts}/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}