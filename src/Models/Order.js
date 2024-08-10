class Order {
    constructor(id, jobID, productId, masterboxID = null, manufactureDate = null, status) {
        this.id = id;
        this.jobID = jobID;
        this.productID = productId;
        this.masterboxID = masterboxID;
        this.manufactureDate = manufactureDate;
        this.status = status;
    }

    toJSON(){
        return {
            order_id: this.id,
            product_id: this.productID,
            job_id: this.jobID,
            masterbox_id: this.masterboxID || "",
            manufacture_date: this.manufactureDate || "",
            status: this.status
        }
    }
}

export default Order;