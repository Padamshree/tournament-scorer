import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { get } from '../utils';

import '../styles/Header.css';

const Header = (props) => {

  const history = useHistory();

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
  }
  return (
    <div className='header'>
      <h3>Tournament Scorer</h3>
      {
        props.token &&
          <div>
            <Button
              size='small'
              variant='contained'
              color='inherit'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
      }
    </div>
    );
}

export default Header;