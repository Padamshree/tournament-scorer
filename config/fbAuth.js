const { admin, auth, db } = require('./firebase');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    let user = auth.currentUser;
    if (user) {
        admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            if (decodedToken.uid === user.uid) {
                req.user = user.uid;
                return next()
            }
        })
        .catch((error) => {
            console.log('Failed to verify user.')
        })
    } else {
        console.log('No such user exists');
    }
};