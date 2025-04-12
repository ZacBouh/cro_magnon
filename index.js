import { config } from 'dotenv'
config()
const {app} = await import('./routes.js')
const { init : storageInit } =  await import('./storage.js')
await storageInit()

const port = 3000
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`)
})
