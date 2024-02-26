'use client'
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTab";
import { useProfile } from "@/components/UseProfile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type UserType = {
  _id: string;
  name?: string;
  image?: string;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  admin?: boolean;
  email: string; // Assuming email is always present
}

export default function EditUserPage() {
  const { loading, data } = useProfile();
  const [user, setUser] = useState<UserType | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch('/api/profile?_id=' + id)
        .then(res => res.json())
        .then((user: UserType) => {
          setUser(user);
        });
    }
  }, [id]);

  async function handleSaveButtonClick(ev: React.FormEvent, data: UserType) {
    ev.preventDefault();
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, _id: id }),
        });
        if (res.ok) resolve();
        else reject();
      } catch (error) {
        reject(error);
      }
    });

    await toast.promise(promise, {
      loading: 'Saving user...',
      success: 'User saved',
      error: 'An error has occurred while saving the user',
    });
  }

  if (loading) {
    return 'Loading user profile...';
  }

  if (!data?.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <UserForm user={user} onSave={handleSaveButtonClick} />
      </div>
    </section>
  );
}
