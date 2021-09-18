import React, { useState } from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
// import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    red: {
      background: 'red',
    },
    green: {
      backgroundColor: 'green',
    },
});

export default function Popup(props) {
    const [open, setOpen] = useState(props.open);
    const classes = useStyles();

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        props.handlePopup();
    };

    return (
        <div>
            {
                open && (
                    <Snackbar
                        ContentProps={{
                            classes: {
                            root: props.success === true ? classes.green : classes.red,
                            },
                        }}
                        open={open}
                        autoHideDuration={3000}
                        onClose={handleClose}
                        message={props.message}
                        action={(
                            <div>
                                <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={handleClose}
                                >
                                    X
                                </IconButton>
                            </div>
                        )}
                    />
                )
            }
        </div>   
    );
}