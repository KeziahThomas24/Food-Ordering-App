import { NextResponse } from 'next/server';
import { isAdmin } from "@/auth";
import { User } from "@/models/User";
import mongoose from "mongoose";

export async function GET() {
  await mongoose.connect(process.env.MONGO_URL!);
  if (await isAdmin()) {
    const users = await User.find();
    return NextResponse.json(users);
  } else {
    return NextResponse.json([]);
  }
}
