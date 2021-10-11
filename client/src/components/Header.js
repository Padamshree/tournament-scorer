import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { get } from '../utils';

import '../styles/Header.css';

const Header = (props) => {

  const history = useHistory();
  const role = localStorage.userRole;

  const handleLogout = () => {

    get('/logout')
    .then(res => res.json())
    .then(res => {
      console.log('Logged out.');
      localStorage.clear();
      props.isAuth(null);
      history.push('/login');
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className='header'>
      <h3 onClick={() => history.push('/')}>Tournament Scorer</h3>
      {
        props.token &&
          <div className="auth-routes">
            { role && role === 'admin'
              &&
              <div>
                <h4 onClick={() => history.push('createRoom')}>
                Create New Match
              </h4>
              </div>
            }
            <div>
              <Button
                size='small'
                variant='contained'
                color='primary'
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
      }
    </div>
    );
}

export default Header;