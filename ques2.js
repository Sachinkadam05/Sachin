// Question 2 :

// code for initializing firebase :

const admin = require('firebase-admin');

const serviceAccount = require('path/to/your/serviceAccountKey.json'); // You can download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

const db = admin.firestore();

// code for defining API routes :

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Create a new note
app.post('/notes', (req, res) => {
  const newNote = req.body;
  db.collection('notes').add(newNote)
    .then((docRef) => {
      res.status(201).json({ message: 'Note added', id: docRef.id });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Retrieve all notes
app.get('/notes', (req, res) => {
  db.collection('notes').get()
    .then((snapshot) => {
      const notes = [];
      snapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(notes);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Retrieve a specific note
app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.collection('notes').doc(noteId).get()
    .then((doc) => {
      if (doc.exists) {
        res.status(200).json({ id: doc.id, ...doc.data() });
      } else {
        res.status(404).json({ message: 'Note not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Update a note
app.put('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const updatedNote = req.body;
  db.collection('notes').doc(noteId).update(updatedNote)
    .then(() => {
      res.status(200).json({ message: 'Note updated' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.collection('notes').doc(noteId).delete()
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

