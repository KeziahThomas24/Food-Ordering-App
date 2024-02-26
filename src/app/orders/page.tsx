'use client'
import SectionHeaders from "@/components/layout/SectionHeaders";
import UserTabs from "@/components/layout/UserTab";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/lib/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";

type CartProductType = {
  _id: string;
  name: string;
  image: string;
  basePrice: number;
  size?: { _id: string; name: string, price: number };
  extras?: { _id: string; name: string, price: number }[];
};

type AddressInputsProps = {
  addressProps: {
    phone?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  setAddressProp: (key: keyof AddressInputsProps['addressProps'], value: string) => void;
  disabled?: boolean;
};

type OrderType = {
  _id: string;
  paid: boolean;
  userEmail: string;
  createdAt: string;
  cartProducts: CartProductType[];
  address: AddressInputsProps;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const { loading, data: profile } = useProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then((ordersData: OrderType[]) => {
        setOrders(ordersData.reverse());
        setLoadingOrders(false);
      });
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={profile?.admin ?? false} />
      <div className="mt-8">
        {loadingOrders && (
          <div>Loading orders...</div>
        )}
        {orders?.length > 0 && orders.map(order => (
          <div
            key={order._id}
            className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
          >
            <div className="grow flex flex-col md:flex-row items-center gap-6">
              <div>
                <div className={
                  (order.paid ? 'bg-green-500' : 'bg-red-400') +
                  ' p-2 rounded-md text-white w-24 text-center'
                }>
                  {order.paid ? 'Paid' : 'Not paid'}
                </div>
              </div>
              <div className="grow">
                <div className="flex gap-2 items-center mb-1">
                  <div className="grow">{order.userEmail}</div>
                  <div className="text-gray-500 text-sm">{dbTimeForHuman(order.createdAt)}</div>
                </div>
                <div className="text-gray-500 text-xs">
                  {order.cartProducts.map(p => p.name).join(', ')}
                </div>
              </div>
            </div>
            <div className="justify-end flex gap-2 items-center whitespace-nowrap">
              <Link href={"/orders/" + order._id} className="button">
                Show order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
