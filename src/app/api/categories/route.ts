import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export async function POST(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const { name } = await req.json();
  if (await isAdmin()) {
    const categoryDoc = await Category.create({ name });
    return NextResponse.json(categoryDoc);
  } else {
    return NextResponse.json({});
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const { _id, name } = await req.json();
  if (await isAdmin()) {
    await Category.updateOne({ _id }, { name });
  }
  return NextResponse.json(true);
}

export async function GET(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const categories = await Category.find();
  return NextResponse.json(categories);
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Category.deleteOne({ _id });
  }
  return NextResponse.json(true);
}
