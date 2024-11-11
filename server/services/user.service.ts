import userModel from "../models/user.model";
import { Response } from "express";
import { redis } from "../utils/redis";

//get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

   if(userJson){
    const user =  JSON.parse(userJson);
    res.status(201).json({
    success:true,
    user,
  })
}
}

//Get all Users

export const getAllUsersService = async () => {
  try {
    const users = await userModel.find().sort({createdAt:-1}); // Fetch all users
    return users;  // Return the fetched users
  } catch (error) {
    throw new Error('Error fetching users');
  }
};


//update user role
export const updateUserRoleService = async(res:Response, id:string, role:string)=>{
  const user =  await userModel.findByIdAndUpdate(id, {role}, {new:true});
  res.status(201).json({
    success:true,
    user,
  });
}
