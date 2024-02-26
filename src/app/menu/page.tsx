'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
};

type MenuItem = {
  _id: string;
  image: string;
  name: string;
  description: string;
  basePrice: number;
  sizes?: { _id: string; name: string; price: number }[];
  extraIngredientPrices?: { _id: string; name: string; price: number }[];
  category: Category;
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then((categories: Category[]) => setCategories(categories))
    });
    fetch('/api/menu-items').then(res => {
      res.json().then((menuItems: MenuItem[]) => setMenuItems(menuItems));
    });
  }, []);

  return (
    <section className="mt-8">
      {categories?.length > 0 && categories.map((c: Category) => (
        <div key={c._id}>
          <div className="text-center">
            <SectionHeaders mainHeader={c.name} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {menuItems.filter((item: MenuItem) => item.category._id === c._id).map((item: MenuItem) => (
              <MenuItem key={item._id} {...item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
