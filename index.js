import { app } from './routes.js'

const port = 3000
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`)
})
