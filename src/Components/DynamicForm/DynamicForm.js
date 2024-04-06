export default function DynamicForm({aggregations, onFormDataChange}) {
    
    const formData = aggregations.map((aggregation, index) => {
        return (
            <div key={index}>
                <label>
                    Level {index} Name <input style={{marginRight:'10px'}}name='name' placeholder={'Level Name'} value={aggregation.name || ''} onChange={(e) => {onFormDataChange(index, e)}}/>
                </label>
                <label>
                    Quantity <input name='quantity' type='number' placeholder='Quantity' value={aggregation.quantity} onChange={(e) => {onFormDataChange(index, e)}}/>
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