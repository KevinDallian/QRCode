import { FormDetail, DateForm, OptionForm, NumberForm } from '../../Components/FormDetail/FormDetail';
import './JobOrder.css';
import { Link } from 'react-router-dom';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import JobController from './JobController';

export default function JobOrder() {
    const jobController = new JobController();
  
    return (
      <>
        <Link to="/">Back</Link>
        <h1 className="title">Job Order</h1>
        <div className="flex-row">
          <form id="form">
            <OptionForm
              variableName="Produk"
              options={jobController.productsID}
              value={jobController.productID}
              setValue={(e) => jobController.setProductID(e)}
            />
            <FormDetail
              variableName="Batch No"
              value={jobController.batchNo}
              setValue={(e) => jobController.setBatchNo(e)}
            />
            <DateForm
              variableName="Expired Date"
              value={jobController.expiredDate}
              setValue={(e) => jobController.setDate(e)}
            />
            <NumberForm
              variableName="Top Aggregation Qty"
              value={jobController.topQuantity}
              setValue={jobController.setTopQuantity}
            />
            <NumberForm
              variableName="Product Qty"
              value={jobController.quantity}
              setValue={jobController.setQuantity}
            />
            <OptionForm
              variableName="Job Status"
              options={["Active", "Cancel", "Suspended"]}
              value={jobController.jobStatus}
              setValue={(e) => jobController.setJobStatus(e)}
            />
          </form>
          <div style={{ marginLeft: "10vw" }}>
            {jobController.currentProduct !== null && (
              <>
                <div style={{ fontWeight: "bold" }}>
                  Product Quantity Estimation :
                </div>
                <div>{jobController.quantity} Produk</div>
                {jobController.currentProduct.aggregations
                  .sort((a, b) => a.level - b.level)
                  .map((aggregation, index) => {
                    let estimatedQuantity = 0;
                    if (aggregation.level > 1) {
                      const previousQuantity = jobController.currentProduct.aggregations
                        .slice(0, index)
                        .reduce((acc, curr) => acc / curr.quantity, jobController.quantity);
                      estimatedQuantity = previousQuantity / aggregation.quantity;
                    } else {
                      estimatedQuantity =
                        jobController.quantity / aggregation.quantity;
                    }
                    return (
                      <div style={{ marginTop: "5px" }} key={index}>
                        <div style={{ fontWeight: "bold" }}>
                          Level {aggregation.level} : {aggregation.name}
                        </div>
                        <div>Kapasitas : {aggregation.quantity}</div>
                        <div>Kuantitas : {estimatedQuantity} {aggregation.name}</div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
        <div id="buttonRow">
          <ActionButton
            name={"Delete"}
            color="#ffa2a2"
            onClickFunction={jobController.deleteData}
            disabled={jobController.currentIndex === null}
          />
          <div>
            <ActionButton
              name={"Clear"}
              color="#fdff9b"
              onClickFunction={jobController.clearData}
            />
            <ActionButton
              name={"Save"}
              color="#b5f9b8"
              onClickFunction={jobController.saveData}
              disabled={jobController.validateData()}
            />
          </div>
        </div>
  
        <div id="table">
          <ReactTable
            headers={jobController.header}
            datas={jobController.jobDisplay}
            currentIndex={null}
            onClickHandler={jobController.onClickRow}
          />
        </div>
      </>
    );
  }
  