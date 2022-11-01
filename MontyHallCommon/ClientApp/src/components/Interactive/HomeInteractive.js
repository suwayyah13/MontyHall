import React, { useState, useEffect, useRef } from 'react';
import { SimulationInteractive } from './SimulationInteractive';

export function HomeInteractive() {
    const [simulationsNumber, setSimulationsNumber] = useState(1);
    const [simulations, setSimulations] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [simulationsLoading, setSimulationsLoading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const didMount = useRef(false);

    const handleInstructions = () => {
        setShowInstructions(!showInstructions);
    };
    const ModalInstructions = ({ handleClick, show, children }) => {
        const showHideClassName = show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName} onClick={handleClick}>
                <section className="modal-main">
                    {children}
                    <br />
                    <button onClick={handleClick} >Close</button>
                </section>
            </div>
        );
    };
    function handleSimulationNumberChange(event) {
        var simulationsNumberLocal = checkSimulationNumber(event.target.value);
        setSimulationsNumber(simulationsNumberLocal);
    }
    function checkSimulationNumber(value) {
        if (isNaN(value)) {
            value = 1;
        } else {
            value = parseInt(value);
        }
        return value;
    }
    function startSimulations() {
        setSimulationsLoading(true);
        if (simulations.length > 0) {
            var simulationsLocal = [];
            setSimulations(simulationsLocal);
        } else {
            generateSimulations();
        }
    }
    function generateSimulations() {
        fetch('montyhall/interactive/' + simulationsNumber)
            .then((response) => response.json())
            .then((simulationData) => {
                var simulationsLocal = [];
                for (let i = 0; i < simulationData.length; i++)
                {
                    simulationsLocal.push(<SimulationInteractive key={i} simulationNumber={i} simulationRow={simulationData[i]} />)
                }
                setSimulations(simulationsLocal);
                setSimulationsLoading(false);
            })
            .catch((err) => {
                setErrorText("Error while generate application data");
                console.log(err);
            });
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
            <button type="button" className="btn-primary" onClick={startSimulations}>Start simulation</button>
            <ModalInstructions show={showInstructions} handleClick={handleInstructions}>
                <h3>Instructions</h3>
                1. Enter the numer of simulations.<br />
                2. Press Start simulation button.<br />
                3. Choose simulation and the door you want to open.<br />
                4. After Monty open 1 door You should decide - change the door or not.<br />
                5. Check result.<br />
            </ModalInstructions>
            <button type="button" onClick={handleInstructions}>Instructions</button>
            <div className="errors">
                {errorText}
            </div>
            <div className="box-container">
                {simulations.map(child => child)}
            </div>
        </div>
    );
}