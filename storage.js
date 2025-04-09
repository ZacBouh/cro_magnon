import { randomUUID } from 'crypto';
import fs from 'fs';

export const savePost = (post) => {
    let posts = getPosts()

    if (!posts){
        posts = []
    }
    post['id'] = randomUUID() 
    posts.push(post)
    
    const data = JSON.stringify(posts)
    fs.writeFile('posts.json', data, (err) => {
        console.error(`failed to save post : \n${err}`)
    })
    return 
}

export const getPosts = () => {
    let posts = null
    fs.readFile('posts.json', 'utf8', (err, rawPosts)=>{
        if(err){
            console.error(`Error retrieving posts : \n${err}`)
        }
        try {
            posts = JSON.parse(rawPosts)
        } catch (err) {
            console.error(`Error parsing saved posts : \n${err}`)
        }       
    })

    return posts
}

const deletePost = (postId) => {

}

const getPostById = (postId) => {

}
