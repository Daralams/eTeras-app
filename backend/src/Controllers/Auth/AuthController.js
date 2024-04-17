import {Sequelize} from 'sequelize'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Users from '../../Models/UsersModel.js'

export const register = async (req, res) => {
  try {
    const input = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPw: req.body.confirmPw
    }
    
    const check = await Users.findOne({where: {email: req.body.email} })
    
    if(check) return res.status(400).json({msg: "Email has registered!"})
    if(input.password.length <= 8) return res.status(400).json({msg: "Password must be more than 8 characters!"})
    if(input.confirmPw != input.password) return res.status(400).json({msg: "Confirmation password must be match the password!"})
    
    //Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const hashedConfirmPw = await bcrypt.hash(input.confirmPw, 10);
    //store user in db 
    const request = await Users.create({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      confirmPw: hashedConfirmPw
    })
    res.status(201).json({msg: 'Register successfully, please login!'})
  } catch (error) {
    console.error(error.message)
  }
}

export const login = async (req, res) => {
  try {
    const user = await Users.findOne({where: {username: req.body.username} })
    if(!user) return res.status(404).json({msg: 'Login failed, Username / Password Wrong!'})
    
    const matchPw = await bcrypt.compareSync(req.body.password, user.password)
    if(!matchPw) return res.status(404).json({msg: 'Login failed, Username / Password Wrong!'})
    
    const userId = user.id
    const userName = user.username
    const userEmail = user.email
    const registerAt = user.createdAt
      
    const accessToken = jwt.sign({userId, userName, userEmail}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '60s'
      })
    const refreshToken = jwt.sign({userId, userName, userEmail, registerAt}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
      })
    //update field refresh token
    await user.update({refresh_token: refreshToken}, {
      where: {id: userId}
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    // console.log('Refresh token: ', refreshToken)
    // console.log('Access token: ', accessToken)
    console.log('Cookies: ', res.getHeaders()['set-cookie'])
    // console.log(res.cookie)
    res.json({accessToken})
  } catch (error) {
    console.error(error.message)
  }
}

export const logout = async (req, res) => {
  try {
    // 1. tangkap request header cookie(refreshToken) 
    const refreshToken = req.cookies.refreshToken
    // 2. jika tidak ada cookie kirim status 204 (no content)
    if(!refreshToken) return res.sendStatus(204)
    // 3. jika ada refreshToken di cookie, cocokkan dengan refresh token pada db 
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken
      }
    })
    // 4. jika tidak cocok kirim status 204
    if(!user) return res.sendStatus(204)
    //5. update field db refreshToken menjadi null
    const userId = user.id
    await Users.update({refresh_token: null}, {
      where: {id: userId}
    })
    // 6. hapus refreshToken dari cookie
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
  } catch (error) {
    console.log(error.message)
  }
}