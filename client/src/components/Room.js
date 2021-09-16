import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { get, constructURL } from '../utils';

import '../styles/Room.css';
import OutlinedCard from './ScoreCards';

const Room = ({ socket }) => {
    
    const { token } = useParams();
    const email = localStorage.email;
    const role = localStorage.userRole;
    const winnerClass = 'blink-winner';
    
    const [connect, setConnect] = useState(false);
    const [redScore, setRedScore] = useState(0);
    const [blueScore, setBlueScore] = useState(0);
    const [blueName, setBlueName] = useState('');
    const [redName, setRedName] = useState('');
    const [scoreMarked, setScoreMarked] = useState(false);
    const [scoreArray, setScoreArray]  = useState([]);
    const [winner, setWinner] = useState('');

    const [redblinkWinner, setRedBlinkWinner] = useState('');
    const [blueblinkWinner, setBlueBlinkWinner] = useState('');

    const [scoreLimit, setScoreLimit] = useState(0);
    const [allowScoring, setAllowScoring] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const URL = constructURL('/initData', { token, email });
        get(URL)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            const { data } = res;
            const { data: {
                allowedJudges,
                scorers,
                scoreCount,
                blueScore,
                redScore,
                blueName,
                redName,
                winner }} = res;

            const checkPermissions = allowedJudges.includes(email);

            if (checkPermissions) {
                setLoading(false);
                setAllowScoring(true);
            } else if (role === 'admin') {
                console.log('Chai')
                setLoading(false);
                setAllowScoring(false);
            } else {
                return <Redirect to='/' />
            }

            if (winner) {
                setWinner(winner);
                setScoreMarked(true);
                winner === blueName ? 
                setBlueBlinkWinner(winnerClass): setRedBlinkWinner(winnerClass);
            } else {
                setScoreMarked(false);
            }

            setRedScore(redScore);
            setBlueScore(blueScore);
            setBlueName(blueName);
            setRedName(redName);
            setScoreArray(scorers);
            setScoreLimit(scoreCount);
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

        if ((blueScore+redScore) >= scoreLimit) {
            setScoreMarked(true);
        }

        socket.on('score', (data) => {
            setRedScore(data.redScore);
            setBlueScore(data.blueScore);
            setScoreArray(data.scorers);
            if (data.winner) {
                setWinner(data.winner);
                winner === blueName ? 
                setBlueBlinkWinner(winnerClass): setRedBlinkWinner(winnerClass);
            }
        });
    }, []);

    useEffect(() => {
        if (connect && scoreMarked && allowScoring) {
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
                scoreLimit,
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
            { !loading && 
             <div>
             <br />
             <div className='score-container'>
                 <div className={`red-container player ${redblinkWinner}`}>
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
                     <br />
                     {
                        winner && winner === redName &&
                            (
                                <div className="blink-winner"><p>Winner</p></div>
                            )
                     }
                 </div>
                 <div className={`blue-container player ${blueblinkWinner}`}>
                     <TextField
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
                     <br />
                     {
                        winner && winner === blueName &&
                            (
                                <div className="blink-winner"><p>Winner</p></div>
                            )
                     }
                 </div>
             </div>
             
         </div>
            }
        </div>
        
    )
}

export default Room;