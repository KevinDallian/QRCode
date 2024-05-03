class Job {
    constructor(id, productID, batchNo, expiredDate, topQuantity, orderQuantity, jobStatus, dateCreated){
        this.id = id;
        this.productID = productID;
        this.batchNo = batchNo;
        this.expiredDate = expiredDate;
        this.topQuantity = topQuantity;
        this.orderQuantity = orderQuantity;
        this.jobStatus = jobStatus;
        this.dateCreated = dateCreated;
    }

    static validateData(productID, batchNo, expiredDate, topQuantity, orderQuantity, jobStatus){
        return productID === "" || batchNo === "" || expiredDate === "" || topQuantity === "" || orderQuantity === "" || jobStatus === "";
    }

    toJSON(){
        return {
            job_id : this.id,
            product_id : this.productID,
            batch_no : this.batchNo,
            expired_date : this.expiredDate,
            top_order_qty : this.topQuantity,
            bottom_order_qty : this.orderQuantity,
            status : this.jobStatus,
            date_created : this.dateCreated,
        }
    }
}

export default Job;