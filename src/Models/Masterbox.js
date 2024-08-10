class Masterbox {
    constructor(id, jobId, productId, childQuantity, manufactureDate, jobStatus, hasMasterbox, parentMasterboxId = null) {
        this.id = id;
        this.jobId = jobId;
        this.productId = productId;
        this.childQuantity = childQuantity;
        this.manufactureDate = manufactureDate;
        this.jobStatus = jobStatus;
        this.hasMasterbox = hasMasterbox;
        this.parentMasterboxId = parentMasterboxId;
    }

    toJSON() {
        return {
            masterbox_id: this.id,
            job_id: this.jobId,
            product_id: this.productId,
            child_quantity: this.childQuantity,
            manufacture_date: this.manufactureDate,
            status: this.jobStatus,
            has_masterbox : this.hasMasterbox,
            parent_masterbox : this.parentMasterboxId ? 1 : 0
        }
    }
}

export default Masterbox;