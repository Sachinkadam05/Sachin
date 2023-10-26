
// Question 1 : 

const admin = require('firebase-admin');

const serviceAccount = require('path/to/your/serviceAccountKey.json'); // You can download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  admin.auth().createUser({
    email,
    password,
  })
  .then((userRecord) => {
    // User registered successfully
    res.status(201).json(userRecord);
  })
  .catch((error) => {
    res.status(400).json({ error: error.message });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});




app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    admin.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      // User logged in successfully
      res.status(200).json({ message: 'Login successful', user });
    })
    .catch((error) => {
      res.status(401).json({ error: error.message });
    });
  });
  




  function isAuthenticated(req, res, next) {
    const idToken = req.headers.authorization;
    admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch(() => {
      res.status(401).json({ error: 'Unauthorized' });
    });
  }
  
  app.get('/protected-route', isAuthenticated, (req, res) => {
    // This route is protected and can only be accessed by authenticated users
    res.status(200).json({ message: 'Access granted' });
  });
  