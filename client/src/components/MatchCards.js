import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';

import MatchModal from './MatchModal';

const useStyles = makeStyles({
  root: {
    width: 300,
    textAlign: 'center'
  },
  redTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  blueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-around',
  }
});

export default function MatchCard(props) {
  const classes = useStyles();
  const history = useHistory();

  const openMatch = () => {
    const matchURL =  '/room/' + props.matchId;
    history.push(matchURL);
}

  return (
    <Card 
        className={classes.root}
        variant="outlined">
      <CardContent>
        <Typography className={classes.blueTitle} variant="h5" >
          {props.blueName}
        </Typography>
        <Typography color="textSecondary" >
          vs
        </Typography>
        <Typography className={classes.redTitle} variant="h5" >
          {props.redName}
        </Typography>
        <br />
        <Typography variant="body2" component="p">
          Match Result
          <br />
          {
              props.winner ? 
              (
                <Typography color="textSecondary" >
                    {props.winner}
                </Typography>
              ) : (
                <Typography color="textSecondary" >
                    NA
                </Typography>
              )
          }
        </Typography>
        <br />
        <div className={classes.controls}>
            <MatchModal 
                {...props}
                viewMatch={openMatch}
            />
            <Button  
                variant='outlined' 
                color='primary' 
                size="small"
                onClick={openMatch}
            >
                View Match
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}