import "./DisplayButton.css";

export default function DisplayButton({image, text}) {
    return (
        <>
        <button className="displayBtn" onClick={()=> console.log("Clicked")}>
            <img src={image} alt="Logo"/>
            {text}
            </button>
        </>
    );
}