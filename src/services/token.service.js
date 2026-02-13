import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'

export const generateAccessToken = function (userId, fullName) {
    return jwt.sign(
        {
            id: userId,
            // email: email,
            userName: fullName,
            // fullName: fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
export const generateRefreshToken = function (userId) {
    return jwt.sign(
        {
            id: userId,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
} 