import React, { createContext, useState, useContext, useMemo } from "react";

const defaultValue = {
  clothes: [],
  addClothingItem: () => {},
  stats: { totalItems: 0, mostWorn: "N/A", leastWorn: "N/A" },
};

const WardrobeContext = createContext(defaultValue);

export const WardrobeProvider = ({ children }) => {
  const [clothes, setClothes] = useState([]);

  const addClothingItem = (item) => {
    setClothes((prev) => [...prev, item]);
  };

  const stats = useMemo(
    () => ({
      totalItems: clothes.length,
      mostWorn: clothes[0]?.name || "N/A",
      leastWorn: clothes[clothes.length - 1]?.name || "N/A",
    }),
    [clothes]
  );

  return (
    <WardrobeContext.Provider value={{ clothes, addClothingItem, stats }}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => useContext(WardrobeContext);
