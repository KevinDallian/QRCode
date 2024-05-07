class Masterbox {
    constructor(id, jobId, productId, childQuantity, manufactureDate, jobStatus) {
        this.id = id;
        this.jobId = jobId;
        this.productId = productId;
        this.childQuantity = childQuantity;
        this.manufactureDate = manufactureDate;
        this.jobStatus = jobStatus;
    }

    toJSON() {
        return {
            masterbox_id: this.id,
            job_id: this.jobId,
            product_id: this.productId,
            child_quantity: this.childQuantity,
            manufacture_date: this.manufactureDate,
            status: this.jobStatus
        }
    }
}

export default Masterbox;