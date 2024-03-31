import './FormDetail.css';

export function FormDetail({variableName, value, setValue}){
    return (
        <>
            <div className='box'>
                <label id='label'>{variableName}</label>
                <input value={value} onChange={(e)=>setValue(e.target.value)}/>
            </div>
        </>
    );
}

export function DateForm({variableName, value, setValue}){
    const formatDate = (date) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }
    return (
        <>
            <div className='box'>
                <label id='label'>{variableName}</label>
                <input type={"date"} value={formatDate(value)} onChange={(e)=>setValue(e.target.value)}/>
            </div>
        </>
    );
}

export function OptionForm({variableName, options, value, setValue}) {
    const optionList = options.map((option) => <option key={option} value={option}>{option}</option>);
    return (
        <>
            <div className='box'>
                <label id='label'>{variableName}</label>
                <select value={value} onChange={(e)=>setValue(e.target.value)}>
                    <option value=''>Pilih {variableName}</option>
                    {optionList}
                </select>
            </div>
        </>
    );
}
