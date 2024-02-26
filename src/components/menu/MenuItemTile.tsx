import AddToCartButton from "@/components/menu/AddToCartButton";

type Category = {
  _id: string;
  name: string;
};

type MenuItemTileProps = {
  _id: string;
  onAddToCart: () => void;
  image: string;
  description: string;
  name: string;
  basePrice: number;
  sizes?: { _id: string; name: string; price: number }[];
  extraIngredientPrices?: { _id: string; name: string; price: number }[];
  category: Category;
};

export default function MenuItemTile({ onAddToCart, ...item }: MenuItemTileProps) {
  const {
    _id,
    image,
    description,
    name,
    basePrice,
    sizes,
    extraIngredientPrices,
    category
  } = item;
  const hasSizesOrExtras = (sizes?.length ?? 0) > 0 || (extraIngredientPrices?.length ?? 0) > 0;
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center">
        <img src={image} className="max-h-auto max-h-24 block mx-auto" alt="pizza" />
      </div>
      <h4 className="font-semibold text-xl my-3">{name}</h4>
      <p className="text-gray-500 text-sm line-clamp-3">
        {description}
      </p>
      <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={onAddToCart}
        basePrice={basePrice}
      />
    </div>
  );
}