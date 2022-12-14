import React, { Component } from 'react';

export class TheProblem extends Component {
    static displayName = TheProblem.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Monty Hall - The Problem</h1>
                <table>
                    <tr>
                        <td>
                            <p>The Monty Hall is a brain teaser, in the form of a probability puzzle,
                            loosely based on the American television game show Let's Make a Deal
                            and named after its original host, Monty Hall.</p>
                            <p>The concept of the game is that the player sees three closed doors - behind
                            one is a car, and behind the other two are goats. The game starts with the
                            player getting to choose a door, without opening it. Then the presenter
                            opens one of the two remaining doors (but never the one with the car) and
                            shows that this door does not contain profit. The player is then given
                            another choice to change the door.</p>
                            <p>The question is whether the chances of winning increase if the player
                            changes the door.</p><br />
                            <p>Source: <a href="https://en.wikipedia.org/wiki/Monty_Hall_problem">https://en.wikipedia.org/wiki/Monty_Hall_problem</a></p>
                        </td>
                        <td width="30%"><img src="/images/Monty_open_door.svg" width="100%" /></td>
                    </tr>
                </table>
            </div>
        );
    }
}
