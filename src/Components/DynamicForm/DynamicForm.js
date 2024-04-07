import './DynamicForm.css';

export default function DynamicForm({aggregations, onFormDataChange}) {
    const formData = aggregations.map((aggregation, index) => {
        return (
            <div key={index} className="form-row">
                <label>
                    Level {index + 1} Name <input style={{marginRight:'10px'}}name='name' placeholder={'Level Name'} value={aggregation.name || ''} onChange={(e) => {onFormDataChange(index, e)}}/>
                </label>
                <label>
                    Quantity <input name='quantity' style={{width: '2vw'}} type='number' placeholder='Quantity' min={0} value={aggregation.quantity || 0} onChange={(e) => {onFormDataChange(index, e)}}/>
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