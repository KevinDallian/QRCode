import './ActionButton.css'

export default function ActionButton({name, color = "#FFFFFF"}){
    return (
        <button id="actionButton" style={{backgroundColor:color}}>{name}</button>
    );
}