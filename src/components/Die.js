import React from "react";

export default function Die(props){
    return (
        <div className="Die">
            <button style={{backgroundColor: props.isHeld ? "#59E391" : "white", transform: `rotateZ(${props.isHeld ? "0" : props.rotate}deg)`}} onClick={props.handleClick}>
                <div>
                    <span style={{backgroundColor: props.value !== 1 ? "black" : "transparent"}}></span>
                    <span style={{backgroundColor: props.value === 6 ? "black" : "transparent"}}></span>
                    <span style={{backgroundColor: props.value > 3 ? "black" : "transparent"}}></span>
                </div>
                <div>
                    <span></span>
                    <span style={{backgroundColor: props.value % 2 === 1 ? "black" : "transparent"}}></span>
                    <span></span>
                </div>
                <div>
                    <span style={{backgroundColor: props.value > 3 ? "black" : "transparent"}}></span>
                    <span style={{backgroundColor: props.value === 6 ? "black" : "transparent"}}></span>
                    <span style={{backgroundColor: props.value !== 1 ? "black" : "transparent"}}></span>
                </div>
            </button>
        </div>
    );
}