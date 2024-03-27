import './Modal.css'

export default function Modal({children, width = '70vw'}) {
    return (
        <>
        <div className='modal'>
            <div className='modal-content' style={{width}}>
                {children}
            </div>
        </div>
        </>
    );
}