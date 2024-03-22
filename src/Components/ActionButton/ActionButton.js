import './ActionButton.css'

export default function ActionButton({name, color = "#FFFFFF", onClickFunction}){
    return (
        <button id="actionButton" style={{backgroundColor:color}} onClick={()=>onClickFunction()}>{name}</button>
    );
}