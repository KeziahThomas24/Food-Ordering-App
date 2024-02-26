import { NextRequest, NextResponse } from 'next/server';
import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (_id) {
    const order = await Order.findById(_id);
    return NextResponse.json(order);
  }

  if (admin) {
    const orders = await Order.find();
    return NextResponse.json(orders);
  }

  if (userEmail) {
    const userOrders = await Order.find({ userEmail });
    return NextResponse.json(userOrders);
  }

  return NextResponse.json({ message: 'No orders found' });
}
