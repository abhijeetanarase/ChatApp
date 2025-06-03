import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const encodePassword = async(password) => { 
    const saltRounds = 10;
    return  await bcrypt.hash(password, saltRounds);
}


const decodePassword = async(password, hashedPassword) => {
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


const  gererateToken = (user)=>{
    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});
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

export {
    encodePassword,
    decodePassword,
    isValidEmail,
    isValidName,
    gererateToken,
    verifyToken
};

