import './ReactTable.css';

export default function ReactTable({headers, datas, currentIndex, onClickHandler}){
    const headerDisplay = headers.map(header =>
        <th key={header}>{header}</th>
        );
    const dataDisplay = datas.map((data, index) =>
        <tr className='row' key={index} onClick={()=>onClickHandler(index)} style={currentIndex === index ? {backgroundColor: "#d3ffff"} : {}}>
            <td>{data.id}</td>
            <td>{data.name}</td>
            <td>{data.nie}</td>
            <td>{data.het}</td>
            <td>{data.quantity}</td>
            <td>{data.storage}</td>
        </tr>
        );
    return (
        <table id='table'>
            <thead>
                <tr>{headerDisplay}</tr>
            </thead>
            
            <tbody>
                {dataDisplay.length === 0 ? <EmptyRow headersLength={headers.length} /> : dataDisplay}
            </tbody>
        </table>
    );
}

function EmptyRow({headersLength}) {
    return (
        <>
            <tr aria-colspan={headersLength}>
                <td colSpan={headersLength} style={{textAlign:"center", fontWeight:"bold", color:"red"}}>No Data yet</td>
            </tr>
        </>
    );
}