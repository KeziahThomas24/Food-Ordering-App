import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { IUser } from '@/types/types';

export async function PUT(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const data = await req.json();
  const { _id, name, image, ...otherUserInfo } = data;

  let filter: any = {};
  if (_id) {
    filter = { _id };
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({});
    }
    filter = { email };
  }

  const user = await User.findOne(filter);
  if (!user) {
    // return res.status(404).json({ error: 'User not found' });
    return NextResponse.json({ error: 'User not found' });
  }

  await User.updateOne(filter, { name, image });
  await UserInfo.findOneAndUpdate({ email: user.email }, otherUserInfo, { upsert: true });

  return NextResponse.json(true);
}

export async function GET(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');

  let filterUser: any = {};
  if (_id) {
    filterUser = { _id };
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({});
    }
    filterUser = { email };
  }

  const user = await User.findOne(filterUser).lean() as IUser;
  if (!user) {
    return NextResponse.json({ error: 'User not found' });
  }

  const userInfo = await UserInfo.findOne({ email: user.email }).lean();

  return NextResponse.json({ ...user, ...userInfo });
  
}
