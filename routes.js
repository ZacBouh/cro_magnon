import express from 'express'
import multer from 'multer'
import path from 'path'
import { savePost, getPosts, getPostById, deletePost } from './storage.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use('/fichiers', express.static('fichiers'))
app.use('/public', express.static('public'))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'fichiers/')
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

// Routes
app.get('/', async (req, res) => {
  const articles = await getPosts()
  console.log('Response articles : ')
  console.dir(articles)
  res.render('list-article', { articles })
})

app.get('/create', (req, res) => {
  res.render('create-form')
})

app.post('/articles/:id/update', upload.single('fichier'), async (req, res) => {
  console.log("Request body : ", req.body)
  if(req?.file) req.body['img'] = req.file.filename;  
  req.body['id'] = req.params.id
  await savePost(req.body) 
  res.redirect('/');
});

app.get('/articles/:id/edit', async (req, res) => {
  const postId = req.params.id
  if (!postId) res.redirect('/')

  const article = await getPostById(postId)
  if (!article) res.redirect('/')

  res.render('update-form', { article })
})

app.post('/articles/:id', async (req, res) => {
  const postId = req.params.id
  if (!postId) res.redirect('/')
  const method = req.query._method

  if (method === 'DELETE') {
    const result = await deletePost(postId)
  }
  res.redirect('/')
})

app.post('/submit', upload.single('fichier'), async (req, res) => {
  let articles = null

  try {
    if (req?.file) req.body.img = req.file.filename
    console.log('Saving post : ', req.body)
    await savePost(req.body)
    articles = await getPosts()
  } catch (err) {
    console.log('Failed to save post : ', err)
    res.render('list-article')
  }

  res.render('list-article', {
    articles
  })
})

export { app }
