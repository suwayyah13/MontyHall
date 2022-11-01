import React from 'react';
import { useState } from "react";

export function SimulationCommon(props) {
    const [simulationNumber] = useState(props.simulationNumber);
    const [simulationRow] = useState(props.simulationRow);
    const [isRightChoise] = useState(props.isRightChoise);

    function renderDoor(cellId, isCar, isChoise) {
        var imgSrc = '/images/' + (isCar ? 'car.png' : 'goat.png');
        var imgSrcChoise = '/images/' + (isRightChoise===true ? 'isOk.png' : 'isMiss.png');
        return (
            <td key={cellId}>
                <img src={imgSrc} alt={cellId} width="100px" />
                {isChoise && (
                    <img src={imgSrcChoise} width="20px" alt="Choosen one" />
                )}
            </td>
        );
    }

    function renderSimulation() {
        var result = (
            <table className="door-table">
                <tbody>
                    <tr>
                        {simulationRow.doors && simulationRow.doors.map(({ cellId, isCar, isChoise }) => (
                            renderDoor(cellId, isCar, isChoise)
                        ))}
                    </tr>
                </tbody>
            </table>
        ); 
        return result;
    }
    
    return (
        <div>
            <h2>Simulation # {simulationNumber + 1}</h2>
            {renderSimulation()}
        </div>
    );
}