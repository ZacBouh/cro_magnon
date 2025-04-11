import { config } from 'dotenv'
config()
const {app} = await import('./routes.js')

const port = 3000
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`)
})
