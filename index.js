const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 80;
const fs = require('fs');
import { savePost } from './storage';

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/fichiers', express.static('fichiers'));
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'fichiers/');
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.render('list-article');
});

app.get('/create', (req, res) => {
  res.render('create-form');
});

app.get('/update', (req, res) => {
  res.render('update-form');
});


app.post('/submit', upload.single('fichier'), (req, res) => {
  const nom = req.body.nom;
  const email = req.body.email;
  const fichier = req.file ? req.file.filename : null;

  

  try {
    savePost(req.body)
  } catch(err) {
    res.render('display')
  }

  res.render('display', {
    nom,
    email,
    fichier
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
