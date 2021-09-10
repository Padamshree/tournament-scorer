const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(server);
const { db, auth }  = require('./config/firebase');
const {  verifyToken } = require('./config/fbAuth');

const port = process.env.PORT || 5000;

io.on('connection', (socket) => {

    console.log(`${socket.id} connected with you!`);

    socket.emit('gossip', {message: `Your socket id ${socket.id}`});
    
    socket.on('updateScore', (data) => {
        
        let winner = '';

        const {
            blueName,
            redName,
            blueScore, 
            redScore, 
            email, 
            token,
            scoreArray } = data;

        if ((blueScore+redScore) === 5) {
            winner = (blueScore > redScore) 
            ? blueName : redName;
        }
        
        const updateData = {
            winner,
            redScore,
            blueScore,
            scorers: scoreArray
        };

        // console.log('UPDATED DATA', updateData);
        if ((blueScore + redScore) <= 5) {
            db.collection('scores').doc(token).update(updateData)
            .then(() => {
                return db.collection('scores').doc(token).get()
                .then((res) => {
                    console.log('GET DATA', res.data().scorers);
                    const fetchedData = {
                        blueScore: res.data().blueScore,
                        redScore: res.data().redScore,
                        scorers: res.data().scorers,
                    }
                    io.sockets.emit('score', fetchedData);
                })
            })
            .catch(err => console.log('Data not updated', err));    
        } else {
            console.log('Match Over');
        }
    });

});

//Middlewares
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.get('/bello', (req, res) => {
    res.send(JSON.stringify({greeting: 'hello'}));
});

app.post('/createRoom', verifyToken, (req, res) => {
    const { blueName, redName } = req.body;
    const roomSchema = {
        blueName,
        redName,
        blueScore: 0,
        redScore: 0,
        winner: '',
        scorers: [],
    }
    db.collection('scores').add(roomSchema)
    .then(response => {
        console.log(response.id);
        res.status(200).json({
            message: "Success! Room created",
            room: response.id,
            success: true,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            message: "Failed to create Room",
            room: "",
            success: false,
        });
    })
});

app.get('/initData', (req, res) => {
    const url = new URL(`https://notarandomsite.com/${req.originalUrl}`);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    db.collection('scores').doc(token).get()
        .then(response => {
            console.log('GOT DATA', response.data())

            res.status(200).json({
                message: 'Room exists',
                data: response.data(),
            });
        })
        .catch(err => {
            console.log('DATA GET ERROR', err); 
            res.status(200).json({
                message: 'No room exists',
                data: err,
            });
        })
});

app.get('/get_users', async (req, res) => {
    let userList = [];

    const users = await db.collection('users').get()

    users.docs.map(doc => {
        userList.push({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
        });
    });

    if (userList.length) {
        res.status(200).json({
            success: true,  
            userList,
        });
    } else {
        res.status(200).json({
            success: false,  
            userList,
        });
    }

    // db.collection('users').get()
    // .then(response => {
    //     response.docs.map(doc => {
    //         user_list.push({
    //             id: doc.id,
    //             name: doc.data().name,
    //             email: doc.data().email,
    //         });
    //     })
    // })
})

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    auth
    .signInWithEmailAndPassword(email, password)
    .then(async () => {
        let userRole = '';
        let email = '';
        const user = auth.currentUser;
        console.log(user);
        const loggedUser = await db.collection('users').doc(user.uid).get()
        
        userRole = loggedUser.data().role;
        email = loggedUser.data().email;

        user.getIdToken(true)
        .then((idToken) => {
            console.log('Sending Token')
            res.send({
                success: true,  
                token: idToken, 
                role: userRole,
                email: email
                
            });
            res.end();
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            success: false,
            role: null,
            token: null,
            message: err,
            email: null,
        });
    })
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log(name);
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
        result.user.updateProfile({
            displayName: name,
        }).then(() => console.log('Name Updated'))
        .catch((err) => console.log('Error', err));

        const user = result.user;
        console.log(user);
        db.collection('users').doc(user.uid).set({
            name,
            email,
            role: 'user',
        });

        res.status(200).json({
            success: true,
            user: name,
            email: email,
        });
    })
    .catch((error) => {
        console.log(error);

        res.status(200).json({
            success: false,
            error,
            user: '',
            email: '',
        });
    })
})

app.get('/logout', (req, res) => {
    auth.signOut()
    .then(() => {
        console.log('Logged Out');
        res.send({message: 'Logged out'});
        res.end();
    })
    .catch(error => {
        console.log(error);
        res.send({message: 'Logout Failed'})
        res.end();
    });
});

// app.get('/sayBello', verifyToken, (req, res) => {
//     console.log('This is today you are verified');
//     res.send({message: 'Kindly proceed.'});
//     res.end();
// })

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    });
}

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));