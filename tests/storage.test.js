import { savePost, getPosts, getPostById, deletePost } from '../storage.js'
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import fs from 'node:fs/promises' // pour mocker fs.unlink
import { jest } from '@jest/globals'

const dbPath = join(process.cwd(), 'posts.json')

const restoreDb = () => writeFileSync(dbPath, JSON.stringify([]))
const populateDb = (data) => writeFileSync(dbPath, JSON.stringify(data))

const fixtures = [
  { id: 1, Titre: 'Titre 1', Description: 'ouiuoui', Auteur: 'Romain', img: '1744123147428.png' },
  { id: 2, Titre: 'Titre 2', Description: 'nononon', Auteur: 'Zach', img: '1744123147428.png' }
]

const inventedId = 12345
const existingId = fixtures[0].id

describe('store', () => {
  beforeEach(() => populateDb(fixtures))
  afterAll(restoreDb)

  test('savePost ajoute un post à la base de données', async () => {
    const newPost = {
      Titre: 'Nouveau post',
      Description: 'Contenu du post',
      Auteur: 'Alice',
      Image: 'image.png'
    }

    await savePost(newPost) // ✅ important de mettre await ici

    const rawData = readFileSync(dbPath)
    const posts = JSON.parse(rawData)

    expect(posts.length).toBe(fixtures.length + 1)

    const addedPost = posts.find(p => p.Titre === 'Nouveau post')
    expect(addedPost).toBeDefined()
    expect(addedPost.Description).toBe('Contenu du post')
    expect(addedPost.Auteur).toBe('Alice')
    expect(addedPost.Image).toBe('image.png')
    expect(addedPost.id).toBeDefined()
  })

  test('getPosts retourne les posts sauvegardés', async () => {
    const posts = await getPosts()

    expect(posts).toBeDefined()
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBe(fixtures.length)
    expect(posts[0].Auteur).toBe('Romain')
    expect(posts[1].Auteur).toBe('Zach')
  })

  test('getPosts retourne null si le fichier est introuvable', async () => {
    unlinkSync(dbPath) // ✅ supprime vraiment le fichier

    const posts = await getPosts()

    expect(posts).toBeNull()
  })

  test('deletePost supprime le post et le fichier image', async () => {
    // Mock de fs.unlink pour éviter une vraie suppression
    const unlinkMock = jest.spyOn(fs, 'unlink').mockImplementation(async () => {})

    const result = await deletePost(existingId)

    expect(result).toBe(true)

    const updatedPosts = JSON.parse(readFileSync(dbPath, 'utf8'))
    const deletedPost = updatedPosts.find(p => p.id === existingId)

    expect(deletedPost).toBeUndefined()
    expect(unlinkMock).toHaveBeenCalledWith(`./fichiers/${fixtures[0].img}`)

    unlinkMock.mockRestore()
  })

  test('deletePost retourne false si l’ID n’existe pas', async () => {
    const result = await deletePost(inventedId)
    expect(result).toBe(false)
  })

  test('getPostById retourne le post correspondant à l’ID', async () => {
    const post = await getPostById(existingId)

    expect(post).toBeDefined()
    expect(post.id).toBe(existingId)
    expect(post.Titre).toBe('Titre 1')
    expect(post.Auteur).toBe('Romain')
  })

  test('getPostById retourne null si l’ID est introuvable', async () => {
    const post = await getPostById(inventedId)

    expect(post).toBeNull()
  })
})
