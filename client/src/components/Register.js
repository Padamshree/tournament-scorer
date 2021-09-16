import React, { useState, useEffect } from 'react';
import  { useHistory } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import { post, get } from '../utils';

import '../styles/Login.css';

export default function Register(props) {
    let history = useHistory();

    const [name, setName] = useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (props.token) {
            console.log('Bello');
            history.push('/');
        }
    }, []);

    const handleAuth = (e) => {
        e.preventDefault();

        post('/register', { email, password, name })
        .then(res => res.json())
        .then(res => {
                console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className='container'>
            <div className='outlined-box'>
                <h3 className='box-header'>Register</h3>
                <br />
                <TextField
                    className="user-input"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <TextField
                    className="user-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <TextField
                    className="user-input"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <div style={{ margin: '20px' }}>
                <Button
                    style={{ margin: '7px' }}
                    variant="contained"
                    color="primary"
                    onClick={handleAuth}
                >
                    Register
                </Button>
                </div>
            </div>
        </div>
    )
}
