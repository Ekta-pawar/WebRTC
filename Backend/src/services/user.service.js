import bcrypt from "dcrypt";
import { findUserByEmail,createUser } from "../repositories/user.repository";
export const registerUser=async ({email,name,password})=>{
    const existingUser=await findUserByEmail(email);
    if(existingUser){
       throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};