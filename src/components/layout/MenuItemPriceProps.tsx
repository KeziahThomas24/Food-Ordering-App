import React, { useState } from "react";
import ChevronDown from "@/components/icons/ChevronDown";
import ChevronUp from "@/components/icons/ChevronUp";
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";

type PriceProp = {
  _id?: string;
  name: string;
  price: number;
};

type MenuItemPricePropsProps = {
  name: string;
  addLabel: string;
  props: PriceProp[];
  setProps: React.Dispatch<React.SetStateAction<PriceProp[]>>;
};

const MenuItemPriceProps: React.FC<MenuItemPricePropsProps> = ({ name, addLabel, props, setProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  const addProp = () => {
    setProps(oldProps => {
      return [...oldProps, {name: '', price: 0 }];
    });
  };

  const editProp = (ev: React.ChangeEvent<HTMLInputElement>, index: number, prop: keyof PriceProp) => {
    const newValue = ev.target.value;
    setProps(prevSizes => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  };

  const removeProp = (indexToRemove: number) => {
    setProps(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex p-1 border-0 justify-start"
        type="button">
        {isOpen ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
        <span>{name}</span>
        <span>({props?.length})</span>
      </button>
      <div className={isOpen ? 'block' : 'hidden'}>
        {props?.length > 0 && props.map((size, index) => (
          <div key={index} className="flex items-end gap-2">
            <div>
              <label>Name</label>
              <input type="text"
                     placeholder="Size name"
                     value={size.name}
                     onChange={ev => editProp(ev, index, 'name')}
              />
            </div>
            <div>
              <label>Extra price</label>
              <input type="text" placeholder="Extra price"
                     value={size.price}
                     onChange={ev => editProp(ev, index, 'price')}
              />
            </div>
            <div>
              <button type="button"
                      onClick={() => removeProp(index)}
                      className="bg-white mb-2 px-2">
                <Trash />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addProp}
          className="bg-white items-center">
          <Plus className="w-4 h-4" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemPriceProps;
