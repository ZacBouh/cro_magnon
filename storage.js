import { randomUUID } from 'crypto';
import fs from 'fs/promises';

export const savePost = async  (post) => {
    let posts = await getPosts()

    if (!posts){
        posts = []
    }
    post['id'] = randomUUID() 
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
    console.log('Retrieved saved posts data : \n', posts)
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
        await fs.writeFile('posts.json', JSON.stringify(newPostsState),'utf8')
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
