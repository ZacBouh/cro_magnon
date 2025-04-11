import jwt from "jsonwebtoken";

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

export const authMiddleware = (req, res, next) => { 
    if (!req.headers.has('Authorization')) res.redirect('/login')
    const token = req.headers.get('Authorization').split(' ')[1]
    console.log("[MIDDLEWARE] Request with JWT in headers : ", token)
    try  {
        const user = validateJwt(token)
        next()   
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError ) {
            console.log("[MIDDLEWARE] Invalid token")
            res.redirect('login')
            return 
        }
        throw error
    }
}