import Users from '../Models/UsersModel.js'
import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  //tampung nilai dari request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  // jika user tidak mengirimkan token
  if(token == null) return res.sendStatus(401)
  // jika user mengirim token, verifikasi
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if(err) return res.sendStatus(403)
    req.email = decoded.email 
    next()
  })
}