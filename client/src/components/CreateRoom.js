import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import { get, post } from '../utils';

export default function CreateRoom() {

    const [roomId, setRoom] = useState("");
    const [blueName, setBlueName] = useState("");
    const [redName, setRedName] = useState("");
    const [roomCreated, setRoomCreated] = useState(false);

    useEffect(() => {
        get('/get_users')
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const createRoom = () => {
        const data = {
            redName,
            blueName,
        };
        post('/createRoom', data)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.success) {
                setRoom(res.room);
                setRoomCreated(true);
            } else {
                console.log('Failed to create Room');
            }
        });
    }

    const newRoom = () => {
        setBlueName('');
        setRedName('');
        setRoom('');
        setRoomCreated(false);
    }

    return (
        <div>
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
                    // inputProps={{ 
                    //     style: { 
                    //         width: '15rem',
                    //         textAlign: 'center',
                    //     }
                    //  }}
                    InputProps={{
                        readOnly: roomCreated ? true : false,
                    }}
                />
            </div>
            <br />
            <Button
                color='primary'
                variant='contained'
                onClick={createRoom}
            >
                Create Room
            </Button>
            <br />
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
            <br />
            {
                roomId && roomId !== null 
                && <TextField
                        style={{ width: "25rem" }}
                        label="Room Id"
                        value={`localhost:3000/room/${roomId}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
            }
        </div>
    )
}
