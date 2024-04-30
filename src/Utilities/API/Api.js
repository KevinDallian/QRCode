import APICalls from "./APICalls";


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