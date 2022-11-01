import React, { useState, useEffect, useRef } from 'react';
import { SimulationCommon } from './SimulationCommon';

export function HomeCommon() {
    const [simulationsNumber, setSimulationsNumber] = useState(1);
    const [changeTheDoor, setChangeTheDoor] = useState(false);
    const [simulations, setSimulations] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [summaryText, setSummaryText] = useState('');
    const [simulationsLoading, setSimulationsLoading] = useState(false);
    const didMount = useRef(false);
    
    function handleSimulationNumberChange(event) {
        var simulationsNumberLocal = checkSimulationNumber(event.target.value) ;
        setSimulationsNumber(simulationsNumberLocal);
    }

    function handleChangeTheDoorClick(event) {
        setChangeTheDoor(event.target.checked);
    }
    
    function checkSimulationNumber(value) {
        if (isNaN(value)) {
            value = 1;
        } else {
            value = parseInt(value);
        }
        return value;
    }
    
    function startSimulation() {
        setSimulationsLoading(true);
        var simulationsLocal = [];
        setSimulations(simulationsLocal);
    }

    function generateSimulations() {
        if (simulationsNumber>0) {
            fetch('montyhall/common/' + simulationsNumber + '/')
                .then((response) => response.json())
                .then((simulationData) => {
                    var simulationsLocal = [];
                    var rightCounter = 0;
                    for (let i = 0; i < simulationData.length; i++) {
                        var simulationRow = simulationData[i];
                        const found = simulationRow.doors.find(door => {
                            return (
                                (door.isChoise && !changeTheDoor && door.isCar)
                                || (door.isChoise && changeTheDoor && !door.isCar)
                            );
                        });
                        var isRightChoise = !(found === undefined);
                        rightCounter += isRightChoise ? 1 : 0;
                        simulationsLocal.push(<SimulationCommon key={i} simulationNumber={i} simulationRow={simulationRow} isRightChoise={isRightChoise} />)
                    }
                    setSimulations(simulationsLocal);
                    setSimulationsLoading(false);
                    var percent = Math.round(100 * (simulationsLocal.length > 0 ? rightCounter / simulationsLocal.length : 0));
                    setSummaryText('Right choises is ' + rightCounter + ' of ' + simulationsLocal.length + ' - ' + percent + '%');
                })
                .catch((err) => {
                    setErrorText('Error while getting simulation data');
                    console.log(err);
                });
        } else {
            setErrorText('Incorrect number of simulations');
        }
    }
    
    useEffect(() => {
        if (!didMount.current) {
            return didMount.current = true;
        } else if (simulations.length === 0) {
            generateSimulations();
        }
    }, [simulations]);

    return (
        <div>
            <h1>Monty Hall problem</h1>
            <label>
                Number of simulations:
                <input type="number" name="simulationNumber" pattern="[0-9]*" value={simulationsNumber} onChange={handleSimulationNumberChange} />
            </label>
            <label>
                Change the door?
                <input type="checkbox" name="changeDoor" value="false" onChange={handleChangeTheDoorClick} />
            </label>
            <button type="button" className="btn-primary" onClick={startSimulation}>Start simulation</button>
            <div className="errors">
                {errorText}
            </div>
            <div className="summary">
                {summaryText}
            </div>
            <div className="box-container">
                {simulationsLoading && (
                    <img src="/images/loader02.gif" width="75px" alt="data is loading" />
                )}
                {simulations.map(child => child)}
            </div>
        </div>
    );
}