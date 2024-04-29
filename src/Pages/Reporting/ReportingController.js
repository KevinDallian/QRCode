import React from 'react';

class ReportingController {
    constructor() {

    }

    calculateOrderPrintedToday(orders) {
        if (orders === undefined || orders.length === 0) {
            return 0;
        }
        const currentDate = new Date().getDate();
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.printDate);
            return orderDate.getDate() === currentDate;
        });
        return filteredOrders.length;
    }

    calculateMasterboxPrintedToday(masterboxs) {
        if (masterboxs === undefined || masterboxs.length === 0) {
            return 0;
        }
        const currentDate = new Date().getDate();
        const filteredMasterbox = masterboxs.filter((masterbox) => {
            const masterboxDate = new Date(masterbox.printDate);
            return masterboxDate.getDate() === currentDate;
        });
        return filteredMasterbox.length;
    }
}

export default ReportingController;