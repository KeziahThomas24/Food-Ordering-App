import Image from "next/image";
import { cartProductPrice } from "@/components/AppContext";
import Trash from "@/components/icons/Trash";


type Product = {
  _id: string;
  name: string;
  image: string;
  basePrice: number;
  size?: { _id: string; name: string, price: number }| null;
  extras?: { _id: string; name: string, price: number }[];
};

type CartProductProps = {
  product: Product;
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>, productId: string) => void;
};

const CartProduct: React.FC<CartProductProps> = ({ product, onRemove }) => {

  const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onRemove) {
      onRemove(event, product._id); // Pass product id to the onRemove handler
    }
  };

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image width={240} height={240} src={product.image} alt="" />
      </div>
      <div className="grow">
        <h3 className="font-semibold">{product.name}</h3>
        {product.size && (
          <div className="text-sm">
            Size: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length ? (
          <div className="text-sm text-gray-500">
            {product.extras.map(extra => (
              <div key={extra.name}>
                {extra.name} ${extra.price}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="text-lg font-semibold">${cartProductPrice(product)}</div>
      {!!onRemove && (
        <div className="ml-2">
          <button type="button" onClick={handleRemoveClick} className="p-2">
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
};

export default CartProduct;