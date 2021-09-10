import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 200,
  },
  title: {
    textAlign: 'center',
    fontSize: 80,
    color: 'white'
  },
});

export default function OutlinedCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card 
        className={classes.root}
        style={{ background: `${props.color}` }}
        variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" >
          {props.score}
        </Typography>
      </CardContent>
    </Card>
  );
}
