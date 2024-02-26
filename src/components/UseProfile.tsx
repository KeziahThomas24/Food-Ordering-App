import { useEffect, useState } from "react";

type ProfileData = {
  _id: string;
  name?: string;
  image?: string;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  admin?: boolean;
  email: string;
};

type ProfileHookResult = {
  loading: boolean;
  data: ProfileData | null;
};

export function useProfile(): ProfileHookResult {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/profile').then(response => {
      response.json().then(data => {
        setData(data);
        setLoading(false);
      });
    });
  }, []);

  return { loading, data };
}
