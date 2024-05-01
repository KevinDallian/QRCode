class Aggregation {
    constructor(id = null, productId, name, quantity, prefix, level, het) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.quantity = quantity;
        this.prefix = prefix;
        this.level = level;
        this.het = het;
    }

    toJSON(){
        if (this.id !== null) {
            return {
                id: this.id,
                product_id: this.productId,
                name: this.name,
                child_quantity: this.quantity,
                package_code: this.prefix,
                level: this.level,
                het: this.het
            };
        }
        return {
            product_id: this.productId,
            name: this.name,
            child_quantity: this.quantity,
            package_code: this.prefix,
            level: this.level,
            het: this.het
        };
    }
}

export default Aggregation