import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Room from './components/Room';
import CreateRoom from './components/CreateRoom';
import Login from './components/Login';

import './styles/App.css';
import AdminRoute from './utils/adminRoutes';
import PrivateRoute from './utils/privateRoutes';
import { get, post } from './utils';
import Main from './components/Main';
import Header from './components/Header';
import Register from './components/Register';

if (localStorage.fbToken) {
    const currentTime = Date.now() / 1000;
    const expiryTime = parseFloat(localStorage.tokenExpiry);
    if (currentTime > expiryTime) {
        localStorage.clear();
    }
}
// localStorage.clear();

const socket = io();

const App = () => {

    const [token, setToken] = useState(localStorage.fbToken);
    const [userRole, setRole] = useState(localStorage.userRole);
 
    const isAuth = (token, userRole) => {
        setToken(token);
        setRole(userRole);
    }
    
    return(
        <div className='App'>
            <BrowserRouter>
                <Header
                    token={token} 
                    isAuth={isAuth}
                />
                <Switch>
                    <Route 
                        exact path='/register'
                        render={() => (
                            <Register
                                token={token}
                            />
                        )}
                    /> 
                    <Route 
                        exact path='/login'
                        render={() => (
                            <Login 
                                isAuth={isAuth}
                                token={token}
                                role={userRole}
                            />
                        )}
                    />
                    <AdminRoute 
                        exact path="/createRoom"
                        auth={token}
                        role={userRole}
                        component={CreateRoom} 
                    />
                    <PrivateRoute 
                        exact path="/"
                        auth={token}
                        component={Main} 
                    /> 
                    <PrivateRoute 
                        exact path="/room/:token"
                        auth = {token}
                        component={Room}
                        socket={socket}
                    />
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default App;