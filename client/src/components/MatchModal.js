import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',  
};

const useStyles = makeStyles({
  title: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  blueTitle: {
    margin: '10px 10px',
    color: 'blue',
  },
  redTitle: {
    margin: '10px 10px',
    color: 'red',
  },
  modalBody: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  judgeListContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  judgeList: {
    marginTop: '-30px',
  },
  winnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winner: {
    marginTop: '-30px',
  }
});


export default function MatchModal(props) {
  const classes = useStyles();

  let allowedScorers = [];

  props.allowedJudges.map(judge => {
    allowedScorers.push(judge.name);
  });

  let judges = allowedScorers.join(', ');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <div>
      <Button 
        variant='outlined' 
        color='primary' 
        size="small"
        onClick={handleOpen}
      >
        Match Details
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={classes.title}>
            <Typography className={classes.blueTitle} variant="h6">
              {props.blueScore}
              {'  '}
              {props.blueName}
            </Typography>
            <Typography color="textSecondary" >
              vs
            </Typography>
            <Typography className={classes.redTitle} variant="h6">
              {props.redName}
              {'  '}
              {props.redScore}
            </Typography>
          </div>
          <br />
          <div className={classes.modalBody}>
            <Typography className={classes.judgeListContainer}>
              <h4 style={{ textDecoration: 'underline' }}>Judge List</h4>
              <div className={classes.judgeList}>
                {
                  allowedScorers.map(scorer => (
                    <p>{scorer}</p>
                  ))
                }
              </div>
            </Typography>
            <Typography className={classes.winnerContainer}>
              <h4 style={{ textDecoration: 'underline' }}>Winner</h4>
              <div className={classes.winner}>
                {
                  props.winner === props.blueName ? (<h5 className={classes.blueTitle}>{props.winner}</h5>) 
                  : props.winner === props.redName ? (<h5 className={classes.redTitle}>{props.winner}</h5>) 
                  : (<h5>NA</h5>)
                }
              </div>
            </Typography>
          </div>
          <Button  
                variant='outlined' 
                color='primary' 
                size="small"
                style={{ marginTop: '10px'}}
                onClick={props.viewMatch}
            >
                View Match
            </Button>
        </Box>
      </Modal>
    </div>
  );
}