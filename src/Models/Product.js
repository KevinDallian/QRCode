class Product {
    constructor(id, name, nie, het, storage, aggregations) {
        this.id = id;
        this.name = name;
        this.nie = nie;
        this.het = het;
        this.storage = storage;
        this.aggregations = aggregations;
    }

    toJSON(){
        return {
            product_id: this.id,
            name: this.name,
            nie: this.nie,
            het: this.het,
            storage_condition: this.storage
        };
    }
}

export default Product;