const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const {db} = require('./util/admin');

const cors = require('cors');
app.use(cors());

const {
    getAllUsers,
    getUser,
    postOneUser,
    updateUserDetails,
    updateUserStatus,
    updateUserPresence,
    deleteUser,
    signup,
    login} = require('./handlers/users');
const {
    getAllStatuses,
    getStatus,
    postOneStatus,
    updateStatus,
    deleteStatus} = require('./handlers/statuses');

exports.api = functions.https.onRequest(app);

// User routes
app.get('/users', getAllUsers);
app.get('/user/:userId', getUser)
app.post('/user', FBAuth, postOneUser);
//app.post('/user/:userId', FBAuth, updateUserDetails);
app.post('/user/status/:userId', FBAuth, updateUserStatus);
app.post('/user/presence/:userId', FBAuth, updateUserPresence);
app.delete('/user/:userId', FBAuth, deleteUser); 

// Status routes
app.get('/statuses', getAllStatuses);
app.get('/status/:statusId', getStatus);
app.post('/status', FBAuth, postOneStatus);
app.post('/status/:statusId', FBAuth, updateStatus);
app.delete('/status/:statusId', FBAuth, deleteStatus);

// Signup and login routes
app.post('/signup', signup);
app.post('/login', login);

/* // Delete a user's status upon user deletion
exports.onUserDelete = functions
.region('us-central1')
.firestore.document('/users/{userId}')
.onDelete((snapshot, context) => {
    const userId = context.params.userId;
    const batch = db.batch();
    return db
    .collection('statuses')
    .where('user', '==', userId)
    .get()
    .then((data) => {
        data.forEach((doc) => {
            batch.delete(db.doc(`/statuses/${doc.id}`));
        });
        return batch.commit();
    })
    .catch((err) => console.error(err));
});

// Create empty status upon user creation
exports.onUserCreate = functions
.region('us-central1')
.firestore.document('/users/{userId}')
.onCreate((snapshot, context) => {
    const userId = context.params.userId;
    const newStatus = {
        description: null,
        descriptionDate: new Date().toISOString(),
        present: true,
        user: userId
    };
    
    return db
    .collection('statuses')
    .add(newStatus)
    .then((doc) => {
        doc.set({statusId: doc.id}, {merge: true});
    })
    .catch((err) => console.error(err));
});
 */