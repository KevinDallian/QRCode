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
            id : this.id,
            productID : this.productID,
            batchNo : this.batchNo,
            expiredDate : this.expiredDate,
            topQuantity : this.topQuantity,
            orderQuantity : this.orderQuantity,
            jobStatus : this.jobStatus,
            dateCreated : this.dateCreated,
        }
    }
}

export default Job;