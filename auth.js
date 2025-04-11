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
