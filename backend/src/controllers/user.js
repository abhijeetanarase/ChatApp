
import User from "../models/user.js";
import {
  decodePassword,
  encodePassword,
  gererateToken,
  isValidEmail,
  sendEmail,
  // isValidPassword,
} from "../utils/userUtils.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import verificationsucess from "../templates/verificationsucess.js";
import alreadyverfied from "../templates/alreadyverfied.js";
import linkexpiration from "../templates/linkexpiration.js";
import tokennotfound from "../templates/tokennotfound.js";
import usernotfound from "../templates/usernotfound.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }


    const hashedPassword = await encodePassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    const token = gererateToken(user, '10m');
    res.status(201).json({
      message: "Please check you mail for verification",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    sendEmail(user.email, token)
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format", success: false });
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not registerd", success: false });
    }
    if (!user.verified) {
      return res.status(400).json({ message: "User not verfiled", success: false });
    }
    if (user.password) {
      const isPasswordValid = await decodePassword(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(403)
          .json({ message: "Invalid credentials", success: false });
      }
    }
    else {
      return res.status(403).json({ message: "Please continue with google login" })
    }

    const token = gererateToken(user);
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const redirectToGoogle = (req, res) => {
  const redirectUri =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

  res.redirect(redirectUri);
};

export const googleAuthCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code.");
  }

  try {
    const { data: tokenResponse } = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const idToken = tokenResponse.id_token;
    const payload = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64").toString("utf-8")
    );

    const userData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      verified: true
    };

    // Update or create user
    const user = await User.findOneAndUpdate(
      { email: payload.email },
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Redirect with token
    res.redirect(
      `${process.env.FRONTEND_URL
      }/success?token=${jwtToken}&email=${encodeURIComponent(
        user.email
      )}&name=${encodeURIComponent(user.name)}&picture=${encodeURIComponent(
        user.picture
      )}&id=${encodeURIComponent(user.id)}`
    );
  } catch (err) {
    console.error("OAuth Error:", err.response?.data || err.message);
    res.status(500).send("Authentication failed");
  }
};





export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send(tokennotfound);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send(usernotfound);
    }

    if (user.verified) {
      return res.status(400).send(alreadyverfied);
    }

    user.verified = true;
    await user.save();

    // Success HTML template
    return res.send(verificationsucess);

  } catch (error) {
    console.error('Email verification failed:', error.message);

    let errorMessage = 'Invalid or malformed verification token.';
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Verification link has expired. Please request a new one.';
    }

    return res.status(400).send(linkexpiration(errorMessage));
  }
};





