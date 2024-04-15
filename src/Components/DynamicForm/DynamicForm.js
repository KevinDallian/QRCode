import './DynamicForm.css';

export default function DynamicForm({aggregations, onFormDataChange}) {
    const formData = aggregations.map((aggregation, index) => {
        return (
            <div key={index} className="form-row">
                <label>
                    Nama Level {index + 1} <input style={{marginRight:'1vw'}}name='name' placeholder={'Nama Level'} value={aggregation.name || ''} onChange={(e) => {onFormDataChange(index, e)}}/>
                </label>
                <label>
                    Kuantitas <input name='quantity' style={{width: '2vw', marginRight:'1vw'}} type='number' placeholder='Quantity' min={0} value={aggregation.quantity || 0} onChange={(e) => {onFormDataChange(index, e)}}/>
                </label>
                <label>
                    Prefix <input name='prefix' style={{width: '2vw'}} placeholder='BX' value={aggregation.prefix || ''} onChange={(e) => {onFormDataChange(index, e)}}/>
                </label>
            </div>
        )
    });
    return (
        <>
            {formData}
        </>
    );
}