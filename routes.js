import express from 'express'
import session from 'express-session'
import multer from 'multer'
import path from 'path'
import { savePost, getPosts, getPostById, deletePost, login, saveUser, getUserByEmail, getUsersByEmail, saveUser } from './storage.js'
import { getJwt } from './auth.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use('/fichiers', express.static('fichiers'))
app.use('/public', express.static('public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
   cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: false
   }
}))

app.use((req, res, next) => {
  res.locals.token = req.session && req.session.jwt || null; // ou req.user.token, ou autre
  next();
});

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


app.post('/login', upload.none(), async (req, res) => {
  console.log("POST on /login")
  const { success, ...payload } = await login(req.body.email, req.body.password)
  if (!success) {
    res.render('login', {
      error
    })
    return
  }
  
  console.log("Payload ", payload)
  req.session.jwt = getJwt(payload.user)  
  res.redirect('/')
})


app.get('/login', async (req, res) => {
  console.log('request on /login')
  res.render('login')
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

//Users
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', upload.none(), async (req, res) => {
  console.log("Request body : ", req.body)

  const { email, password } = req.body
  const existingUser = await getUsersByEmail(email)

  if (existingUser) {
    console.log('Email déjà utilisé')
    res.status(500).json({error: "Cet email est déjà enregistré."})
  }

  const newUser = { email, password }

  try {
    await saveUser(newUser)
    console.log('Utilisateur enregistré avec succès')
    res.redirect('/login') 
  } catch (err) {
    res.status(500).json({error: "Erreur lors de l'inscription"})
  }
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const result = await login(email, password)

  if (!result.success) {
    return  res.status(500).json({error: "Erreur d'identifiant"})
  }

  console.log("Utilisateur connecté :", result.user)

  res.redirect('/')
})

export { app }
