import React, { useState, useEffect } from 'react';
import  { useHistory } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import { post, get } from '../utils';
import Popup from './Popup';

import '../styles/Login.css';

export default function Login(props) {
    let history = useHistory();

    const [email, setEmail]= useState('');
    const [password, setPassword] = useState('');

    const [togglePopup, setTogglePopup] = useState({ message: '', success: false });

    useEffect(() => {
        if (props.token) {
            console.log('Bello');
            history.push('/');
        } else {
            history.push('/login');
            props.isAuth(null);
        }
    }, [props.token]);

    const handleAuth = (e) => {
        e.preventDefault();

        post('/signin', { email, password })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.success) {
                const toggleOpen = {
                    message: res.message,
                    success: res.success,
                }
                setTogglePopup(toggleOpen);
                const expiryTime = (Date.now() / 1000) + 3600;
                localStorage.setItem('tokenExpiry', expiryTime); 
                localStorage.setItem('fbToken', res.token);
                localStorage.setItem('userRole', res.role);
                localStorage.setItem('email', res.email);
                props.isAuth(res.token, res.role);
            } else {
                const toggleOpen = {
                    message: 'Username or Passwords do not Match',
                    success: res.success,
                }
                setTogglePopup(toggleOpen);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const closePopup = () => {
        setTogglePopup({ message: '', success: false });
    }

    return (
        <div className='container'>
            <div className='outlined-box'>
                <h3 className='box-header'>Login</h3>
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
                    Signin
                </Button>
                </div>
            </div>
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
