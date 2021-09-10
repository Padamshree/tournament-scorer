import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { get, constructURL } from '../utils';

import '../styles/Room.css';
import OutlinedCard from './ScoreCards';

const Room = ({ socket }) => {
    
    const { token } = useParams();
    const email = localStorage.email;
    
    const [connect, setConnect] = useState(false);
    const [redScore, setRedScore] = useState(0);
    const [blueScore, setBlueScore] = useState(0);
    const [blueName, setBlueName] = useState('');
    const [redName, setRedName] = useState('');
    const [scoreMarked, setScoreMarked] = useState(false);
    const [scoreArray, setScoreArray]  = useState([]);
    const [winner, setWinner] = useState('');

    useEffect(() => {

        const URL = constructURL('/initData', { token, email });
        get(URL)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            const { data } = res;
            const { data: { 
                scorers,
                blueScore,
                redScore,
                blueName,
                redName,
                winner }} = res;

            if (winner) {
                setWinner(winner);
                setScoreMarked(true);
            }

            setRedScore(redScore);
            setBlueScore(blueScore);
            setBlueName(blueName);
            setRedName(redName);
            setScoreArray(scorers);
            setConnect(true);

            scorers && scorers.length > 0 && 
            scorers.forEach((scorer) => {
                if (email === scorer) {
                    setScoreMarked(true);
                    setConnect(false);
                }
            });
        })
        .catch(err => {
            console.log(err);
        });

        if ((blueScore+redScore) >= 5) {
            setScoreMarked(true);
        }

        socket.on('score', (data) => {
            setRedScore(data.redScore);
            setBlueScore(data.blueScore);
            setScoreArray(data.scorers);
        });
    }, []);

    useEffect(() => {
        if (connect && scoreMarked) {
            let updatedArray = [...scoreArray];
            updatedArray.push(email);
            setScoreArray(updatedArray);
            const data = {
                blueName,
                redName,
                blueScore,
                redScore,
                token,
                email,
                scoreArray: updatedArray,
            }
            socket.emit('updateScore', data);
            setConnect(false);
        }
    }, [redScore, blueScore]);

    const redHandler = () => {
        setRedScore(redScore+1);
        setScoreMarked(true);
    }

    const blueHandler = () => {
        setBlueScore(blueScore+1);
        setScoreMarked(true);
    }

    return (
        <div>
            <br />
            {console.log(winner)}
            {
                winner &&
                (
                    <div><p>{winner}</p></div>
                ) 
            }
            <br />
            <div className='score-container'>
                <div className='red-container player'>
                    <TextField
                        value={redName}
                        inputProps={{ 
                            style: { 
                                textAlign: 'center',
                            }
                        }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <br />
                    <OutlinedCard score={redScore} color='red'/>
                    <br />
                    <Button
                        name='redScore'
                        color='secondary'
                        variant='contained'
                        onClick={redHandler}
                        disabled={scoreMarked}
                    >
                        AKA
                    </Button>
                </div>
                <div className='blue-container player'>
                    <TextField
                        // style={{ textAlign: 'center' }}
                        value={blueName}
                        inputProps={{ 
                            style: { 
                                textAlign: 'center',
                            }
                        }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <br />
                    <OutlinedCard score={blueScore} color='blue'/>
                    <br />
                    <Button
                        name='blueScore'
                        color='primary'
                        variant='contained'
                        onClick={blueHandler}
                        disabled={scoreMarked}
                    >
                        AO
                    </Button>
                </div>
            </div>
            
        </div>
    )
}

export default Room;