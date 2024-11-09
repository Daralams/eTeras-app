// Middleware Authentication
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const auth = async () => {
  try {
    const requestToken = await axios.get("http://localhost:3000/token");
    const decodeToken = jwtDecode(requestToken.data[1].RefreshToken);
    const userId = decodeToken.userId;
    const usernameIsLoggin = decodeToken.userName;

    return {
      accessToken: requestToken.data[0].accessToken,
      userId,
      usernameIsLoggin,
    };
  } catch (error) {
    console.error(`[client error] an error occurred: ${error}`);
  }
};
