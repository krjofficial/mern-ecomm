import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "../lib/redis.js"

dotenv.config({ path: "../../.env"});



// Access Tokens and Refresh Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET,  { // generates access token using userid and value of access token key
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { // generates refresh token using userid and value of refresh token key
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };

}

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60); // 7 days in seconds 
}

// Cookies 
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevents xss attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === "production", // true for https
    sameSite:"strict", // prevents CSFR attacks, cross site forgery atacks
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevents xss attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === "production", // true for https
    sameSite:"strict", // prevents CSFR attacks, cross site forgery atacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

// Signup
export const signup = async (req, res) => {
  const { email, password, name } = req.body

  try {
    const userExists = await User.findOne({ email });

  if(userExists){
    return res.status(400).json({ message: "User already exists" });
  }
  const user = await User.create({ email, password, name });


  //authenticate
  const { accessToken, refreshToken } = generateTokens(user._id);
  await storeRefreshToken(user._id, refreshToken); // store refresh token in redis
  setCookies(res, accessToken, refreshToken);


  res.status(201).json({ user: {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }, message: "User created successfully" });
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({ message: error.message });
  }
  
}

//login
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({ email })

    if (user && (await user.comparePassword(password))) {
      const {accessToken, refreshToken} = generateTokens(user._id)

      await storeRefreshToken(user._id, refreshToken)
      setCookies(res, accessToken, refreshToken)

      res.json({ user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }, message: "Logged in successfully" });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res.status(500).json({message: error.message});
  }
}

//logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; 
    if (refreshToken){
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); 
      await redis.del(`refresh_token: ${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({message: "Server Error", error: error.message });
  }
}

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // get refresh token from cookie
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" }); // return 401 status if no refresh token provided
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // if refresh token is provided, then decode it (get the payload of the token)
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`); // get the refresh token from redis

    if(storedToken !== refreshToken) { // if refresh token is not the same as the one in redis
      return res.status(401).json({ message: "Invalid refresh token" }); // return invalid refresh token
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"}) // if the refresh token is the same as the one in redis, then create new access token

    res.cookie("access_token", accessToken, { // store the access token in a cookie
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    res.json({ message: "Access token refreshed successfully" }); 

  } catch(error ){ // server error response

    console.log("Error in Refresh Access Token Controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });

  }
}
