import './ReactTable.css';

export default function ReactTable({headers, datas, currentIndex, onClickHandler}){
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };
    
    const headerDisplay = headers.map(header =>
        <th key={header}>{header}</th>
        );
    
    const dataDisplay = datas.map((data, index) => {
        const cells = Object.keys(data).map(key => {
            if (key === 'expiredDate') {
                return <td key={key}>{formatDate(data[key])}</td>;
            } else {
                return <td key={key}>{data[key]}</td>;
            }
        });
        return (
            <tr className='row' key={index} onClick={()=>onClickHandler(index)} style={currentIndex === index ? {backgroundColor: "#d3ffff"} : {}}>
                {cells}
            </tr>
        );
    });
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