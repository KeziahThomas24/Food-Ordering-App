"use client"
import EditableImage from "@/components/layout/EditableImage";
import InfoBox from "@/components/layout/InfoBox";
import SuccessBox from "@/components/layout/SuccessBox";
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTab";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type UserType = {
  _id?: string;
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

export default function ProfilePage() {
  const { data: sessions, status } = useSession();
  const session1 = getSession();

  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   async function fetchSession() {
  //     const session = await getSession();
  //     console.log("Saeed"+session);
  //     setSession(session);
  //     console.log("Saeed"+session);// corrected from session1 to session
  //   }
  //   fetchSession();
  // }, [session]);

  const [user, setUser] = useState<UserType | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [profileFetched, setProfileFetched] = useState<boolean>(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile')
        .then(response => response.json())
        .then((data: UserType) => {
          setUser(data);
          setIsAdmin(data.admin??false);
          setProfileFetched(true);
        });
    }
  }, [status]);

  async function handleProfileInfoUpdate(ev: React.FormEvent, data: UserType) {
    ev.preventDefault();

    const savingPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) resolve();
        else reject();
      } catch (error) {
        reject(error);
      }
    });

    await toast.promise(savingPromise, {
      loading: 'Saving...',
      success: 'Profile saved!',
      error: 'Error',
    });
  }

  if (status === 'loading' || !profileFetched) {
    return 'Loading...';
  }

  if (status === 'unauthenticated') {
    return redirect('/login');
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />
      <div className="max-w-2xl mx-auto mt-8">
        {user && <UserForm user={user} onSave={handleProfileInfoUpdate} />}
      </div>
    </section>
  );
}
