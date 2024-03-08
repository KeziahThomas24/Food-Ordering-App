import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from "@/auth";
import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

export async function POST(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const data = await req.json();
  if (await isAdmin()) {
    const menuItemDoc = await MenuItem.create(data);
    return NextResponse.json(menuItemDoc);
  } else {
    return NextResponse.json({});
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  if (await isAdmin()) {
    const { _id, ...data } = await req.json();
    await MenuItem.findByIdAndUpdate(_id, data);
  }
  return NextResponse.json(true);
}

export async function GET(_req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const menuItems = await MenuItem.find();
  return NextResponse.json(menuItems);
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await MenuItem.deleteOne({ _id });
  }
  return NextResponse.json(true);
}
