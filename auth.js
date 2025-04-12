import jwt from "jsonwebtoken";
import pkg from 'jsonwebtoken';
import { getUsersByEmail } from "./storage.js";
import bcrypt from 'bcrypt';
const { JsonWebTokenError } = pkg;

const secret = process.env.JWT_KEY

export const getJwt = (user) => {
    const token = jwt.sign(user, secret, { expiresIn: "10h" })
    console.log("Generated JWT : ", token)
    return token
}

export const validateJwt = (token) => {
    const user = jwt.verify(token, secret) 
    console.log("Valid JWT for user : ", user)
    return user
}

export const authMiddleware = (req , res, next) => { 
    console.log("[AUTH MIDDLEWARE] Checking request on ", req.url)
    if (!req?.session || !req.session['jwt']){
        res.redirect('/login')
        return
    } 
    const token = req.session['jwt']
    console.log("[AUTH MIDDLEWARE] Request with JWT in headers : ", token)
    try  {
        const user = validateJwt(token)
        next()   
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError ) {
            console.log("[AUTH MIDDLEWARE] Invalid token")
            res.redirect('/login')
            return 
        }
        throw error
    }
}

export const csrfMiddleware = (req, res, next) => {
    if (!req.headers['authorization']){
        res.redirect('/login')
        return
    } 
    const token = req.headers['authorization'].split(' ')[1]
    console.log("[CSRF MIDDLEWARE] Request with CSRF JWT in headers : ", token)
    try  {
        const user = validateJwt(token)
        next()   
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError ) {
            console.log("[CSRF MIDDLEWARE] Invalid CSRF token")
            res.redirect('/login')
            return 
        }
        throw error
    }   
}

export const login = async (email, password) => {
  const user = await getUsersByEmail(email)

  if (!user) {
    console.log('Login failed: user not found')
    return { success: false, message: 'Utilisateur non trouvé' }
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    console.log('Login failed: incorrect password')
    return { success: false, message: 'Mot de passe incorrect' }
  }

  console.log('Login successful')
  return { success: true, user }
}
