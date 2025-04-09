import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { savePost, getPosts } from './storage.js' 

const app = express();
const port = 80;


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/fichiers', express.static('fichiers'));

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
  res.render('list-article', {articles: null});
});

app.get('/create', (req, res) => {
  res.render('create-form');
});

app.get('/update', (req, res) => {
  res.render('update-form', {});
});


app.post('/submit', upload.single('fichier'), (req, res) => {
  
  try {

    console.log('Saving post : ', req.body)
    savePost(req.body)
    articles = getPosts()
  } catch(err) {
    console.log('Failed to save post : ', err)
    res.render('list-article')
  }

  res.render('list-article', {
    articles,
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
