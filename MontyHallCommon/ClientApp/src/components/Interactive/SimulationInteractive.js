import React, { Component, useState } from 'react';

class DoorImageHandle extends Component {
    handleClick = () => {
        this.props.onClick(this.props.cellId);
    }

    render() {
        var props = this.props;
        var imgSrc = '/images/';
        var imgSrcChoise = imgSrc;
        if (props.isFinished === true)
        {
            if (props.isCar === true) {
                imgSrc += 'car.png';
            } else {
                imgSrc += 'goat.png';
            }
            var isRightChoise = (props.isChoise === true && props.isCar !== props.changeTheDoor);
            imgSrcChoise += (isRightChoise ? 'isOk.png' : 'isMiss.png');
        } else if (props.isChoise === true) {
            imgSrc += 'door_opened.png';
        } else if (props.isMontyChoise === true) {
            imgSrc += 'goat.png';
        } else {
            imgSrc += 'door_closed.png';
        }
        return (
            <td key={props.cellId}>
                <img src={imgSrc} onClick={this.handleClick} alt={props.cellId} width="100px" />
                {props.isFinished && props.isChoise && (
                    <img src={imgSrcChoise} width="20px" alt="Choosen one" />
                )}
            </td>
        );
    }
}

export function SimulationInteractive(props) {
    const [alreadyFinished] = useState('This simulation\'s is already opened');
    const [simulationNumber] = useState(props.simulationNumber);
    const [simulationRow, setSimulationRow] = useState(props.simulationRow);
    const [isOpened, setIsOpened] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [changeTheDoor, setChangeTheDoor] = useState(false);
    const [errorText, setErrorText] = useState('');

    function handleChangeTheDoorClick(event) {
        setChangeTheDoor(event.target.checked);
    }
    function checkResponse(response) {
        if (response.ok) {
            return response.json();
        } else {
            try {
                var responseError = response.json();
                throw new Error(responseError.value.detailedMessage);
            } catch(e) {
                throw new Error('Unexpected network error.');
            }
        }
    }
    function checkResponseData(cellId, responseData) {
        var simulationRowLocal = simulationRow;
        const foundCell = simulationRowLocal.doors.find(obj => {
            return obj.cellId === cellId;
        });
        if (foundCell !== undefined) {
            var openDoorId;
            if (Number.isInteger(responseData)) {
                openDoorId = Number.parseInt(responseData);
            } else {
                throw new Error('Response data validation error');
            }
            const foundMonty = simulationRowLocal.doors.find(obj => {
                return obj.cellId === openDoorId;
            });
            if (foundMonty !== undefined) {
                foundMonty.isMontyChoise = true;
            } else {
                throw new Error('Error getting Monty choise data');
            }
            foundCell.isChoise = true;
            setSimulationRow({ doors: [...simulationRowLocal.doors] });
            setIsOpened(true);
        } else {
            throw new Error('Incorrect cell id');
        }
    }
    function doorClick(cellId) {
        setErrorText('');
        if (isFinished === true) {
            alert(alreadyFinished);
        } else if (isOpened === true) {
            openTheDoor();
        } else {
            fetch('montyhall/choose/' + cellId + '/' + simulationNumber + '/')
                .then((response) => checkResponse(response))
                .then((responseData) => checkResponseData(cellId, responseData))
                .catch((error) => {
                    setErrorText('Error getting the door data: ' + error.message);
                });
        }
    }
    function checkResponseOpenData(responseData) {
        var simulationRowLocal = simulationRow;
        var carDoorId;
        if (Number.isInteger(responseData)) {
            carDoorId = Number.parseInt(responseData);
        } else {
            throw new Error('Response data validation error');
        }
        const foundCar = simulationRowLocal.doors.find(obj => {
            return obj.cellId === carDoorId;
        });
        if (foundCar === undefined) {
            throw new Error('Error getting Your choise data');
        } else {
            foundCar.isCar = true;
        }
        console.log({ carDoorId: carDoorId, foundCar: foundCar })
        setSimulationRow({ doors: [...simulationRowLocal.doors] });
        setIsFinished(true);
    }
    function openTheDoor() {
        setErrorText('');
        if (isFinished === true) {
            alert(alreadyFinished);
        } else {
            fetch('montyhall/open/' + simulationNumber + '/')
                .then((response) => checkResponse(response))
                .then((responseData) => checkResponseOpenData(responseData))
                .catch((error) => {
                    setErrorText('Error opening the doors: ' + error.message);
                });
        }
    }

    return (
        <div>
            <h2>Interactive simulation # {simulationNumber}</h2>
            <div className="errors">{errorText}</div>
            <table className="door-table">
                <tbody>
                    <tr>
                        {simulationRow.doors && simulationRow.doors.map(({ cellId, isMontyChoise, isChoise, isCar }) => (
                            <DoorImageHandle
                                key={cellId}
                                cellId={cellId}
                                isFinished={isFinished}
                                isMontyChoise={isMontyChoise}
                                isChoise={isChoise}
                                isCar={isCar}
                                changeTheDoor={changeTheDoor}
                                onClick={doorClick}
                            />
                        ))}
                        <td>
                            {isOpened && 
                                <div>
                                    <label>
                                        Change the door? <br />
                                        <input type="checkbox" name="changeDoor" value="false" onChange={handleChangeTheDoorClick} />
                                    </label>
                                </div>
                            }
                        </td>
                        <td>
                            {isOpened && !isFinished &&
                                <button type="button" className="btn-primary" onClick={openTheDoor}>Open the door</button>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}