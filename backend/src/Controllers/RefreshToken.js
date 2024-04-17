import Users from '../Models/UsersModel.js'
import jwt from 'jsonwebtoken'

export const refreshToken = async (req, res) => {
  try {
    const RefreshToken = req.cookies.refreshToken
    // console.log(req.cookies)
    // console.log(RefreshToken)
    if(!RefreshToken) {
      console.log('Failed with status : 401')
      return res.sendStatus(401)
    }
    
    const user = await Users.findOne({
      where: {
        refresh_token: RefreshToken
      }
    })
    if(!user) {
      console.log('Failed with status : 403')
      return res.sendStatus(403)
    }
    jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if(err) return res.sendStatus(403)
      const userId = user.id
      const userName = user.username
      const userEmail = user.email
      const registerAt = user.createdAt
      
      const accessToken = jwt.sign({userId, userName, userEmail, registerAt}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '60s'
      })
      res.json([{accessToken}, {RefreshToken}])
      // return res.json({RefreshToken})
      console.log('\x1b[36m%s\x1b[0m', 'Success bro!');
    })
  } catch (error) {
    console.error(error.message)
  }
}