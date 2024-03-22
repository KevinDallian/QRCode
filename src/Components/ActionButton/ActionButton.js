import './ActionButton.css'

export default function ActionButton({name, color = "#FFFFFF", onClickFunction, disabled = false}){
    return (
        <button id="actionButton" style={{backgroundColor:color}} onClick={()=>onClickFunction()} disabled={disabled}>{name}</button>
    );
}