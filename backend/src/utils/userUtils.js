import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
const encodePassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}


const decodePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// const isValidPassword = (password) => {
//     // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
// }
const isValidName = (name) => {
    // Name must be at least 2 characters long and can only contain letters and spaces
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
}


const gererateToken = (user , expiry = "30d") => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: expiry });
    return token;
}



const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null; // Token is invalid or expired
    }
}









export const sendEmail = async (email, token) => {
  const verificationUrl = `${process.env.VERIFICATION_URI}?token=${token}`;

  // Create transporter with Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,        // your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD // your Gmail App Password
    },
  });

  const mailOptions = {
    from: `"QuickPing" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #f9f9f9; color: #333;">
        <h2 style="color: #1a73e8; text-align: center;">Welcome to QuickPing!</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Thanks for registering with us. Please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="${verificationUrl}" 
            target="_blank" 
            style="
              background-color: #1a73e8; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              font-weight: bold; 
              border-radius: 6px;
              display: inline-block;
              box-shadow: 0 4px 6px rgba(26, 115, 232, 0.3);
              transition: background-color 0.3s ease;
            "
          >
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; color: #666; line-height: 1.4;">
          Or copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" target="_blank" style="color: #1a73e8; word-break: break-all;">${verificationUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you did not sign up for this account, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.response);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw error;
  }
};






export {
    encodePassword,
    decodePassword,
    isValidEmail,
    isValidName,
    gererateToken,
    verifyToken,
};

