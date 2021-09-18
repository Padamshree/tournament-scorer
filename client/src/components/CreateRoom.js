import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Popup from './Popup';

import { get, post } from '../utils';

import '../styles/CreateRoom.css';

const judgeCountOptions = [
    { value: 5, label: '5' },
    { value: 7, label: '7' },
];

export default function CreateRoom() {

    const roomBaseURL = window.location.origin + '/room/';

    const [blueName, setBlueName] = useState("");
    const [redName, setRedName] = useState("");

    const [judgeList, setJudgeList] = useState([]);
    const [judgeCount, setJudgeCount] = useState({});
    const [judgeCountFilled, setJudgeCountFilled] = useState(true);
    const [selectedJudges, setSelectedJudges] = useState([]);
    const [finalJudges, setFinalJudges] = useState({ finalList: [], displayList: '' });

    const [roomCreated, setRoomCreated] = useState(false);
    const [roomId, setRoom] = useState("");

    const [togglePopup, setTogglePopup] = useState({ message: '', success: false });

    useEffect(() => {
        get('/get_users')
        .then(res => res.json())
        .then(res => {
            let newList = [];
            res.userList.map((user) => {
                newList = [...newList,  
                    { value: user.email, label: user.name }
                ];
                console.log(user.name);
            });
            setJudgeList(newList);
            console.log(judgeList);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const createRoom = () => {

        let errors = [];
        if (redName === '' || blueName === '') {
            errors.push('Please enter Particpants names.')
        }

        if (!judgeCount.value) {
            errors.push('Select Number of Judges.')
        }

        if (selectedJudges.length !== judgeCount.value) {
            errors.push(`Select ${judgeCount.value} judges.`)
        }

        if (errors.length) {
            const toggleOpen = {
                message: errors[0],
                success: false,
            }
            setTogglePopup(toggleOpen);
        } else {
            const data = {
                redName,
                blueName,
                scoreCount: judgeCount.value,
                judgeList: finalJudges.finalList,
            };
            post('/createRoom', data)
            .then(res => res.json())
            .then(res => {
                let toggleOpen = {};
                if (res.success) {
                    toggleOpen = {
                        message: res.message,
                        success: res.success,
                    }
                    setTogglePopup(toggleOpen);
                    setRoom(res.room);
                    setRoomCreated(true);
                } else {
                    toggleOpen = {
                        message: res.message,
                        success: res.success,
                    }
                    console.log('Failed to create Room');
                }
            });
        }
    }

    const newRoom = () => {
        setBlueName('');
        setRedName('');
        setRoom('');
        setJudgeCount({});
        setJudgeCountFilled(true);
        setSelectedJudges([]);
        setFinalJudges({ finalList: [], displayList: '' });
        setRoomCreated(false);
    }

    const closePopup = () => {
        setTogglePopup({ message: '', success: false });
    }

    useEffect(() => {
        let newList = [];
        let displayList = [];
        selectedJudges.map((judge) => {
            displayList = [...displayList, judge.label];
            newList = [...newList, { name: judge.label, email: judge.value }];
        });
        newList = newList.slice(0, judgeCount.value);
        displayList = displayList.slice(0, judgeCount.value);
        let judgeList = displayList.join(', ');
        setFinalJudges({ finalList: newList, displayList: judgeList });
    }, [selectedJudges]);

    return (
        <div className='create-main'>
            Hello, Enter names and create Room.
            <br />
            <br />
            <div>
                <TextField
                    style={{ width: "15rem" }}
                    label="Ao Name"
                    value={blueName}
                    onChange={(e) => setBlueName(e.target.value)}
                    InputProps={{
                        readOnly: roomCreated ? true : false,
                    }}
                />
                <br />
                <TextField
                    style={{ width: "15rem" }}
                    label="Aka Name"
                    value={redName}
                    onChange={(e) => setRedName(e.target.value)}
                    InputProps={{
                        readOnly: roomCreated ? true : false,
                    }}
                />
            </div>
            <br />
            <br />
            <div className='dropdowns'>
                <Select
                    className='unit-dropdown'
                    placeholder="Select Judge Count"
                    isMulti={false}
                    isSearchable
                    value={judgeCount}
                    options={judgeCountOptions}
                    onChange={(option, _action) => {
                        setJudgeCount(option);
                        judgeCount && judgeCount.value >= 0 ? 
                        setJudgeCountFilled(true): setJudgeCountFilled(false)
                        }
                    }
                />
                <Select
                    className='unit-dropdown'
                    placeholder="Select Judges"
                    isMulti
                    isSearchable
                    isDisabled={judgeCountFilled}
                    options={judgeList}
                    value={selectedJudges && selectedJudges.length > 0
                    && selectedJudges.map((judge) => ({ value: judge.value, label: judge.label }))}
                    onChange={(_option, action) => {
                        let selectedOption = {};
                        let newList = [];
                        if (action.action === 'select-option') {
                            selectedOption = action.option;
                            console.log(selectedOption);
                            newList = [...selectedJudges, selectedOption]
                        } else if (action.action === 'remove-value') {
                            newList = selectedJudges.filter((item) => item.value !== action.removedValue.value );
                        }
                        setSelectedJudges(newList);
                    }}
                />
            </div>
            <br />
            <br />
            <div>
            <TextField
                label="Judges Selected"
                value={finalJudges.displayList}
                multiline
                maxRows={4}
                InputProps={{
                    readOnly: true
                }}
            />
            </div>
            <br />
            {
                roomId === '' && 
                    <Button
                    color='primary'
                    variant='contained'
                    onClick={createRoom}
                    >
                        Create Room
                    </Button>
            }
            <br />
            <br />
            {
                roomId && roomId !== null 
                && <TextField
                        style={{ width: "25rem" }}
                        label="Room Id"
                        value={`${roomBaseURL}${roomId}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
            }
            <br />
            {
                roomId && 
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={newRoom}
                    >
                        New Room
                    </Button>
            }
            <br />
            {
                togglePopup.message && 
                    <Popup 
                        {...togglePopup}
                        open={true}
                        handlePopup={closePopup}
                    />
            }
        </div>
    )
}
