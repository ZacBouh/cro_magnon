import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import bcrypt from 'bcrypt'

export const init = async () => {
  console.log("[Storage] Initialization")
  try {

    await fs.access('posts.json', fs.constants.F_OK) 
    console.log("[Storage] Existing posts.json found")
  } catch (err) {
    console.log("[Storage] Creating posts.json")
    fs.writeFile('posts.json', '[]')
  }

  try {
    await fs.access('users.json', fs.constants.F_OK) 
    console.log("[Storage] Existing users.json found")
  } catch (err) {
    console.log("[Storage] Creating users.json")
    fs.writeFile('users.json', '[]')
  }
}

export const savePost = async (post) => {
  let posts = await getPosts()

  if (!posts) {
    posts = []
  }

  if (!post.id) {
    post.id = randomUUID()
  } else {
    posts = posts.filter((item) => item.id !== post.id)
    if (!post?.img) {
      const previousState = await getPostById(post.id)
      post.img = previousState?.img
    }
  }
  posts.push(post)

  const data = JSON.stringify(posts)
  await fs.writeFile('posts.json', data, (err) => {
    console.error(`failed to save post : \n${err}`)
  })
  return post
}

export const getPosts = async () => {
  let posts = null
  console.log('Retrieving stored posts')
  try {
    const rawData = await fs.readFile('posts.json', 'utf8')
    posts = JSON.parse(rawData)
  } catch (err) {
    console.log('Error reading post data from file : \n', err)
  }
  console.log('Retrieved saved posts data : ', posts.length, ' posts')
  return posts
}

export const deletePost = async (postId) => {
  try {
    const posts = await getPosts()
    if (!posts) {
      console.log('Error: no saved post found')
      return false
    }
    const post = await getPostById(postId)
    if (!post) {
      console.log('No file with ID ', postId, ' to delete')
      return false
    }

    const newPostsState = posts.filter((post) => post.id != postId)
    await fs.writeFile('posts.json', JSON.stringify(newPostsState), 'utf8')
    await fs.unlink(`./fichiers/${post.img}`)

    return true
  } catch (err) {
    console.log('Error trying to delete post : ', err)
    return false
  }
}

export const getPostById = async (postId) => {
  const posts = await getPosts()
  if (!posts) {
    console.log('Error: no saved post found')
    return null
  }

  const post = posts.filter((post) => post.id == postId)[0]
  if (!post) {
    console.log('No post found with ID ', postId)
    return null
  }
  return post
}

export const saveUser = async (user) => {
  let users = await getUsers()

  if (!users) {
    users = []
  }

  if (!user.id) {
    user.id = randomUUID()
  } else {
    users = users.filter((item) => item.id !== user.id)
  }

  if (user.password) {
    const saltRounds = 10
    user.password = await bcrypt.hash(user.password, saltRounds)
  }

  users.push(user)

  const data = JSON.stringify(users, null, 2)
  await fs.writeFile('users.json', data).catch(err => {
    console.error(`failed to save user : \n${err}`)
  })

  return user
}

export const getUsers = async () => {
  let users = null
  console.log('Retrieving stored users')
  try {
    const rawData = await fs.readFile('users.json', 'utf8')
    users = JSON.parse(rawData)
  } catch (err) {
    console.log('Error reading user data from file : \n', err)
  }
  console.log('Retrieved saved users data : ', users.length, ' users')
  return users
}

export const getUsersById = async (userId) => {
  const users = await getUsers()
  if (!users) {
    console.log('Error: no saved user found')
    return null
  }

  const user = users.filter((user) => user.id == userId)[0]
  if (!user) {
    console.log('No user found with ID ', userId)
    return null
  }
  return user
}

export const getUsersByEmail = async (userEmail) => {
  const users = await getUsers()
  if (!users) {
    console.log('Error: no saved user found')
    return null
  }

  const user = users.filter((user) =>{ 
    return user.email == userEmail
  })[0]
  if (!user) {
    console.log('No user found with Email ', userEmail)
    return null
  }
  return user
}
