import jwt from "jsonwebtoken";
const JWT_SECRET=process.env.JWT_SECRET;
export const generateToken=(userID)=>{
    return jwt.sign(
        {userID},
        JWT_SECRET,
        {expiresIn:"7d"}
    );
};