import {User} from "@/models/User";
import { IUser } from "@/types/types";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: IUser = await req.json();
  await mongoose.connect(process.env.MONGO_URL);
  const pass = body.password;
  const email = body.email;
  const user = await User.findOne({email});

  if(user){
      return NextResponse.json({error: "User already exists"}, {status: 400});
  }
  
  if (!pass?.length || pass.length < 5) {
    new Error('password must be at least 5 characters');
  }

  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await User.create(body);
  return NextResponse.json(createdUser);
}