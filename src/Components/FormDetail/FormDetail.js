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
    return (
        <>
            <div className='box'>
                <label id='label'>{variableName}</label>
                <input type={"date"} value={value} onChange={(e)=>setValue(e.target.value)}/>
            </div>
        </>
    );
}

export function OptionForm({variableName, options, value, setValue}) {
    const optionList = options.map((option) => <option value={option}>{option}</option>);
    return (
        <>
            <div className='box'>
                <label id='label'>{variableName}</label>
                <select value={value} onChange={(e)=>setValue(e.target.value)}>
                    {optionList}
                </select>
            </div>
        </>
    );
}
