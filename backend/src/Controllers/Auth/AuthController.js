import { Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../../Models/UsersModel.js";

export const register = async (req, res) => {
  try {
    const input = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPw: req.body.confirmPw,
    };

    const unique_email = await Users.findOne({
      where: { email: req.body.email },
    });
    const unique_username = await Users.findOne({
      where: { username: req.body.username },
    });
    if (unique_email)
      return res.status(400).json({
        status: "failed",
        msg: `Email ${req.body.email} already registered, please use other email!`,
      });
    if (unique_username)
      return res.status(400).json({
        status: "failed",
        msg: `Username ${req.body.username} already registered, please use other username!`,
      });
    if (input.password.length <= 8)
      return res.status(400).json({
        status: "failed",
        msg: "Password must be more than 8 characters!",
      });
    if (input.confirmPw != input.password)
      return res.status(400).json({
        status: "failed",
        msg: "Confirmation password must be match the password!",
      });

    //Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const hashedConfirmPw = await bcrypt.hash(input.confirmPw, 10);
    //store user in db
    const request = await Users.create({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      confirmPw: hashedConfirmPw,
    });
    res.status(201).json({ msg: "Register successfully, please login!" });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.body.email },
    });
    if (!user)
      return res.status(404).json({
        status: "failed",
        msg: "Login failed, Email or Password Wrong or not registered!",
      });

    const matchPw = await bcrypt.compareSync(req.body.password, user.password);
    if (!matchPw)
      return res.status(404).json({
        status: "failed",
        msg: "Login failed, Email or Password Wrong or not registered!",
      });

    const userId = user.id;
    const userName = user.username;
    const userEmail = user.email;
    const registerAt = user.createdAt;

    const accessToken = jwt.sign(
      { userId, userName, userEmail },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { userId, userName, userEmail, registerAt },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    //update field refresh token
    await user.update(
      { refresh_token: refreshToken },
      {
        where: { id: userId },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });
    res.json({ accessToken });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};

export const logout = async (req, res) => {
  try {
    // 1. tangkap request header cookie(refreshToken)
    const refreshToken = req.cookies.refreshToken;
    // 2. jika tidak ada cookie kirim status 204 (no content)
    if (!refreshToken) return res.sendStatus(204);
    // 3. jika ada refreshToken di cookie, cocokkan dengan refresh token pada db
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    // 4. jika tidak cocok kirim status 204
    if (!user) return res.sendStatus(204);
    //5. update field db refreshToken menjadi null
    const userId = user.id;
    await Users.update(
      { refresh_token: null },
      {
        where: { id: userId },
      }
    );
    // 6. hapus refreshToken dari cookie
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
  }
};
