import React, { createContext, useState, useContext } from "react";

const WardrobeContext = createContext();

export const WardrobeProvider = ({ children }) => {
  const [clothes, setClothes] = useState([]);

  const addClothingItem = (item) => {
    setClothes((prev) => [...prev, item]);
  };

  const stats = {
    totalItems: clothes.length,
    mostWorn: clothes[0]?.name || "N/A",
    leastWorn: clothes[clothes.length - 1]?.name || "N/A",
  };

  return (
    <WardrobeContext.Provider value={{ clothes, addClothingItem, stats }}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => useContext(WardrobeContext);
