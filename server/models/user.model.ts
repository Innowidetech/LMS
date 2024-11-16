import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
require('dotenv').config();
import jwt from 'jsonwebtoken';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

enum Role{
  user='user',
  admin='admin',
}

export interface IUser extends Document {
  
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role:Role;
  isVerified: boolean;
  _id:string;
  courses: Array<{courseId:string}>;
  comparePassword: (password: string) => Promise<boolean>;

  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validation: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      // required:[true, "Role must be specified"]
      default: Role.user,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

//Hash Password before saving

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign acess token

userSchema.methods.SignAccessToken = function(){
  return jwt.sign({id:this._id},process.env.ACCESS_TOKEN || '',{
    expiresIn:"5m",
  });
};

//sign refresh token
userSchema.methods.SignRefreshToken = function(){

return jwt.sign({id: this._id},process.env.REFRESH_TOKEN ||'',{
  expiresIn:"3d",
});
};

// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
