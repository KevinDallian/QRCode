import "./DisplayButton.css";

export default function DisplayButton({image, text}) {
    return (
        <>
        <button className="displayBtn" onClick={()=> console.log("Clicked")}>
            <img className="image" src={image} alt="Logo"/>
            <div id="text">{text}</div>
            </button>
        </>
    );
}