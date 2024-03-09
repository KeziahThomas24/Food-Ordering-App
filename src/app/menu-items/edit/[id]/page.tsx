'use client';
import DeleteButton from "@/components/DeleteButton";
import Left from "@/components/icons/Left";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTab";
import { useProfile } from "@/components/UseProfile";
import { _id } from "@next-auth/mongodb-adapter";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Category = {
  _id: string;
  name: string;
  // Add more properties if needed
}

type MenuItem = {
  _id?: string;
  image: string;
  name: string;
  description: string;
  basePrice: string;
  sizes?: { _id?: string; name: string; price: number }[];
  extraIngredientPrices?: { _id?: string; name: string; price: number }[];
  category: Category;
}

export default function EditMenuItemPage() {
  const { id } = useParams();
  // const menuItemId: number = parseInt(id[0]);

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [redirectToItems, setRedirectToItems] = useState<boolean>(false);
  const { loading, data } = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(items => {
        const item = items.find((i: MenuItem) => i._id === id);
        setMenuItem(item);
      });
    });
  }, []);

  async function handleFormSubmit(ev: React.FormEvent<HTMLFormElement>, data: MenuItem) {
    ev.preventDefault();
    console.log(id);
    data = { ...data, _id: Array.isArray(id) ? id[0] : id };
    const savingPromise = new Promise<void>(async (resolve, reject) => {
      const response = await fetch('/api/menu-items', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(savingPromise, {
      loading: 'Saving this tasty item',
      success: 'Saved',
      error: 'Error',
    });

    setRedirectToItems(true);
  }

  async function handleDeleteClick() {
    const promise = new Promise<void>(async (resolve, reject) => {
      const res = await fetch('/api/menu-items?_id=' + id, {
        method: 'DELETE',
      });
      if (res.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(promise, {
      loading: 'Deleting...',
      success: 'Deleted',
      error: 'Error',
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect('/menu-items');
  }

  if (loading) {
    return 'Loading user info...';
  }

  if (!data?.admin) {
    return 'Not an admin.';
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href={'/menu-items'} className="button">
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
      <div className="max-w-md mx-auto mt-2">
        <div className="max-w-xs ml-auto pl-4">
          <DeleteButton
            label="Delete this menu item"
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
    </section>
  );
}
