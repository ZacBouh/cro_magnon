import { savePost, getPosts, getPostById} from '../storage.js'
import { writeFileSync, readFileSync } from 'node:fs' 
import { join } from 'node:path'
const dbPath = join(process.cwd(), 'post.json')
const restoreDb = () => writeFileSync(dbPath, JSON.stringify([]))
const populateDb = (data) => writeFileSync(dbPath, JSON.stringify(data))
const fixtures = 
[
    { id: 1, Titre: 'Titre 1', Description: 'ouiuoui', Auteur: 'Romain', Image: '1744123147428.png' },
    { id: 2, Titre: 'Titre 2', Description: 'nononon', Auteur: 'Zach', Image: '1744123147428.png' }
]
const inventedId = 12345
const existingId = fixtures[0].id
describe('store', () => {
  beforeEach(() => populateDb(fixtures))
  afterAll(restoreDb)

  test('savePost ajoute un post à la base de données', () => {
    const newPost = {
      Titre: 'Nouveau post',
      Description: 'Contenu du post',
      Auteur: 'Alice',
      Image: 'image.png'
    }
  
    savePost(newPost)
  
    const rawData = readFileSync(dbPath)
    const posts = JSON.parse(rawData)
  
    expect(posts.length).toBe(fixtures.length + 1)
  
    const addedPost = posts.find(p => p.Titre === 'Nouveau post')
    expect(addedPost).toBeDefined()//post
    expect(addedPost.Description).toBe('Contenu du post')//description
    expect(addedPost.Auteur).toBe('Alice') //auteur
    expect(addedPost.Image).toBe('image.png') //image
    expect(addedPost.id).toBeDefined() //id
  })
})
