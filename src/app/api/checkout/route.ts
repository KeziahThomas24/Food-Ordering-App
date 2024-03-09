import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/auth";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2023-10-16',
});

type CartProduct = {
  _id: string;
  name: string;
  size?: {
    _id: string;
  };
  extras?: {
    _id: string;
  }[];
};

type Address = {
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  country?: string;
};

export async function POST(req: NextRequest, res: NextResponse) {
  await mongoose.connect(process.env.MONGO_URL!);

  const { cartProducts, address }: { cartProducts: CartProduct[], address: Address } = await req.json();
  // const session = await getServerSession({ req });
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const phone = address.phone;
  const streetAddress = address.streetAddress;
  const postalCode = address.postalCode;
  const city = address.city;
  const country = address.country;

  const orderDoc = await Order.create({
    userEmail,
    phone,
    streetAddress,
    postalCode,
    city,
    country,
    cartProducts,
    paid: false,
  });
  
  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const cartProduct of cartProducts) {
    const productInfo = await MenuItem.findById(cartProduct._id);

    let productPrice = productInfo.basePrice;
    if (cartProduct.size) {
      const size = productInfo.sizes
        .find((size: { _id: { toString: () => string; }; }) => size._id.toString() === cartProduct.size!._id.toString());
      productPrice += size!.price;
    }
    if (cartProduct.extras?.length && cartProduct.extras?.length > 0) {
      for (const cartProductExtraThing of cartProduct.extras) {
        const productExtras = productInfo.extraIngredientPrices;
        const extraThingInfo = productExtras
          .find((extra: { _id: { toString: () => string; }; }) => extra._id.toString() === cartProductExtraThing._id.toString());
        productPrice += extraThingInfo!.price;
      }
    }

    const productName = cartProduct.name;

    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: productName,
        },
        unit_amount: productPrice * 100,
      },
    });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    customer_email: userEmail!,
    success_url: process.env.NEXTAUTH_URL! + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
    cancel_url: process.env.NEXTAUTH_URL! + 'cart?canceled=1',
    metadata: { orderId: orderDoc._id.toString() },
    payment_intent_data: {
      metadata: { orderId: orderDoc._id.toString() },
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Delivery fee',
          type: 'fixed_amount',
          fixed_amount: { amount: 500, currency: 'USD' },
        },
      }
    ],
  });

  return NextResponse.json({ url: stripeSession.url });
}
